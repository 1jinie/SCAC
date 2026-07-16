import axiosInstance from './axiosInstance.js';

export const adminApi = {
  login: (data) => axiosInstance.post('/api/admin/login', data),

  logout: () => axiosInstance.post('/api/admin/logout'),

  getDashboardSummary: () => axiosInstance.get('/api/admin/dashboard'),

  getAdminProfile: () => axiosInstance.get('/api/admin/profile'),
};
