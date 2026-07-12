import { fetchApi } from './api';

export const getDrivers = () => fetchApi('/drivers');

export const registerDriver = (data) => fetchApi('/drivers', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const suspendDriver = (id) => fetchApi(`/drivers/${id}/suspend`, {
  method: 'PATCH'
});

export const reinstateDriver = (id) => fetchApi(`/drivers/${id}/reinstate`, {
  method: 'PATCH'
});
