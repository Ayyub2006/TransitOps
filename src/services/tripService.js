import { fetchApi } from './api';

export const getTrips = () => fetchApi('/trips');

export const createTrip = (data) => fetchApi('/trips', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const dispatchTrip = (id) => fetchApi(`/trips/${id}/dispatch`, {
  method: 'PATCH'
});

export const completeTrip = (id, data) => fetchApi(`/trips/${id}/complete`, {
  method: 'PATCH',
  body: JSON.stringify(data)
});
