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

  // 관리자 계정 생성(super_admin만 가능하며 생성된 계정의 role 기본값은 staff)
  createAdminAccount: async (data) => {
    const response = await axiosInstance.post('/api/admin/accounts', data);
    return response.data;
  },

  // 관리자 계정 목록 조회
  getAdminAccounts: async () => {
    const response = await axiosInstance.get('/api/admin/accounts');
    return response.data.data;
  },
  // 관리자 계정 상세
  getAdminAccount: async (adminId) => {
    const response = await axiosInstance.get(`/api/admin/accounts/${adminId}`);

    return response.data.data;
  },

  // 관리자 계정 수정
  updateAdminAccount: async (adminId, data) => {
    const response = await axiosInstance.patch(
      `/api/admin/accounts/${adminId}`,
      data,
    );

    return response.data;
  },

  // 관리자 계정 삭제
  deleteAdminAccount: async (adminId) => {
    const response = await axiosInstance.delete(
      `/api/admin/accounts/${adminId}`,
    );

    return response.data;
  },
};
