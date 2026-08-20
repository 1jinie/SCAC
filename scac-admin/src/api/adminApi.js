import axiosInstance from './axiosInstance.js';

export const adminApi = {
  login: async (data) => {
    const response = await axiosInstance.post('/api/admin/auth/login', data);
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await axiosInstance.post('/api/admin/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/api/admin/auth/logout');
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await axiosInstance.get('/api/admin/dashboard');
    return response.data.data;
  },

  getAdminProfile: () => axiosInstance.get('/api/admin/profile'),

  createAdminAccount: async (data) => {
    const response = await axiosInstance.post('/api/admin/accounts', data);
    return response.data;
  },
};
