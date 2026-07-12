import { fetchApi } from './api';

export const getVehicleStatus = async () => {
  const data = await fetchApi('/analytics');
  return data.vehicleStatus;
};

export const getTripsData = async () => {
  const data = await fetchApi('/analytics');
  return data.tripsData;
};

// Keeping mock structure for fuel trend and expense since we didn't add the aggregation routes yet due to time constraints
export const getFuelTrend = async () => {
  return [
    { time: '00:00', consumption: 45 },
    { time: '04:00', consumption: 30 },
    { time: '08:00', consumption: 120 },
    { time: '12:00', consumption: 110 },
    { time: '16:00', consumption: 130 },
    { time: '20:00', consumption: 80 }
  ];
};

export const getExpenseDistribution = async () => {
  return [
    { category: 'Fuel', amount: 4500000, color: '#fbbf24' },
    { category: 'Maintenance', amount: 2500000, color: '#a78bfa' },
    { category: 'Wages', amount: 6500000, color: '#62f3ec' },
    { category: 'Insurance', amount: 1500000, color: '#94a3b8' }
  ];
};
