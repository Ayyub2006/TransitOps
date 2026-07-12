import cron from 'node-cron';
import pool from './db.js';

// 1. Recompute Risk Snapshots (Every 5 minutes)
export const recomputeRiskSnapshots = async () => {
  console.log("Job Triggered: recomputeRiskSnapshots");
  try {
    // Clear old snapshots
    await pool.query("DELETE FROM risk_snapshots");

    // DRIVER RISK
    const driversRes = await pool.query("SELECT id, status, safety_score, license_expiry_date FROM drivers");
    for (const driver of driversRes.rows) {
      const factors = [];
      let score = 0;

      // License expiry
      const today = new Date();
      const expiry = new Date(driver.license_expiry_date);
      const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining <= 30) {
        const scale = daysRemaining <= 0 ? 1 : (30 - daysRemaining) / 30;
        const val = 40 * scale;
        score += val;
        factors.push({ factor: "license_expiry", detail: `Expires in ${Math.max(0, daysRemaining)} days`, weight: val });
      }

      // Safety score
      const safetyVal = 30 * (100 - driver.safety_score) / 100;
      if (safetyVal > 0) {
        score += safetyVal;
        factors.push({ factor: "safety_score", detail: `Score is ${driver.safety_score}`, weight: safetyVal });
      }

      // Suspension
      if (driver.status === 'Suspended') {
        score += 20;
        factors.push({ factor: "suspension", detail: "Driver is Suspended", weight: 20 });
      }

      // Cancellation rate
      const tripRes = await pool.query(`
        SELECT COUNT(*) as total, SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled 
        FROM trips WHERE driver_id = $1 AND created_at > NOW() - INTERVAL '30 days'
      `, [driver.id]);
      
      const total = parseInt(tripRes.rows[0].total) || 0;
      const cancelled = parseInt(tripRes.rows[0].cancelled) || 0;
      const cancelRate = total > 0 ? cancelled / total : 0;
      const cancelVal = 10 * cancelRate;
      
      if (cancelVal > 0) {
        score += cancelVal;
        factors.push({ factor: "cancellation_rate", detail: `${Math.round(cancelRate * 100)}% cancel rate`, weight: cancelVal });
      }

      await pool.query(`
        INSERT INTO risk_snapshots (entity_type, entity_id, risk_score, contributing_factors)
        VALUES ('Driver', $1, $2, $3)
      `, [driver.id, Math.round(score), JSON.stringify(factors)]);
    }

    // VEHICLE RISK
    const vehiclesRes = await pool.query("SELECT id, status, odometer FROM vehicles");
    for (const vehicle of vehiclesRes.rows) {
      const factors = [];
      let score = 0;

      // Overdue maintenance
      const maintRes = await pool.query(`
        SELECT opened_at FROM maintenance_logs 
        WHERE vehicle_id = $1 AND status = 'Active'
      `, [vehicle.id]);
      
      if (maintRes.rows.length > 0) {
        const openedAt = new Date(maintRes.rows[0].opened_at);
        const daysOpen = Math.max(0, Math.ceil((new Date() - openedAt) / (1000 * 60 * 60 * 24)));
        const scale = Math.min(1, daysOpen / 10);
        const val = 35 * scale;
        score += val;
        factors.push({ factor: "maintenance_overdue", detail: `${daysOpen} days overdue`, weight: val });
      }

      // Fuel anomalies
      const fuelRes = await pool.query(`
        SELECT COUNT(*) as count FROM fuel_logs 
        WHERE vehicle_id = $1 AND is_anomaly = true AND date > NOW() - INTERVAL '30 days'
      `, [vehicle.id]);
      
      const anomalies = parseInt(fuelRes.rows[0].count) || 0;
      if (anomalies > 0) {
        const scale = Math.min(1, anomalies / 3);
        const val = 25 * scale;
        score += val;
        factors.push({ factor: "fuel_anomalies", detail: `${anomalies} anomalies (30d)`, weight: val });
      }

      // Odometer since maintenance
      const lastMaintRes = await pool.query(`
        SELECT closed_at FROM maintenance_logs 
        WHERE vehicle_id = $1 AND status = 'Closed' ORDER BY closed_at DESC LIMIT 1
      `, [vehicle.id]);
      
      if (lastMaintRes.rows.length === 0) {
        // No maintenance ever, penalize slightly based on total odometer
        const scale = Math.min(1, vehicle.odometer / 50000);
        const val = 20 * scale;
        score += val;
        factors.push({ factor: "service_interval", detail: "No maintenance history", weight: val });
      } else {
        // Find trips completed since last maintenance to estimate distance... 
        // For simplicity, just use flat value if odometer > 10000
        const val = 10;
        score += val;
        factors.push({ factor: "service_interval", detail: "Check interval", weight: val });
      }

      await pool.query(`
        INSERT INTO risk_snapshots (entity_type, entity_id, risk_score, contributing_factors)
        VALUES ('Vehicle', $1, $2, $3)
      `, [vehicle.id, Math.round(score), JSON.stringify(factors)]);
    }

  } catch (err) {
    console.error("Error in recomputeRiskSnapshots:", err);
  }
};

