import axiosInstance from './axiosInstance.js';

/* 마이페이지용 */
export const getUserProfile = async (memberId) => {
  try {
    const response = await axiosInstance.get(`/api/users/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Get User Profile Error:', error);
    throw error;
  }
};

/* 비회원/게스트 등록 */
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

/* 회원이 보유한 활성화된 이용권 목록 조회 */
export const getUserActiveTickets = async (memberId) => {
  try {
    const response = await axiosInstance.get(`/api/users/${memberId}/tickets`);
    return response.data;
  } catch (error) {
    console.error('Get Active Tickets Error:', error);
    throw error;
  }
};

/* 관리자용 회원 검색 */
export const getUserByPhone = async (phoneNumber) => {
  try {
    const response = await axiosInstance.get('/api/users/search', {
      params: {
        phone_number: phoneNumber,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get User By Phone Error:', error);
    throw error;
  }
};
/* 회원 정보 수정 */
export const updateUserProfile = async (memberId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `/api/users/${memberId}`,
      updatedData,
    );
    return response.data;
  } catch (error) {
    console.error('Update User Profile Error:', error);
    throw error;
  }
};
