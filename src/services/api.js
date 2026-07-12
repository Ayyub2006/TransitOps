export const API_BASE_URL = '/api';

export const USE_MOCK_API = false;

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
