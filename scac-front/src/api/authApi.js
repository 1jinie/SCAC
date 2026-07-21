import axiosInstance from './axiosInstance.js';
// login,logout처럼 인증(토큰 발급/세션) 및 권한 도메인
// const DEFAULT_RETRY_COUNT = 3;
/* 일반 사용자 로그인 */
export const postLogin = async (phoneNumber, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', {
      phone_number: phoneNumber,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

/* 관리자 로그인 */
export const postAdminLogin = async (adminId, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/admin/login', {
      admin_id: adminId,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('Admin Login Error:', error);
    throw error;
  }
};

/* 회원가입 */
export const postSignUp = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/auth/signup', {
      phone_number: userData.phoneNumber,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    console.error('Sign Up Error:', error);
    throw error;
  }
};
/* 로그아웃 */
export const postLogout = async () => {
  try {
    const response = await axiosInstance.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};