// 2. License Expiry Sweep (Daily)
export const licenseExpirySweep = async () => {
  console.log("Job Triggered: licenseExpirySweep");
  // Just updates AuditLog or logs an alert, actual risk is in risk snapshot
};

// 3. Daily Utilization Snapshot (Daily at midnight)
export const dailyUtilizationSnapshot = async () => {
  console.log("Job Triggered: dailyUtilizationSnapshot");
  try {
    const totalVehiclesRes = await pool.query("SELECT COUNT(*) FROM vehicles WHERE status != 'Retired'");
    const total = parseInt(totalVehiclesRes.rows[0].count);
    
    // Count how many distinct vehicles had a dispatched or completed trip today
    const activeVehiclesRes = await pool.query(`
      SELECT COUNT(DISTINCT vehicle_id) 
      FROM trips 
      WHERE created_at >= CURRENT_DATE OR dispatched_at >= CURRENT_DATE OR completed_at >= CURRENT_DATE
    `);
    const active = parseInt(activeVehiclesRes.rows[0].count);
    
    const pct = total > 0 ? (active / total) * 100 : 0;
    
    await pool.query(`
      INSERT INTO utilization_snapshots (date, utilization_pct) 
      VALUES (CURRENT_DATE, $1) 
      ON CONFLICT (date) DO UPDATE SET utilization_pct = $1
    `, [pct]);
  } catch (err) {
    console.error("Error in dailyUtilizationSnapshot:", err);
  }
};

// 4. Simulate Vehicle Position (Every 15s)
export const simulateVehiclePosition = async () => {
  try {
    const onTripVehicles = await pool.query("SELECT id, lat, lng FROM vehicles WHERE status = 'On Trip'");
    for (const vehicle of onTripVehicles.rows) {
      // Add a tiny random nudge to lat/lng
      const latNudge = (Math.random() - 0.5) * 0.005;
      const lngNudge = (Math.random() - 0.5) * 0.005;
      
      const newLat = parseFloat(vehicle.lat) + latNudge;
      const newLng = parseFloat(vehicle.lng) + lngNudge;
      
      await pool.query("UPDATE vehicles SET lat = $1, lng = $2 WHERE id = $3", [newLat, newLng, vehicle.id]);
    }
  } catch (err) {
    console.error("Error in simulateVehiclePosition:", err);
  }
};

export const startJobs = () => {
  cron.schedule('*/5 * * * *', recomputeRiskSnapshots);
  cron.schedule('0 0 * * *', licenseExpirySweep);
  cron.schedule('0 0 * * *', dailyUtilizationSnapshot);
  cron.schedule('*/15 * * * * *', simulateVehiclePosition);
  
  // Run snapshots once on startup to seed initial data
  recomputeRiskSnapshots();
  dailyUtilizationSnapshot();
  
  console.log("Background jobs scheduled.");
};
