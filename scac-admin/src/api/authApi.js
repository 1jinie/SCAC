import axiosInstance from './axiosInstance.js';
// login,logout처럼 인증(토큰 발급/세션) 및 권한 도메인
// const DEFAULT_RETRY_COUNT = 3;
// 1. 일반 사용자 로그인 (phoneNumber, password)
export const postLogin = async (phoneNumber, password) => {
  const cleanPhone = phoneNumber.replace(/-/g, '');
  const response = await axiosInstance.post('/api/auth/login', {
    phoneNumber: cleanPhone,
    password,
  });
  return response.data; // { isSuccess: true, message: '...', data: { accessToken, refreshToken, ... } }
};

// 2. 관리자 로그인 (loginId, password)
export const postAdminLogin = async (loginId, password) => {
  const response = await axiosInstance.post('/api/admin/auth/login', {
    loginId,
    password,
  });
  return response.data;
};

// 3. 토큰 재발급 (Refresh Token)
export const postRefreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/api/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

// 4. 로그아웃
export const postLogout = async () => {
  const response = await axiosInstance.post('/api/auth/logout');
  return response.data;
};
