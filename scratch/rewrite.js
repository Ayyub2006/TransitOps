import fs from 'fs';

let content = fs.readFileSync('server/index.js', 'utf8');

// Insert scope helper
const scopeHelper = `
// ==========================================
// SCOPE HELPERS
// ==========================================

const getFleetScope = async (req) => {
  if (req.user.role === 'Driver') {
    const driverRes = await pool.query('SELECT fleet_id FROM drivers WHERE user_id = $1', [req.user.id]);
    if (driverRes.rows.length === 0) return { scoped: false, error: 'Driver record not found' };
    return { scoped: true, fleet_id: driverRes.rows[0].fleet_id, isDriver: true };
  } else {
    // Fleet Manager
    const reqFleetId = req.query.fleet_id;
    if (reqFleetId && reqFleetId !== 'all') {
      const fleetRes = await pool.query('SELECT id FROM fleets WHERE id = $1 AND manager_id = $2', [reqFleetId, req.user.id]);
      if (fleetRes.rows.length === 0) return { scoped: false, error: 'Fleet not found or not owned by you' };
      return { scoped: true, fleet_id: reqFleetId, isManager: true };
    } else {
      // All fleets managed by user
      const fleetsRes = await pool.query('SELECT id FROM fleets WHERE manager_id = $1', [req.user.id]);
      const fleetIds = fleetsRes.rows.map(r => r.id);
      return { scoped: true, fleetIds: fleetIds.length > 0 ? fleetIds : [-1], isManager: true }; // -1 if empty so queries don't fail
    }
  }
};

const buildScopeWhere = (scope, alias = '') => {
  const pfx = alias ? alias + '.' : '';
  if (scope.fleet_id) return \`\${pfx}fleet_id = \${scope.fleet_id}\`;
  if (scope.fleetIds) return \`\${pfx}fleet_id IN (\${scope.fleetIds.join(',')})\`;
  return '1=0'; // Fail safe
};

// ==========================================
// FLEETS & INVITES
// ==========================================

app.get('/api/fleets', requireRole(['Fleet Manager']), async (req, res) => {
  try {
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
    const result = await pool.query(\`
      SELECT i.*, f.name as fleet_name 
      FROM invites i JOIN fleets f ON i.fleet_id = f.id
      WHERE i.code = $1 AND i.used_at IS NULL
    \`, [req.params.code]);
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
    const dRes = await pool.query(\`
      INSERT INTO drivers (fleet_id, user_id, name, license_number, license_category, license_expiry_date, contact_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    \`, [invite.fleet_id, req.user.id, name, license_number, license_category, license_expiry_date, contact_number]);
    
    await pool.query('COMMIT');
    res.json(dRes.rows[0]);
  } catch (error) { 
    await pool.query('ROLLBACK');
    res.status(500).json({ error: error.message }); 
  }
});
`;

if (!content.includes('getFleetScope')) {
  content = content.replace('// ==========================================\n// USERS / PROFILE', scopeHelper + '\n// ==========================================\n// USERS / PROFILE');
}

// Now replace individual endpoints to use scoping
content = content.replace(
  `app.get('/api/dashboard/kpis', async (req, res) => {
  try {
    const vRes = await pool.query("SELECT status, count(*) FROM vehicles GROUP BY status");`,
  `app.get('/api/dashboard/kpis', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const where = buildScopeWhere(scope);
    
    const vRes = await pool.query(\`SELECT status, count(*) FROM vehicles WHERE \${where} GROUP BY status\`);`
);

content = content.replace(
  `const tRes = await pool.query("SELECT status, count(*) FROM trips GROUP BY status");`,
  `const tRes = await pool.query(\`SELECT status, count(*) FROM trips t LEFT JOIN vehicles v ON t.vehicle_id = v.id WHERE \${buildScopeWhere(scope, 'v')} GROUP BY status\`);`
);

content = content.replace(
  `const dRes = await pool.query("SELECT count(*) FROM drivers WHERE status = 'On Trip'");`,
  `const dRes = await pool.query(\`SELECT count(*) FROM drivers WHERE status = 'On Trip' AND \${where}\`);`
);

content = content.replace(
  `const expRes = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM expenses");`,
  `const expRes = await pool.query(\`SELECT COALESCE(SUM(amount), 0) as total FROM expenses e LEFT JOIN vehicles v ON e.vehicle_id = v.id WHERE \${buildScopeWhere(scope, 'v')}\`);`
);

