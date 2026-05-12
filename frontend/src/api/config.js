export const API_BASE_URL = 'http://localhost:5000/api';

export const fetchWithAuth = async (url, options = {}) => {
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
