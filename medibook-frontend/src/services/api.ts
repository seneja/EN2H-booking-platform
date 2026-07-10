import axios from 'axios';

// Use the Vite proxy in development, or the real API URL in production
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medibook_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('medibook_token');
      localStorage.removeItem('medibook_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
