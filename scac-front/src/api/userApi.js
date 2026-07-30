import axiosInstance from './axiosInstance.js';

/* 0. 전화번호 중복 / 존재 여부 확인 */
export const checkPhoneExists = async (phoneNumber) => {
  try {
    const response = await axiosInstance.get('/api/users/check-phone', {
      params: { phoneNumber },
    });
    return response.data;
  } catch (error) {
    console.error('Check Phone Exists Error:', error);
    throw error;
  }
};

/* 1. 일반 회원가입 */
export const postSignUp = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/users/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Sign Up Error:', error);
    throw error;
  }
};

/* 2. 비회원/게스트 등록 */
export const postGuestSignUp = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/users/guest', {
      phoneNumber: userData.phoneNumber,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    console.error('Guest Sign Up Error:', error);
    throw error;
  }
};

/* 3. 마이페이지 회원 상세 정보 조회 */
export const getUserProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get User Profile Error:', error);
    throw error;
  }
};

/* 4. 입실 비밀번호 검증 (키오스크 / 출입문 단말기용) */
export const verifyEntryPassword = async (phoneNumber, password) => {
  try {
    const response = await axiosInstance.post(
      '/api/users/entry-password/verify',
      {
        phoneNumber,
        password,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Verify Entry Password Error:', error);
    throw error;
  }
};

/* 5. 입실 비밀번호 변경 (마이페이지용) */
export const updateUserPassword = async (userId, password) => {
  try {
    const response = await axiosInstance.patch(
      `/api/users/${userId}/entry-password`,
      {
        password,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Update User Password Error:', error);
    throw error;
  }
};

/* 6. 회원이 보유한 활성화된 이용권 목록 조회 */
export const getUserActiveTickets = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/users/${userId}/tickets`);
    return response.data;
  } catch (error) {
    console.error('Get Active Tickets Error:', error);
    throw error;
  }
};
