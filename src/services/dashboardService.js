import { fetchApi, USE_MOCK_API } from './api';

export const getKPIs = async () => {
  if (USE_MOCK_API) {
    // Mock API implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          activeVehicles: 120,
          availableVehicles: 40,
          inMaintenance: 10,
          activeTrips: 60,
          pendingTrips: 20,
          driversOnDuty: 80,
          fleetUtilization: 75
        });
      }, 500);
    });
  }
  
  // Real API implementation for when USE_MOCK_API is false
  return fetchApi('/dashboard/kpis');
};
