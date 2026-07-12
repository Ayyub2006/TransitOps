import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.NEON_CONNECTION_STRING,
});

export const initDb = async () => {
  const schemaText = `
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      permissions JSONB
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      name VARCHAR(255),
      picture TEXT,
      role_id INTEGER REFERENCES roles(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fleets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      region VARCHAR(100),
      manager_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      archived_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      fleet_id INTEGER REFERENCES fleets(id),
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      name_model VARCHAR(255),
      type VARCHAR(50),
      max_load_capacity NUMERIC,
      odometer NUMERIC DEFAULT 0,
      acquisition_cost NUMERIC DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Available',
      region VARCHAR(100),
      lat NUMERIC DEFAULT 19.0760,
      lng NUMERIC DEFAULT 72.8777,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id SERIAL PRIMARY KEY,
      fleet_id INTEGER REFERENCES fleets(id),
      user_id INTEGER REFERENCES users(id),
      name VARCHAR(255) NOT NULL,
      license_number VARCHAR(100) UNIQUE NOT NULL,
      license_category VARCHAR(50),
      license_expiry_date DATE NOT NULL,
      contact_number VARCHAR(50),
      safety_score INTEGER DEFAULT 100,
      status VARCHAR(50) DEFAULT 'Available',
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS invites (
      id SERIAL PRIMARY KEY,
      fleet_id INTEGER REFERENCES fleets(id),
      code VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255),
      role VARCHAR(50) DEFAULT 'driver',
      created_by INTEGER REFERENCES users(id),
      expires_at TIMESTAMP,
      used_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trips (
      id SERIAL PRIMARY KEY,
      source VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      vehicle_id INTEGER REFERENCES vehicles(id),
      driver_id INTEGER REFERENCES drivers(id),
      cargo_weight NUMERIC,
      planned_distance NUMERIC,
      actual_distance NUMERIC,
      fuel_consumed NUMERIC,
      final_odometer NUMERIC,
      status VARCHAR(50) DEFAULT 'Draft',
      dispatched_at TIMESTAMP,
      completed_at TIMESTAMP,
      cancelled_at TIMESTAMP,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      revenue NUMERIC DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS maintenance_logs (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER REFERENCES vehicles(id),
      maintenance_type VARCHAR(100),
      description TEXT,
      status VARCHAR(50) DEFAULT 'Active',
      estimated_cost NUMERIC,
      final_cost NUMERIC,
      opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      closed_at TIMESTAMP,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS fuel_logs (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER REFERENCES vehicles(id),
      trip_id INTEGER REFERENCES trips(id),
      date DATE NOT NULL,
      liters NUMERIC NOT NULL,
      cost NUMERIC NOT NULL,
      odometer_at_fillup NUMERIC NOT NULL,
      computed_efficiency NUMERIC,
      is_anomaly BOOLEAN DEFAULT FALSE,
      anomaly_deviation_pct NUMERIC
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER REFERENCES vehicles(id),
      category VARCHAR(50),
      amount NUMERIC NOT NULL,
      date DATE NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS risk_snapshots (
      id SERIAL PRIMARY KEY,
      entity_type VARCHAR(50),
      entity_id INTEGER NOT NULL,
      risk_score INTEGER DEFAULT 0,
      contributing_factors JSONB,
      computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS utilization_snapshots (
      id SERIAL PRIMARY KEY,
      date DATE UNIQUE NOT NULL,
      utilization_pct NUMERIC NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      action VARCHAR(255),
      entity_type VARCHAR(100),
      entity_id INTEGER,
      before_json JSONB,
      after_json JSONB,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_trip_status ON trips(status);
    CREATE INDEX IF NOT EXISTS idx_fuel_log_vehicle_date ON fuel_logs(vehicle_id, date);
  `;
  
  try {
    // Add columns if they don't exist (handles pre-existing tables before the updated schema above)
    await pool.query(schemaText);
    
    // Add columns dynamically for existing DBs
    await pool.query(`
      ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fleet_id INTEGER REFERENCES fleets(id);
      ALTER TABLE drivers ADD COLUMN IF NOT EXISTS fleet_id INTEGER REFERENCES fleets(id);
      ALTER TABLE drivers ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
    `);

    // Backfill missing fleets
    const managersResult = await pool.query(`
      SELECT u.id, u.name FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'Fleet Manager'
    `);
    
    for (const manager of managersResult.rows) {
      // Check if manager has a fleet
      const fleetCheck = await pool.query('SELECT id FROM fleets WHERE manager_id = $1', [manager.id]);
      let fleetId;
      if (fleetCheck.rows.length === 0) {
        const insertFleet = await pool.query(
          'INSERT INTO fleets (name, region, manager_id) VALUES ($1, $2, $3) RETURNING id',
          [`${manager.name}'s Default Fleet`, 'Default Region', manager.id]
        );
        fleetId = insertFleet.rows[0].id;
      } else {
        fleetId = fleetCheck.rows[0].id;
      }

      // Backfill vehicles that have no fleet
      await pool.query('UPDATE vehicles SET fleet_id = $1 WHERE fleet_id IS NULL', [fleetId]);
      // Backfill drivers that have no fleet
      await pool.query('UPDATE drivers SET fleet_id = $1 WHERE fleet_id IS NULL', [fleetId]);
    }

    console.log("Database schema initialized and backfilled.");
    
    // Seeding logic
    const rolesResult = await pool.query("SELECT COUNT(*) FROM roles");
    if (parseInt(rolesResult.rows[0].count) === 0) {
      console.log("Seeding initial data...");
      
      // Roles
      await pool.query(`
        INSERT INTO roles (name, permissions) VALUES 
        ('Fleet Manager', '{"all": true}'),
        ('Driver', '{"manage_own_trips": true}'),
        ('Safety Officer', '{"manage_safety": true}'),
        ('Financial Analyst', '{"view_reports": true}')
      `);
      
      const roleResult = await pool.query("SELECT id FROM roles WHERE name = 'Fleet Manager'");
      const fleetManagerRoleId = roleResult.rows[0].id;
      
      // User (Default Admin)
      const mockPasswordHash = crypto.createHash('sha256').update('password123').digest('hex');
      const userRes = await pool.query(`
        INSERT INTO users (email, password_hash, name, role_id) 
        VALUES ('admin@transitops.com', $1, 'Admin User', $2) RETURNING id
      `, [mockPasswordHash, fleetManagerRoleId]);
      const userId = userRes.rows[0].id;
      
      // Vehicles
      await pool.query(`
        INSERT INTO vehicles (registration_number, name_model, type, max_load_capacity, odometer, acquisition_cost, status, region, lat, lng) VALUES 
        ('MH-01-VX', 'Heavy Hauler X2', 'Truck', 12500, 42390, 14500000, 'Available', 'North Mumbai', 19.0760, 72.8777),
        ('MH-02-TL', 'Transit-Lite 400', 'Van', 2800, 112012, 3850000, 'On Trip', 'South Mumbai', 19.0522, 72.9005),
        ('MH-03-BU', 'Voyager L-Series', 'Bus', 8500, 9420, 21000000, 'In Shop', 'Global', 19.0176, 72.8562),
        ('MH-04-VX', 'Heavy Hauler X1', 'Truck', 12000, 242390, 12500000, 'Retired', 'North Mumbai', 19.1136, 72.8697),
        ('MH-05-AB', 'Transit-Lite 500', 'Van', 3000, 15000, 4200000, 'Available', 'South Mumbai', 18.9220, 72.8347)
      `);
      
      // Drivers
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const expiredDate = new Date();
      expiredDate.setMonth(expiredDate.getMonth() - 1);
      
      await pool.query(`
        INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status, image) VALUES 
        ('Mahesh Sharma', 'MH-01-2015-X', 'HEAVY DUTY', $1, '+91 98765-43210', 94, 'Available', NULL),
        ('Anita Verma', 'MH-02-2018-B', 'PASSENGER', $1, '+91 87654-32109', 78, 'On Trip', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLjKwI4SI3dX1ZnRAev1qu-73os5s4NIVb0pndBiZdC-MJGlYUFYfakj57Hd9nCEqr_wo8nw54WWVUikFbM9V68xU17TDiaqf6OqwpeMHs3a7KcTOmpoSNM5b63zZVLk5Tk0XEd8vqVZB5FdLnUqAYBRhOEKosUHmslf8pjXgieOLRE2eGMVoRki0Z73u29XBF3gA-vPjyhzHOWkr4kyIlX8O226i4k1gP5HkAKzh9tv7fY0Ftu5R-dA'),
        ('Ravi Kumar', 'MH-03-2020-L', 'HAZMAT', $2, '+91 76543-21098', 52, 'Suspended', NULL),
        ('Priya Singh', 'MH-04-2022-M', 'STANDARD', $1, '+91 91234-56780', 89, 'Available', NULL)
      `, [futureDate.toISOString(), expiredDate.toISOString()]);

      // Get some IDs for trips
      const vRes1 = await pool.query("SELECT id FROM vehicles WHERE registration_number = 'MH-01-VX'");
      const vRes2 = await pool.query("SELECT id FROM vehicles WHERE registration_number = 'MH-02-TL'");
      const dRes1 = await pool.query("SELECT id FROM drivers WHERE name = 'Mahesh Sharma'");
      const dRes2 = await pool.query("SELECT id FROM drivers WHERE name = 'Anita Verma'");
      
      // Trips
      await pool.query(`
        INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status, created_by) VALUES 
        ('JNPT Port, Navi Mumbai', 'Andheri East MIDC', $1, $2, 8200, 420, 'Draft', $5),
        ('Dadar Hub', 'Thane West', $3, $4, 1500, 25, 'Dispatched', $5)
      `, [vRes1.rows[0].id, dRes1.rows[0].id, vRes2.rows[0].id, dRes2.rows[0].id, userId]);

      console.log("Database seeded successfully.");
    }
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

export default pool;