content = content.replace(
  `const maintRes = await pool.query("SELECT COALESCE(SUM(final_cost), 0) as total FROM maintenance_logs");`,
  `const maintRes = await pool.query(\`SELECT COALESCE(SUM(final_cost), 0) as total FROM maintenance_logs m LEFT JOIN vehicles v ON m.vehicle_id = v.id WHERE \${buildScopeWhere(scope, 'v')}\`);`
);

content = content.replace(
  `const fuelRes = await pool.query("SELECT COALESCE(SUM(cost), 0) as total_cost, COALESCE(SUM(liters), 0) as total_liters FROM fuel_logs");`,
  `const fuelRes = await pool.query(\`SELECT COALESCE(SUM(cost), 0) as total_cost, COALESCE(SUM(liters), 0) as total_liters FROM fuel_logs f LEFT JOIN vehicles v ON f.vehicle_id = v.id WHERE \${buildScopeWhere(scope, 'v')}\`);`
);

content = content.replace(
  `const tripAggRes = await pool.query("SELECT COALESCE(SUM(actual_distance), 0) as total_distance, COALESCE(SUM(revenue), 0) as total_revenue FROM trips");`,
  `const tripAggRes = await pool.query(\`SELECT COALESCE(SUM(actual_distance), 0) as total_distance, COALESCE(SUM(revenue), 0) as total_revenue FROM trips t LEFT JOIN vehicles v ON t.vehicle_id = v.id WHERE \${buildScopeWhere(scope, 'v')}\`);`
);

content = content.replace(
  `const acqRes = await pool.query("SELECT COALESCE(SUM(acquisition_cost), 0) as total FROM vehicles");`,
  `const acqRes = await pool.query(\`SELECT COALESCE(SUM(acquisition_cost), 0) as total FROM vehicles WHERE \${where}\`);`
);

content = content.replace(
  `app.get('/api/dashboard/map', async (req, res) => {
  try {
    const result = await pool.query("SELECT id, registration_number, name_model, status, lat, lng FROM vehicles");`,
  `app.get('/api/dashboard/map', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const result = await pool.query(\`SELECT id, registration_number, name_model, status, lat, lng FROM vehicles WHERE \${buildScopeWhere(scope)}\`);`
);

content = content.replace(
  `app.get('/api/vehicles', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");`,
  `app.get('/api/vehicles', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const result = await pool.query(\`SELECT * FROM vehicles WHERE \${buildScopeWhere(scope)} ORDER BY id ASC\`);`
);

content = content.replace(
  `app.post('/api/vehicles', requireRole(['Fleet Manager']), async (req, res) => {
  const { registration_number, name_model, type, max_load_capacity, acquisition_cost, region } = req.body;`,
  `app.post('/api/vehicles', requireRole(['Fleet Manager']), async (req, res) => {
  const { fleet_id, registration_number, name_model, type, max_load_capacity, acquisition_cost, region } = req.body;
  if (!fleet_id) return res.status(400).json({ error: 'fleet_id is required' });`
);
content = content.replace(
  `INSERT INTO vehicles (registration_number, name_model, type, max_load_capacity, acquisition_cost, region)
      VALUES ($1, $2, $3, $4, $5, $6)`,
  `INSERT INTO vehicles (fleet_id, registration_number, name_model, type, max_load_capacity, acquisition_cost, region)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`
);
content = content.replace(
  `[registration_number, name_model, type, max_load_capacity, acquisition_cost, region]`,
  `[fleet_id, registration_number, name_model, type, max_load_capacity, acquisition_cost, region]`
);
// Also need to check if manager owns the fleet
content = content.replace(
  `await rules.validateUniqueRegistration(registration_number);`,
  `await rules.validateUniqueRegistration(registration_number);
    const scope = await getFleetScope(req);
    if (!scope.fleetIds.includes(parseInt(fleet_id))) return res.status(403).json({ error: 'You do not own this fleet' });`
);

content = content.replace(
  `app.get('/api/drivers', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM drivers ORDER BY id ASC");`,
  `app.get('/api/drivers', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const result = await pool.query(\`SELECT * FROM drivers WHERE \${buildScopeWhere(scope)} ORDER BY id ASC\`);`
);

