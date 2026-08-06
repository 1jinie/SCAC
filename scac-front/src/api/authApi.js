import axiosInstance from './axiosInstance.js';

// 1. 일반 사용자 로그인
export const postLogin = async (phoneNumber, password) => {
  const cleanPhone = phoneNumber.replace(/-/g, '');
  const response = await axiosInstance.post('/api/auth/login', {
    phoneNumber: cleanPhone,
    password,
  });
  return response.data;
};

// 2. 관리자 로그인
export const postAdminLogin = async (loginId, password) => {
  const response = await axiosInstance.post('/api/admin/auth/login', {
    loginId,
    password,
  });
  return response.data;
};

// 3. 사용자 토큰 재발급
export const postRefreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/api/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

// 4. 관리자 토큰 재발급
export const postAdminRefreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/api/admin/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

// 5. 일반 사용자 로그아웃
export const postLogout = async () => {
  const response = await axiosInstance.post('/api/auth/logout');
  return response.data;
};

// 6. 관리자 로그아웃
export const postAdminLogout = async () => {
  const response = await axiosInstance.post('/api/admin/auth/logout');
  return response.data;
};
