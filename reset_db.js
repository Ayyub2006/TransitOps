import pool from './server/db.js';

const resetDb = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS audit_logs CASCADE;
      DROP TABLE IF EXISTS utilization_snapshots CASCADE;
      DROP TABLE IF EXISTS risk_snapshots CASCADE;
      DROP TABLE IF EXISTS expenses CASCADE;
      DROP TABLE IF EXISTS fuel_logs CASCADE;
      DROP TABLE IF EXISTS maintenance_logs CASCADE;
      DROP TABLE IF EXISTS trips CASCADE;
      DROP TABLE IF EXISTS drivers CASCADE;
      DROP TABLE IF EXISTS vehicles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS roles CASCADE;
    `);
    console.log("Old tables dropped.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

resetDb();
