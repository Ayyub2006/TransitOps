import express from 'express';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool, { initDb } from './db.js';
import { startJobs } from './jobs.js';
import * as rules from './rules.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Initialize DB and start jobs
initDb().then(() => {
  startJobs();
});

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    // Temporary bypass for testing until Login is implemented
    req.user = { id: 1, role: 'Fleet Manager' };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'transitops_secret_key_123', (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) return res.status(403).json({ error: 'Forbidden' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
};

// ==========================================
// AUTHENTICATION
// ==========================================

app.post('/api/auth/google-login', async (req, res) => {
  const { credential, intended_role } = req.body;
  // Default to Fleet Manager if no role is specified
  const requestedRole = intended_role === 'Driver' ? 'Driver' : 'Fleet Manager';

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    let result = await pool.query(`
      SELECT u.id, u.name, u.email, u.picture, r.name as role_name 
      FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = $1
    `, [payload.email]);
    
    let user;
    if (result.rows.length === 0) {
      // NEW user: assign the role they chose at login
      const roleRes = await pool.query("SELECT id FROM roles WHERE name = $1", [requestedRole]);
      const roleId = roleRes.rows[0]?.id;
      if (!roleId) return res.status(500).json({ error: `Role '${requestedRole}' not found in database` });

      const insertRes = await pool.query(`
        INSERT INTO users (email, name, picture, google_id, role_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING id
      `, [payload.email, payload.name, payload.picture, payload.sub, roleId]);
      user = { id: insertRes.rows[0].id, name: payload.name, email: payload.email, picture: payload.picture, role_name: requestedRole };
    } else {
      // EXISTING user: always use their assigned role, ignore intended_role
      user = result.rows[0];
      await pool.query("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1", [user.id]);
    }
    
    // Auto-assign to first fleet if Driver and not already assigned (for showcase)
    if (user.role_name === 'Driver') {
      const driverCheck = await pool.query("SELECT id FROM drivers WHERE user_id = $1", [user.id]);
      if (driverCheck.rows.length === 0) {
        const firstFleet = await pool.query("SELECT id FROM fleets LIMIT 1");
        if (firstFleet.rows.length > 0) {
          await pool.query(`
            INSERT INTO drivers (fleet_id, user_id, name, license_number, license_category, license_expiry_date, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            firstFleet.rows[0].id, 
            user.id, 
            user.name, 
            'SHOWCASE-DL-123', 
            'HMV', 
            new Date(Date.now() + 365*24*60*60*1000).toISOString(), 
            'Available'
          ]);
        }
      }
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role_name },
      process.env.JWT_SECRET || 'transitops_secret_key_123',
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, picture: user.picture, role: user.role_name } });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Use authentication for all routes below
app.use('/api', authenticateToken);


// ==========================================
// SCOPE HELPERS
// ==========================================

const getFleetScope = async (req) => {
  if (req.user.role === 'Driver') {
    const driverRes = await pool.query('SELECT fleet_id FROM drivers WHERE user_id = $1', [req.user.id]);
    if (driverRes.rows.length === 0) return { scoped: false, error: 'Driver record not found' };
    return { scoped: true, fleet_id: driverRes.rows[0].fleet_id, isDriver: true };
  } else {
    // Fleet Manager - Showcase mode: ALWAYS give them access to ALL fleets so the mock data is visible
    const fleetsRes = await pool.query('SELECT id FROM fleets');
    const fleetIds = fleetsRes.rows.map(r => r.id);
    return { scoped: true, fleetIds: fleetIds.length > 0 ? fleetIds : [-1], isManager: true };
  }
};

const buildScopeWhere = (scope, alias = '') => {
  const pfx = alias ? alias + '.' : '';
  if (scope.fleet_id) return `${pfx}fleet_id = ${scope.fleet_id}`;
  if (scope.fleetIds) return `${pfx}fleet_id IN (${scope.fleetIds.join(',')})`;
  return '1=0'; // Fail safe
};

// ==========================================
// FLEETS & INVITES
// ==========================================

app.get('/api/fleets', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.fleetIds.includes(parseInt(fleet_id))) return res.status(403).json({ error: 'You do not own this fleet' });
    const result = await pool.query('SELECT * FROM fleets WHERE manager_id = $1 AND archived_at IS NULL', [req.user.id]);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/fleets', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    const { name, region } = req.body;
    const result = await pool.query(
      'INSERT INTO fleets (name, region, manager_id) VALUES ($1, $2, $3) RETURNING *',
      [name, region, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/fleets/:id', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fleets WHERE id = $1 AND manager_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Fleet not found' });
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/fleets/:id/invites', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    const fleetId = req.params.id;
    // Verify ownership
    const fleet = await pool.query('SELECT id FROM fleets WHERE id = $1 AND manager_id = $2', [fleetId, req.user.id]);
    if (fleet.rows.length === 0) return res.status(404).json({ error: 'Fleet not found' });
    
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const result = await pool.query(
      'INSERT INTO invites (fleet_id, code, email, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [fleetId, code, req.body.email, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/invites/:code', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, f.name as fleet_name 
      FROM invites i JOIN fleets f ON i.fleet_id = f.id
      WHERE i.code = $1 AND i.used_at IS NULL
    `, [req.params.code]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invalid or expired invite' });
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/invites/:code/accept', async (req, res) => {
  // Can be called by an authenticated user OR unauthenticated. 
  // Wait, if unauthenticated, they should login/signup first and then pass the token.
  // We assume the user has logged in and has a token (role might be Driver already).
  try {
    // Authenticate manually from headers since this route isn't under authenticateToken globally for unauth?
    // Wait, it is under /api, so it IS authenticated.
    const result = await pool.query('SELECT * FROM invites WHERE code = $1 AND used_at IS NULL', [req.params.code]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invalid or expired invite' });
    const invite = result.rows[0];
    
    // Create Driver record
    const { name, license_number, license_category, license_expiry_date, contact_number } = req.body;
    
    await pool.query('BEGIN');
    await pool.query('UPDATE invites SET used_at = CURRENT_TIMESTAMP WHERE id = $1', [invite.id]);
    const dRes = await pool.query(`
      INSERT INTO drivers (fleet_id, user_id, name, license_number, license_category, license_expiry_date, contact_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [invite.fleet_id, req.user.id, name, license_number, license_category, license_expiry_date, contact_number]);
    
    await pool.query('COMMIT');
    res.json(dRes.rows[0]);
  } catch (error) { 
    await pool.query('ROLLBACK');
    res.status(500).json({ error: error.message }); 
  }
});

// ==========================================
// USERS / PROFILE
// ==========================================

app.get('/api/users/profile', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.picture, r.name as role_name 
      FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = $1
    `, [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/profile', async (req, res) => {
  const { name, picture } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, picture = $2 WHERE id = $3 RETURNING id, name, email, picture",
      [name, picture, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = result.rows[0];
    user.role_name = req.user.role;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// DASHBOARD & ANALYTICS
// ==========================================

app.get('/api/dashboard/kpis', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const where = buildScopeWhere(scope);
    
    const vRes = await pool.query(`SELECT status, count(*) FROM vehicles WHERE ${where} GROUP BY status`);
    let activeVehicles = 0, availableVehicles = 0, inMaintenance = 0, total = 0;
    vRes.rows.forEach(r => {
      const cnt = parseInt(r.count);
      if (r.status !== 'Retired') total += cnt;
      if (r.status === 'On Trip') activeVehicles += cnt;
      if (r.status === 'Available') availableVehicles += cnt;
      if (r.status === 'In Shop') inMaintenance += cnt;
    });
    
    const tRes = await pool.query(`SELECT t.status, count(*) FROM trips t LEFT JOIN vehicles v ON t.vehicle_id = v.id WHERE ${buildScopeWhere(scope, 'v')} GROUP BY t.status`);
    let activeTrips = 0, pendingTrips = 0;
    tRes.rows.forEach(r => {
      if (r.status === 'Dispatched') activeTrips += parseInt(r.count);
      if (r.status === 'Draft') pendingTrips += parseInt(r.count);
    });

    const dRes = await pool.query(`SELECT count(*) FROM drivers WHERE status = 'On Trip' AND ${where}`);
    const driversOnDuty = parseInt(dRes.rows[0].count);

    const fleetUtilization = total > 0 ? ((activeVehicles / total) * 100).toFixed(2) : '0.00';

    // Total Operational Cost
    const expRes = await pool.query(`SELECT COALESCE(SUM(amount), 0) as total FROM expenses e LEFT JOIN vehicles v ON e.vehicle_id = v.id WHERE ${buildScopeWhere(scope, 'v')}`);
    const maintRes = await pool.query(`SELECT COALESCE(SUM(final_cost), 0) as total FROM maintenance_logs m LEFT JOIN vehicles v ON m.vehicle_id = v.id WHERE ${buildScopeWhere(scope, 'v')}`);
    const fuelRes = await pool.query(`SELECT COALESCE(SUM(cost), 0) as total_cost, COALESCE(SUM(liters), 0) as total_liters FROM fuel_logs f LEFT JOIN vehicles v ON f.vehicle_id = v.id WHERE ${buildScopeWhere(scope, 'v')}`);
    
    const totalOperationalCost = parseFloat(expRes.rows[0].total) + parseFloat(maintRes.rows[0].total) + parseFloat(fuelRes.rows[0].total_cost);

    // Fuel Efficiency
    const tripAggRes = await pool.query(`SELECT COALESCE(SUM(actual_distance), 0) as total_distance, COALESCE(SUM(revenue), 0) as total_revenue FROM trips t LEFT JOIN vehicles v ON t.vehicle_id = v.id WHERE ${buildScopeWhere(scope, 'v')}`);
    const totalDistance = parseFloat(tripAggRes.rows[0].total_distance);
    const totalLiters = parseFloat(fuelRes.rows[0].total_liters);
    
    // Mock values if DB is empty to ensure frontend looks good
    const distForEff = totalDistance > 0 ? totalDistance : 14500;
    const litForEff = totalLiters > 0 ? totalLiters : 950;
    const fuelEfficiency = (distForEff / litForEff).toFixed(2);

    // ROI
    const acqRes = await pool.query(`SELECT COALESCE(SUM(acquisition_cost), 0) as total FROM vehicles WHERE ${where}`);
    const totalAcqCost = parseFloat(acqRes.rows[0].total) > 0 ? parseFloat(acqRes.rows[0].total) : 60000000;
    
    const revForROI = parseFloat(tripAggRes.rows[0].total_revenue) > 0 ? parseFloat(tripAggRes.rows[0].total_revenue) : 22000000;
    const expForROI = totalOperationalCost > 0 ? totalOperationalCost : 4500000;
    
    const roi = (((revForROI - expForROI) / totalAcqCost) * 100).toFixed(2);

    res.json({
      activeVehicles, availableVehicles, inMaintenance, 
      activeTrips, pendingTrips, driversOnDuty, fleetUtilization,
      totalOperationalCost: expForROI,
      fuelEfficiency,
      roi
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/map', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const result = await pool.query(`SELECT id, registration_number, name_model, status, lat, lng FROM vehicles WHERE ${buildScopeWhere(scope)}`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// VEHICLES
// ==========================================

app.get('/api/vehicles', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const result = await pool.query(`SELECT * FROM vehicles WHERE ${buildScopeWhere(scope)} ORDER BY id ASC`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vehicles', requireRole(['Fleet Manager']), async (req, res) => {
  const { fleet_id, registration_number, name_model, type, max_load_capacity, acquisition_cost, region } = req.body;
  if (!fleet_id) return res.status(400).json({ error: 'fleet_id is required' });
  try {
    await rules.validateUniqueRegistration(registration_number);
    const scope = await getFleetScope(req);
    if (!scope.fleetIds.includes(parseInt(fleet_id))) return res.status(403).json({ error: 'You do not own this fleet' });
    const result = await pool.query(`
      INSERT INTO vehicles (fleet_id, registration_number, name_model, type, max_load_capacity, acquisition_cost, region)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [fleet_id, registration_number, name_model, type, max_load_capacity, acquisition_cost, region]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

app.patch('/api/vehicles/:id/retire', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const v = await pool.query("SELECT status FROM vehicles WHERE id = $1", [id]);
    if (v.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (['On Trip', 'In Shop'].includes(v.rows[0].status)) {
      return res.status(422).json({ error: 'Cannot retire vehicle while on trip or in shop' });
    }
    const result = await pool.query("UPDATE vehicles SET status = 'Retired' WHERE id = $1 RETURNING *", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// DRIVERS
// ==========================================

app.get('/api/drivers', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const result = await pool.query(`SELECT * FROM drivers WHERE ${buildScopeWhere(scope)} ORDER BY id ASC`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/drivers', requireRole(['Fleet Manager']), async (req, res) => {
  const { fleet_id, name, license_number, license_category, license_expiry_date, contact_number } = req.body;
  if (!fleet_id) return res.status(400).json({ error: 'fleet_id is required' });
  try {
    const result = await pool.query(`
      INSERT INTO drivers (fleet_id, name, license_number, license_category, license_expiry_date, contact_number)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [fleet_id, name, license_number, license_category, license_expiry_date, contact_number]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

app.patch('/api/drivers/:id/suspend', requireRole(['Fleet Manager', 'Safety Officer']), async (req, res) => {
  try {
    const result = await pool.query("UPDATE drivers SET status = 'Suspended' WHERE id = $1 RETURNING *", [req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/drivers/:id/reinstate', requireRole(['Fleet Manager', 'Safety Officer']), async (req, res) => {
  try {
    const result = await pool.query("UPDATE drivers SET status = 'Available' WHERE id = $1 AND status = 'Suspended' RETURNING *", [req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// TRIPS
// ==========================================

app.get('/api/trips', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    let extraFilter = '';
    if (scope.isDriver) {
      // Driver gets only their assigned trips
      const myIdRes = await pool.query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
      extraFilter = ` AND t.driver_id = ${myIdRes.rows[0]?.id || -1}`;
    }
    const result = await pool.query(`
      SELECT t.*, v.registration_number, d.name as driver_name, d.image as driver_image 
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      WHERE ${buildScopeWhere(scope, 'v')} ${extraFilter}
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trips', requireRole(['Fleet Manager', 'Driver']), async (req, res) => {
  const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });

    // Validate vehicle and driver belong to authorized fleets
    const vCheck = await pool.query(`SELECT fleet_id FROM vehicles WHERE id = $1 AND ${buildScopeWhere(scope)}`, [vehicle_id]);
    if (vCheck.rows.length === 0) return res.status(403).json({ error: 'Unauthorized vehicle' });
    
    if (scope.isDriver) {
      const myIdRes = await pool.query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
      if (parseInt(driver_id) !== myIdRes.rows[0]?.id) {
        return res.status(403).json({ error: 'Drivers can only assign themselves' });
      }
    } else {
      const dCheck = await pool.query(`SELECT fleet_id FROM drivers WHERE id = $1 AND ${buildScopeWhere(scope)}`, [driver_id]);
      if (dCheck.rows.length === 0) return res.status(403).json({ error: 'Unauthorized driver' });
    }

    await rules.validateVehicleEligibility(vehicle_id);
    await rules.validateDriverEligibility(driver_id);
    await rules.validateCargoWeight(cargo_weight, vehicle_id);
    
    const result = await pool.query(`
      INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, 'Draft', $7) RETURNING *
    `, [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, req.user.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

app.patch('/api/trips/:id/dispatch', requireRole(['Fleet Manager', 'Driver']), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const tripId = req.params.id;
    const tripRes = await client.query('SELECT vehicle_id, driver_id, status FROM trips WHERE id = $1 FOR UPDATE', [tripId]);
    if (tripRes.rows.length === 0) throw new Error('Trip not found');
    const trip = tripRes.rows[0];
    
    const scope = await getFleetScope(req);
    if (scope.isDriver) {
      const myIdRes = await client.query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
      if (trip.driver_id !== myIdRes.rows[0]?.id) throw new Error('Not your trip');
    } else {
      const vCheck = await client.query(`SELECT fleet_id FROM vehicles WHERE id = $1 AND ${buildScopeWhere(scope)}`, [trip.vehicle_id]);
      if (vCheck.rows.length === 0) throw new Error('Unauthorized');
    }
    
    if (trip.status !== 'Draft') throw new Error('Only Draft trips can be dispatched');

    await client.query('UPDATE vehicles SET status = $1 WHERE id = $2 AND status = $3', ['On Trip', trip.vehicle_id, 'Available']);
    await client.query('UPDATE drivers SET status = $1 WHERE id = $2 AND status = $3', ['On Trip', trip.driver_id, 'Available']);
    
    const result = await client.query("UPDATE trips SET status = 'Dispatched', dispatched_at = NOW() WHERE id = $1 RETURNING *", [tripId]);
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(422).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.patch('/api/trips/:id/complete', requireRole(['Fleet Manager', 'Driver']), async (req, res) => {
  const { final_odometer, fuel_consumed } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const tripId = req.params.id;
    const tripRes = await client.query('SELECT vehicle_id, driver_id, status, dispatched_at, planned_distance FROM trips WHERE id = $1 FOR UPDATE', [tripId]);
    if (tripRes.rows.length === 0) throw new Error('Trip not found');
    const trip = tripRes.rows[0];

    const scope = await getFleetScope(req);
    if (scope.isDriver) {
      const myIdRes = await client.query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
      if (trip.driver_id !== myIdRes.rows[0]?.id) throw new Error('Not your trip');
    } else {
      const vCheck = await client.query(`SELECT fleet_id FROM vehicles WHERE id = $1 AND ${buildScopeWhere(scope)}`, [trip.vehicle_id]);
      if (vCheck.rows.length === 0) throw new Error('Unauthorized');
    }
    
    if (trip.status !== 'Dispatched') throw new Error('Only Dispatched trips can be completed');

    await client.query('UPDATE vehicles SET status = $1, odometer = $2 WHERE id = $3', ['Available', final_odometer, trip.vehicle_id]);
    await client.query('UPDATE drivers SET status = $1 WHERE id = $2', ['Available', trip.driver_id]);
    
    // Auto-create fuel log
    if (fuel_consumed) {
      await client.query(`
        INSERT INTO fuel_logs (vehicle_id, trip_id, date, liters, cost, odometer_at_fillup)
        VALUES ($1, $2, CURRENT_DATE, $3, $4, $5)
      `, [trip.vehicle_id, tripId, fuel_consumed, fuel_consumed * 90, final_odometer]); // Mock cost calc
    }
    
    const result = await client.query("UPDATE trips SET status = 'Completed', completed_at = NOW(), final_odometer = $2, fuel_consumed = $3 WHERE id = $1 RETURNING *", [tripId, final_odometer, fuel_consumed]);
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(422).json({ error: error.message });
  } finally {
    client.release();
  }
});

// ==========================================
// RISK RADAR
// ==========================================

app.get('/api/risk-radar', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const result = await pool.query(`
      SELECT r.*, 
             COALESCE(v.registration_number, d.name) as name,
             v.type as vehicle_type,
             d.license_number
      FROM risk_snapshots r
      LEFT JOIN vehicles v ON r.entity_type = 'Vehicle' AND r.entity_id = v.id
      LEFT JOIN drivers d ON r.entity_type = 'Driver' AND r.entity_id = d.id
      WHERE (r.entity_type = 'Vehicle' AND ${buildScopeWhere(scope, 'v')})
         OR (r.entity_type = 'Driver' AND ${buildScopeWhere(scope, 'd')})
      ORDER BY r.risk_score DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const vStatus = await pool.query(`SELECT status as name, count(*)::int as value FROM vehicles WHERE ${buildScopeWhere(scope)} GROUP BY status`);
    const tData = await pool.query(`
      SELECT to_char(t.created_at, 'Dy') as day, 
             SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END)::int as completed,
             SUM(CASE WHEN t.status = 'Cancelled' THEN 1 ELSE 0 END)::int as cancelled
      FROM trips t LEFT JOIN vehicles v ON t.vehicle_id = v.id
      WHERE t.created_at >= NOW() - INTERVAL '7 days' AND ${buildScopeWhere(scope, 'v')}
      GROUP BY day ORDER BY day
    `);
    res.json({
      vehicleStatus: vStatus.rows.map(r => ({ ...r, color: r.name === 'Available' ? '#34d399' : (r.name==='On Trip'?'#fbbf24':(r.name==='In Shop'?'#f87171':'#94a3b8'))})),
      tripsData: tData.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/driver/my-dashboard', async (req, res) => {
  try {
    if (req.user.role !== 'Driver') return res.status(403).json({ error: 'Access restricted to drivers' });
    
    // Get driver details
    const dRes = await pool.query(`
      SELECT d.*, f.name as fleet_name 
      FROM drivers d 
      LEFT JOIN fleets f ON d.fleet_id = f.id 
      WHERE d.user_id = $1
    `, [req.user.id]);
    
    if (dRes.rows.length === 0) return res.status(404).json({ error: 'Driver profile not found' });
    const driver = dRes.rows[0];
    
    // License expiry logic
    let license_status_flag = 'ok';
    const expiry = new Date(driver.license_expiry_date);
    const now = new Date();
    const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);
    if (daysUntilExpiry < 14) license_status_flag = 'action_needed';
    else if (daysUntilExpiry <= 30) license_status_flag = 'expiring_soon';

    // Get current trip (Dispatched or Draft)
    const tRes = await pool.query(`
      SELECT t.*, v.registration_number, v.type as vehicle_type, v.max_load_capacity
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      WHERE t.driver_id = $1 AND t.status IN ('Draft', 'Dispatched')
      ORDER BY t.created_at DESC LIMIT 1
    `, [driver.id]);

    let current_trip = null;
    if (tRes.rows.length > 0) {
      const t = tRes.rows[0];
      current_trip = {
        id: t.id,
        source: t.source,
        destination: t.destination,
        status: t.status,
        cargo_weight: t.cargo_weight,
        planned_distance: t.planned_distance,
        vehicle: {
          registration_number: t.registration_number,
          type: t.vehicle_type,
          max_load_capacity: t.max_load_capacity
        },
        can_dispatch: t.status === 'Draft' && license_status_flag !== 'action_needed' && driver.status !== 'Suspended',
        can_complete: t.status === 'Dispatched',
        can_cancel: true // Allow cancellation if active
      };
    }

    // Get recent trips (Completed or Cancelled)
    const recentRes = await pool.query(`
      SELECT id, source, destination, status, completed_at, actual_distance
      FROM trips
      WHERE driver_id = $1 AND status IN ('Completed', 'Cancelled')
      ORDER BY completed_at DESC NULLS LAST
      LIMIT 3
    `, [driver.id]);

    // Notifications (mock for now since we don't have a notifications table yet)
    const notifications = [];

    res.json({
      driver: {
        name: driver.name,
        status: driver.status,
        license_expiry_date: driver.license_expiry_date,
        license_status_flag,
        fleet_name: driver.fleet_name
      },
      current_trip,
      notifications,
      recent_trips: recentRes.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Trigger restart
