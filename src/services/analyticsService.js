import { fetchApi, USE_MOCK_API } from './api';

export const getVehicleStatus = async () => {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Active', value: 120, color: '#62f3ec' },
          { name: 'Available', value: 40, color: '#34d399' },
          { name: 'Maintenance', value: 10, color: '#a78bfa' },
          { name: 'Inactive', value: 5, color: '#f87171' }
        ]);
      }, 600);
    });
  }
  return fetchApi('/analytics/vehicle-status');
};

export const getTripsData = async () => {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { day: 'Mon', completed: 420, cancelled: 10 },
          { day: 'Tue', completed: 450, cancelled: 15 },
          { day: 'Wed', completed: 480, cancelled: 8 },
          { day: 'Thu', completed: 460, cancelled: 12 },
          { day: 'Fri', completed: 510, cancelled: 20 },
          { day: 'Sat', completed: 390, cancelled: 5 },
          { day: 'Sun', completed: 350, cancelled: 4 }
        ]);
      }, 700);
    });
  }
  return fetchApi('/analytics/trips-data');
};

export const getFuelTrend = async () => {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { time: '00:00', consumption: 45 },
          { time: '04:00', consumption: 30 },
          { time: '08:00', consumption: 120 },
          { time: '12:00', consumption: 110 },
          { time: '16:00', consumption: 130 },
          { time: '20:00', consumption: 80 }
        ]);
      }, 500);
    });
  }
  return fetchApi('/analytics/fuel-trend');
};

export const getExpenseDistribution = async () => {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { category: 'Fuel', amount: 45000, color: '#fbbf24' },
          { category: 'Maintenance', amount: 25000, color: '#a78bfa' },
          { category: 'Wages', amount: 65000, color: '#62f3ec' },
          { category: 'Insurance', amount: 15000, color: '#94a3b8' }
        ]);
      }, 800);
    });
  }
  return fetchApi('/analytics/expense-distribution');
};
