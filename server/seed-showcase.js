import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.NEON_CONNECTION_STRING,
});

async function runSeed() {
  console.log("Starting Showcase Seeding for Indian Subcontinent...");
  try {
    await pool.query('BEGIN');

    // Get a baseline fleet
    let fleetRes = await pool.query('SELECT id FROM fleets LIMIT 1');
    if (fleetRes.rows.length === 0) {
       console.log("No fleet found, creating a default one...");
       const managerRes = await pool.query("SELECT id FROM users WHERE role_id = (SELECT id FROM roles WHERE name='Fleet Manager') LIMIT 1");
       const managerId = managerRes.rows.length > 0 ? managerRes.rows[0].id : null;
       fleetRes = await pool.query('INSERT INTO fleets (name, region, manager_id) VALUES ($1, $2, $3) RETURNING id', ['India Operations Core', 'South Asia', managerId]);
    }
    const fleetId = fleetRes.rows[0].id;

    console.log("Cleaning up operational data (excluding users/roles/fleets)...");
    await pool.query(`
      TRUNCATE TABLE maintenance_logs, fuel_logs, expenses, trips, drivers, vehicles, risk_snapshots, utilization_snapshots RESTART IDENTITY CASCADE;
    `);

    console.log("Inserting Vehicles...");
    const vehiclesData = [
      ['MH-01-AB-1234', 'Tata Prima 2830', 'Truck', 28000, 45000, 'Available', 'Mumbai'],
      ['MH-04-XX-9876', 'Ashok Leyland U-4923', 'Truck', 49000, 120000, 'On Trip', 'Pune'],
      ['DL-1C-AA-0001', 'Mahindra Blazo X', 'Truck', 42000, 8000, 'Available', 'Delhi NCR'],
      ['KA-01-HG-1111', 'BharatBenz 2823C', 'Truck', 28000, 31000, 'In Shop', 'Bangalore'],
      ['TN-09-CQ-2222', 'Tata LPT 1109', 'Van', 11000, 56000, 'Available', 'Chennai'],
      ['WB-02-EE-3333', 'Ashok Leyland Partner', 'Van', 4000, 22000, 'On Trip', 'Kolkata'],
      ['GJ-01-FF-4444', 'Mahindra Bolero Pik-Up', 'Van', 1500, 150000, 'Retired', 'Ahmedabad'],
      ['UP-16-GG-5555', 'Eicher Pro 2049', 'Van', 5000, 41000, 'Available', 'Noida'],
      ['TS-07-HH-6666', 'Tata Starbus', 'Bus', 8000, 89000, 'On Trip', 'Hyderabad'],
      ['KL-01-JJ-7777', 'Ashok Leyland Viking', 'Bus', 10000, 120000, 'Available', 'Trivandrum'],
      ['MH-12-KK-8888', 'Tata Signa 4825.T', 'Truck', 48000, 2300, 'Available', 'Pune'],
      ['DL-04-LL-9999', 'Volvo FMX 460', 'Truck', 50000, 5000, 'In Shop', 'Delhi NCR'],
      ['MH-43-MN-1010', 'Tata Ace Gold', 'Van', 750, 43000, 'Available', 'Navi Mumbai'],
      ['KA-03-PQ-2020', 'Maruti Suzuki Super Carry', 'Van', 740, 67000, 'On Trip', 'Bangalore'],
      ['RJ-14-RS-3030', 'Force Traveller', 'Bus', 3500, 88000, 'Available', 'Jaipur'],
    ];

    for (const v of vehiclesData) {
      await pool.query(
        'INSERT INTO vehicles (fleet_id, registration_number, name_model, type, max_load_capacity, odometer, acquisition_cost, status, region, lat, lng) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [fleetId, v[0], v[1], v[2], v[3], v[4], v[3] * 100, v[5], v[6], 19.0 + Math.random()*5, 72.0 + Math.random()*5]
      );
    }
    
    // Fetch all inserted vehicles
    const vehicleRes = await pool.query('SELECT id, type, max_load_capacity FROM vehicles');
    const vehicles = vehicleRes.rows;

    console.log("Inserting Drivers...");
    const driverNames = ['Rahul Sharma', 'Arjun Patel', 'Siddharth Singh', 'Vikram Desai', 'Ravi Kumar', 'Amit Verma', 'Sunil Jadhav', 'Deepak Reddy', 'Manoj Tiwari', 'Karthik Iyer', 'Sanjay Gupta', 'Rajesh Pillai', 'Prakash Rao', 'Ashok Menon', 'Vivek Chawla'];
    const drivers = [];
    
    for (let i = 0; i < driverNames.length; i++) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + (Math.random() * 300 - 10)); // Some expired/soon
      
      const dRes = await pool.query(
        'INSERT INTO drivers (fleet_id, name, license_number, license_category, license_expiry_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [fleetId, driverNames[i], `MH-${Math.floor(10 + Math.random()*89)}-${Math.floor(1000 + Math.random()*8999)}`, 'HMV', expDate.toISOString(), (i % 3 === 0) ? 'On Trip' : 'Available']
      );
      drivers.push(dRes.rows[0].id);
    }

    console.log("Inserting Trips...");
    const cities = ['Mumbai, MH', 'Pune, MH', 'Surat, GJ', 'Ahmedabad, GJ', 'Delhi, NCR', 'Gurgaon, HR', 'Bangalore, KA', 'Chennai, TN', 'Hyderabad, TS', 'Kolkata, WB', 'Jaipur, RJ', 'Indore, MP'];
    
    for (let i = 0; i < 40; i++) {
      const isPast = i < 25; // 25 completed, 5 active, 10 draft
      const status = isPast ? (Math.random() > 0.1 ? 'Completed' : 'Cancelled') : (i < 30 ? 'Dispatched' : 'Draft');
      const v = vehicles[Math.floor(Math.random() * vehicles.length)];
      const d = drivers[Math.floor(Math.random() * drivers.length)];
      const source = cities[Math.floor(Math.random() * cities.length)];
      let dest = cities[Math.floor(Math.random() * cities.length)];
      while(source === dest) dest = cities[Math.floor(Math.random() * cities.length)];
      
      const pDist = 100 + Math.floor(Math.random() * 900);
      const aDist = status === 'Completed' ? pDist + Math.floor(Math.random() * 20 - 10) : null;
      
      let created = new Date();
      created.setDate(created.getDate() - (Math.random() * 30));
      let completed = null;
      if (status === 'Completed' || status === 'Cancelled') {
        completed = new Date(created);
        completed.setHours(completed.getHours() + (pDist / 40));
      }

      await pool.query(`
        INSERT INTO trips (vehicle_id, driver_id, source, destination, status, cargo_weight, planned_distance, actual_distance, created_at, completed_at, revenue)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [v.id, d, source, dest, status, Math.floor(v.max_load_capacity * 0.8), pDist, aDist, created.toISOString(), completed ? completed.toISOString() : null, pDist * 15]);
    }

    console.log("Inserting Fuel Logs & Maintenance...");
    for (const v of vehicles) {
      for(let i=0; i<3; i++) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 30));
        await pool.query('INSERT INTO fuel_logs (vehicle_id, date, liters, cost, odometer_at_fillup) VALUES ($1, $2, $3, $4, $5)', [v.id, d.toISOString(), 50 + Math.random()*150, 5000 + Math.random()*10000, 10000 + (i*1000)]);
      }
      
      if (Math.random() > 0.5) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 60));
        await pool.query('INSERT INTO maintenance_logs (vehicle_id, opened_at, maintenance_type, description, final_cost, status) VALUES ($1, $2, $3, $4, $5, $6)', [v.id, d.toISOString(), 'Preventive', 'Full Service - Engine oil, filters, tyre rotation', 12000 + Math.random()*5000, 'Completed']);
      }
    }

    console.log("Inserting Expenses...");
    const expenseTypes = ['Tolls', 'Permits', 'Parking', 'Repairs'];
    for(let i=0; i<20; i++) {
      const v = vehicles[Math.floor(Math.random() * vehicles.length)];
      const type = expenseTypes[Math.floor(Math.random() * expenseTypes.length)];
      const d = new Date();
      d.setDate(d.getDate() - Math.floor(Math.random() * 30));
      await pool.query('INSERT INTO expenses (vehicle_id, date, category, amount, notes) VALUES ($1, $2, $3, $4, $5)', [v.id, d.toISOString(), type, 500 + Math.random()*3000, `${type} charges during highway transit`]);
    }

    console.log("Generating Risk Snapshots...");
    for (const v of vehicles) {
      const risk = Math.floor(Math.random() * 100);
      await pool.query("INSERT INTO risk_snapshots (entity_type, entity_id, risk_score, contributing_factors) VALUES ($1, $2, $3, $4)", ['Vehicle', v.id, risk, JSON.stringify([{name: 'Maintenance Due', impact: risk}])]);
    }
    for (const d of drivers) {
      const risk = Math.floor(Math.random() * 100);
      await pool.query("INSERT INTO risk_snapshots (entity_type, entity_id, risk_score, contributing_factors) VALUES ($1, $2, $3, $4)", ['Driver', d, risk, JSON.stringify([{name: 'Harsh Braking', impact: risk}])]);
    }
    
    await pool.query('COMMIT');
    console.log("Seeding complete!");

  } catch(e) {
    await pool.query('ROLLBACK');
    console.error("Error during seeding:", e);
  } finally {
    pool.end();
  }
}

runSeed();
