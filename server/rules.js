import pool from './db.js';

export const validateUniqueRegistration = async (regNumber, excludeVehicleId = null) => {
  let query = 'SELECT id FROM vehicles WHERE registration_number = $1';
  const params = [regNumber];
  
  if (excludeVehicleId) {
    query += ' AND id != $2';
    params.push(excludeVehicleId);
  }
  
  const result = await pool.query(query, params);
  if (result.rows.length > 0) {
    throw new Error('Registration number already exists');
  }
};

export const validateDriverEligibility = async (driverId) => {
  const result = await pool.query('SELECT status, license_expiry_date FROM drivers WHERE id = $1', [driverId]);
  if (result.rows.length === 0) {
    throw new Error('Driver not found');
  }
  const driver = result.rows[0];
  if (driver.status === 'Suspended') {
    throw new Error('Driver is suspended');
  }
  if (new Date(driver.license_expiry_date) < new Date()) {
    throw new Error('Driver license has expired');
  }
};

export const validateVehicleEligibility = async (vehicleId) => {
  const result = await pool.query('SELECT status FROM vehicles WHERE id = $1', [vehicleId]);
  if (result.rows.length === 0) {
    throw new Error('Vehicle not found');
  }
  const vehicle = result.rows[0];
  if (vehicle.status !== 'Available') {
    throw new Error('Vehicle is not available');
  }
};

export const validateCargoWeight = async (cargoWeight, vehicleId) => {
  const result = await pool.query('SELECT max_load_capacity FROM vehicles WHERE id = $1', [vehicleId]);
  if (result.rows.length === 0) {
    throw new Error('Vehicle not found');
  }
  const maxLoad = result.rows[0].max_load_capacity;
  if (cargoWeight > maxLoad) {
    throw new Error(`Cargo weight exceeds maximum load capacity (${maxLoad} kg)`);
  }
};

// Provides the SQL for double assignment checks within a transaction
export const assertNoDoubleAssignmentSQL = () => {
  return {
    vehicleCheck: 'SELECT status FROM vehicles WHERE id = $1 FOR UPDATE',
    driverCheck: 'SELECT status FROM drivers WHERE id = $1 FOR UPDATE'
  };
};

export const getTripValidTransitions = (currentStatus) => {
  const transitions = {
    'Draft': ['Dispatched', 'Cancelled'],
    'Dispatched': ['Completed', 'Cancelled'],
    'Completed': [],
    'Cancelled': []
  };
  return transitions[currentStatus] || [];
};

export const transitionTripStatus = async (tripId, newStatus, client = pool) => {
  const result = await client.query('SELECT status FROM trips WHERE id = $1 FOR UPDATE', [tripId]);
  if (result.rows.length === 0) {
    throw new Error('Trip not found');
  }
  const currentStatus = result.rows[0].status;
  const validTransitions = getTripValidTransitions(currentStatus);
  
  if (!validTransitions.includes(newStatus)) {
    throw new Error(`Invalid trip transition from ${currentStatus} to ${newStatus}`);
  }
};

export const getMaintenanceValidTransitions = (currentStatus) => {
  const transitions = {
    'Active': ['Closed'],
    'Closed': []
  };
  return transitions[currentStatus] || [];
};

export const transitionMaintenanceStatus = async (maintenanceId, newStatus, client = pool) => {
  const result = await client.query('SELECT status, vehicle_id FROM maintenance_logs WHERE id = $1 FOR UPDATE', [maintenanceId]);
  if (result.rows.length === 0) {
    throw new Error('Maintenance record not found');
  }
  const record = result.rows[0];
  const validTransitions = getMaintenanceValidTransitions(record.status);
  
  if (!validTransitions.includes(newStatus)) {
    throw new Error(`Invalid maintenance transition from ${record.status} to ${newStatus}`);
  }
  return record.vehicle_id;
};