content = content.replace(
  `app.post('/api/drivers', requireRole(['Fleet Manager']), async (req, res) => {
  const { name, license_number, license_category, license_expiry_date, contact_number } = req.body;`,
  `app.post('/api/drivers', requireRole(['Fleet Manager']), async (req, res) => {
  const { fleet_id, name, license_number, license_category, license_expiry_date, contact_number } = req.body;
  if (!fleet_id) return res.status(400).json({ error: 'fleet_id is required' });`
);
content = content.replace(
  `INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number)
      VALUES ($1, $2, $3, $4, $5)`,
  `INSERT INTO drivers (fleet_id, name, license_number, license_category, license_expiry_date, contact_number)
      VALUES ($1, $2, $3, $4, $5, $6)`
);
content = content.replace(
  `[name, license_number, license_category, license_expiry_date, contact_number]`,
  `[fleet_id, name, license_number, license_category, license_expiry_date, contact_number]`
);
content = content.replace(
  `try {
    const result = await pool.query(`,
  `try {
    const scope = await getFleetScope(req);
    if (!scope.fleetIds.includes(parseInt(fleet_id))) return res.status(403).json({ error: 'You do not own this fleet' });
    const result = await pool.query(`
);

content = content.replace(
  `app.get('/api/trips', async (req, res) => {
  try {
    const result = await pool.query(\`
      SELECT t.*, v.registration_number, d.name as driver_name, d.image as driver_image 
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      ORDER BY t.created_at DESC
    \`);`,
  `app.get('/api/trips', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    let extraFilter = '';
    if (scope.isDriver) {
      // Driver gets only their assigned trips
      const myIdRes = await pool.query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
      extraFilter = \` AND t.driver_id = \${myIdRes.rows[0]?.id || -1}\`;
    }
    const result = await pool.query(\`
      SELECT t.*, v.registration_number, d.name as driver_name, d.image as driver_image 
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      WHERE \${buildScopeWhere(scope, 'v')} \${extraFilter}
      ORDER BY t.created_at DESC
    \`);`
);

content = content.replace(
  `app.post('/api/trips', requireRole(['Fleet Manager', 'Driver']), async (req, res) => {
  const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
  try {
    await rules.validateVehicleEligibility(vehicle_id);
    await rules.validateDriverEligibility(driver_id);`,
  `app.post('/api/trips', requireRole(['Fleet Manager', 'Driver']), async (req, res) => {
  const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });

    // Validate vehicle and driver belong to authorized fleets
    const vCheck = await pool.query(\`SELECT fleet_id FROM vehicles WHERE id = $1 AND \${buildScopeWhere(scope)}\`, [vehicle_id]);
    if (vCheck.rows.length === 0) return res.status(403).json({ error: 'Unauthorized vehicle' });
    
    if (scope.isDriver) {
      const myIdRes = await pool.query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
      if (parseInt(driver_id) !== myIdRes.rows[0]?.id) {
        return res.status(403).json({ error: 'Drivers can only assign themselves' });
      }
    } else {
      const dCheck = await pool.query(\`SELECT fleet_id FROM drivers WHERE id = $1 AND \${buildScopeWhere(scope)}\`, [driver_id]);
      if (dCheck.rows.length === 0) return res.status(403).json({ error: 'Unauthorized driver' });
    }

    await rules.validateVehicleEligibility(vehicle_id);
    await rules.validateDriverEligibility(driver_id);`
);

content = content.replace(
  `app.patch('/api/trips/:id/dispatch', requireRole(['Fleet Manager']), async (req, res) => {`,
  `app.patch('/api/trips/:id/dispatch', requireRole(['Fleet Manager', 'Driver']), async (req, res) => {`
);

