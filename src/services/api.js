export const API_BASE_URL = '/api';

export const USE_MOCK_API = false;

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const activeFleetId = localStorage.getItem('active_fleet_id');
  
  let url = `${API_BASE_URL}${endpoint}`;
  if (activeFleetId) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}fleet_id=${activeFleetId}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    }
  });
  
  if (!response.ok) {
    const errText = await response.text();
    let errMessage = response.statusText;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.error) errMessage = parsed.error;
    } catch (e) {}
    throw new Error(errMessage);
  }
  
  return response.json();
};
