// Base API configuration

export const API_BASE_URL = '/api';

// This flag allows you to easily toggle between mock data and real API calls
export const USE_MOCK_API = true;

/**
 * A wrapper for making API requests.
 * Once you're ready to use the real API, this will handle fetch/axios calls.
 */
export const fetchApi = async (endpoint, options = {}) => {
  // Example implementation for the future:
  /*
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Include authorization headers (e.g. from localStorage) here
      ...options.headers,
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
  */
  
  throw new Error("fetchApi is not fully implemented for real API calls yet.");
};