content = content.replace(
  `    const tripId = req.params.id;
    const tripRes = await client.query('SELECT vehicle_id, driver_id, status FROM trips WHERE id = $1 FOR UPDATE', [tripId]);
    if (tripRes.rows.length === 0) throw new Error('Trip not found');
    const trip = tripRes.rows[0];`,
  `    const tripId = req.params.id;
    const tripRes = await client.query('SELECT vehicle_id, driver_id, status FROM trips WHERE id = $1 FOR UPDATE', [tripId]);
    if (tripRes.rows.length === 0) throw new Error('Trip not found');
    const trip = tripRes.rows[0];
    
    const scope = await getFleetScope(req);
    if (scope.isDriver) {
      const myIdRes = await client.query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
      if (trip.driver_id !== myIdRes.rows[0]?.id) throw new Error('Not your trip');
    } else {
      const vCheck = await client.query(\`SELECT fleet_id FROM vehicles WHERE id = $1 AND \${buildScopeWhere(scope)}\`, [trip.vehicle_id]);
      if (vCheck.rows.length === 0) throw new Error('Unauthorized');
    }`
);

content = content.replace(
  `app.patch('/api/trips/:id/complete', requireRole(['Fleet Manager', 'Driver']), async (req, res) => {
  const { final_odometer, fuel_consumed } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const tripId = req.params.id;
    const tripRes = await client.query('SELECT vehicle_id, driver_id, status, dispatched_at, planned_distance FROM trips WHERE id = $1 FOR UPDATE', [tripId]);
    if (tripRes.rows.length === 0) throw new Error('Trip not found');
    const trip = tripRes.rows[0];`,
  `app.patch('/api/trips/:id/complete', requireRole(['Fleet Manager', 'Driver']), async (req, res) => {
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
      const vCheck = await client.query(\`SELECT fleet_id FROM vehicles WHERE id = $1 AND \${buildScopeWhere(scope)}\`, [trip.vehicle_id]);
      if (vCheck.rows.length === 0) throw new Error('Unauthorized');
    }`
);

content = content.replace(
  `app.get('/api/risk-radar', async (req, res) => {
  try {
    const result = await pool.query(\`
      SELECT r.*, 
             COALESCE(v.registration_number, d.name) as name,
             v.type as vehicle_type,
             d.license_number
      FROM risk_snapshots r
      LEFT JOIN vehicles v ON r.entity_type = 'Vehicle' AND r.entity_id = v.id
      LEFT JOIN drivers d ON r.entity_type = 'Driver' AND r.entity_id = d.id
      ORDER BY r.risk_score DESC
      LIMIT 50
    \`);`,
  `app.get('/api/risk-radar', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const result = await pool.query(\`
      SELECT r.*, 
             COALESCE(v.registration_number, d.name) as name,
             v.type as vehicle_type,
             d.license_number
      FROM risk_snapshots r
      LEFT JOIN vehicles v ON r.entity_type = 'Vehicle' AND r.entity_id = v.id
      LEFT JOIN drivers d ON r.entity_type = 'Driver' AND r.entity_id = d.id
      WHERE (r.entity_type = 'Vehicle' AND \${buildScopeWhere(scope, 'v')})
         OR (r.entity_type = 'Driver' AND \${buildScopeWhere(scope, 'd')})
      ORDER BY r.risk_score DESC
      LIMIT 50
    \`);`
);

content = content.replace(
  `app.get('/api/analytics', async (req, res) => {
  // A helper endpoint to combine multiple queries for the frontend
  try {
    const vStatus = await pool.query("SELECT status as name, count(*)::int as value FROM vehicles GROUP BY status");
    const tData = await pool.query(\`
      SELECT to_char(created_at, 'Dy') as day, 
             SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END)::int as completed,
             SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END)::int as cancelled
      FROM trips 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY day ORDER BY day
    \`);`,
  `app.get('/api/analytics', async (req, res) => {
  try {
    const scope = await getFleetScope(req);
    if (!scope.scoped) return res.status(403).json({ error: scope.error });
    const vStatus = await pool.query(\`SELECT status as name, count(*)::int as value FROM vehicles WHERE \${buildScopeWhere(scope)} GROUP BY status\`);
    const tData = await pool.query(\`
      SELECT to_char(t.created_at, 'Dy') as day, 
             SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END)::int as completed,
             SUM(CASE WHEN t.status = 'Cancelled' THEN 1 ELSE 0 END)::int as cancelled
      FROM trips t LEFT JOIN vehicles v ON t.vehicle_id = v.id
      WHERE t.created_at >= NOW() - INTERVAL '7 days' AND \${buildScopeWhere(scope, 'v')}
      GROUP BY day ORDER BY day
    \`);`
);

fs.writeFileSync('server/index.js', content, 'utf8');
console.log("Rewrote server/index.js!");
