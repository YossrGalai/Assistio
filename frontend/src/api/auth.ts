/*import api from './api';

export interface User {
  role: string;
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
  gouvernorat?: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  reputationScore: number;
  completedHelps: number;
  memberSince: string;
  phone?: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface LoginData { email: string; password: string; }
export interface RegisterData { name: string; email: string; password: string; city: string; }

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};
export const login = async (data: LoginData): Promise<{ token: string; user: User }> => {
  const response = await api.post('/users/login', data);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (data: RegisterData): Promise<{ token: string; user: User }> => {
  const response = await api.post('/users/register', data);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = () => localStorage.removeItem('token');

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/users/profile', data);
  return response.data;
};
export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
*/

import api from './api';

export interface User {
  role: string;
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
  gouvernorat?: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  reputationScore: number;
  completedHelps: number;
  memberSince: string;
  phone?: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface LoginData { email: string; password: string; }
export interface RegisterData { name: string; email: string; password: string; city: string; }

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const login = async (data: LoginData): Promise<{ token: string; user: User }> => {
  const response = await api.post('/users/login', data);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const register = async (data: RegisterData): Promise<{ token: string; user: User }> => {
  const response = await api.post('/users/register', data);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
  const response = await api.put('/users/change-password', { oldPassword, newPassword });
  return response.data;
};

export const deleteAccount = async (): Promise<{ message: string }> => {
  const response = await api.delete('/users/account');
  return response.data;
};

export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
