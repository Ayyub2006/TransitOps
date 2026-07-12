import { fetchApi } from './api';

export const getVehicles = () => fetchApi('/vehicles');

export const registerVehicle = (data) => fetchApi('/vehicles', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const retireVehicle = (id) => fetchApi(`/vehicles/${id}/retire`, {
  method: 'PATCH'
});
