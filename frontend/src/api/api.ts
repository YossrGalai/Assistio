import axios, { AxiosHeaders } from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (!config.headers) config.headers = new AxiosHeaders();

  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

export default api;