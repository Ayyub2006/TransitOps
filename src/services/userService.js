import { fetchApi } from './api';

export const getUserProfile = () => fetchApi('/users/profile');

export const updateUserProfile = (data) => fetchApi('/users/profile', {
  method: 'PUT',
  body: JSON.stringify(data)
});
