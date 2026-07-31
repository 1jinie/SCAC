import axiosInstance from './axiosInstance.js';

// 0. 전화번호 중복 / 존재 여부 확인
export const checkPhoneExists = async (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/-/g, '');
  const response = await axiosInstance.get('/api/users/check-phone', {
    params: { phoneNumber: cleanPhone },
  });
  return response.data;
};

// 1. 일반 회원가입
export const postSignUp = async (userData) => {
  const response = await axiosInstance.post('/api/users/signup', {
    ...userData,
    phoneNumber: userData.phoneNumber.replace(/-/g, ''),
  });
  return response.data;
};

// 2. 비회원/게스트 등록
export const postGuestSignUp = async (userData) => {
  const response = await axiosInstance.post('/api/users/guest', {
    phoneNumber: userData.phoneNumber.replace(/-/g, ''),
    password: userData.password,
  });
  return response.data;
};

// 3. 마이페이지 회원 상세 정보 조회
export const getUserProfile = async (userId) => {
  const response = await axiosInstance.get(`/api/users/${userId}`);
  return response.data;
};

// 4. 입실 비밀번호 검증 (키오스크/출입문용)
export const verifyEntryPassword = async (phoneNumber, password) => {
  const cleanPhone = phoneNumber.replace(/-/g, '');
  const response = await axiosInstance.post(
    '/api/users/entry-password/verify',
    {
      phoneNumber: cleanPhone,
      password,
    },
  );
  return response.data;
};

// 5. 입실 비밀번호 변경 (마이페이지용 - DTO 규격 맞춤)
export const updateUserPassword = async (
  userId,
  { currentPassword, newPassword },
) => {
  const response = await axiosInstance.patch(
    `/api/users/${userId}/entry-password`,
    {
      currentPassword,
      newPassword,
    },
  );
  return response.data;
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
