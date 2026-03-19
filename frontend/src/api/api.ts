import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

// Attach token automatically on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
   if (!config.headers) config.headers = {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;