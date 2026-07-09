import axios from './axios';
// login,logout처럼 인증(토큰 발급/세션) 및 권한 도메인
// 사용자가 매장에 진입하거나 관리자가 백오피스에 로그인할 때 사용하는 API 그룹
// 변수: camelCase / 상수: UPPER_SNAKE_CASE
const DEFAULT_RETRY_COUNT = 3;
/* 일반 사용자 로그인 */
export const postLogin = async (phoneNumber, password) => {
  try {
    const response = await axios.post('/api/auth/login', {
      // DB 컬럼 규칙이 snake_case이므로 API 요청 바디도 이에 맞춤
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
    const response = await axios.post('/api/auth/admin/login', {
      admin_id: adminId, // 컨벤션에 맞춰 admin_id로 매핑
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
    const response = await axios.post('/api/auth/signup', {
      // userData 객체 내부에 camelCase로 저장된 값을 DB 규격인 snake_case로 풀어서 전송
      user_name: userData.name,
      phone_number: userData.phoneNumber,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    console.error('Sign Up Error:', error);
    throw error;
  }
};
