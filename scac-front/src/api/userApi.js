import axios from './axios';

/* 특정 회원 프로필 조회 (마이페이지용) */
export const getUserProfile = async (memberId) => {
  try {
    // URL 경로에 식별자가 들어갈 때는 자바스크립트 변수 그대로 매핑
    const response = await axios.get(`/api/users/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Get User Profile Error:', error);
    throw error;
  }
};

/* 회원이 보유한 활성화된 이용권 목록 조회 */
export const getUserActiveTickets = async (memberId) => {
  try {
    const response = await axios.get(`/api/users/${memberId}/tickets`);
    return response.data;
  } catch (error) {
    console.error('Get Active Tickets Error:', error);
    throw error;
  }
};

/* 관리자용 회원 검색 */
export const getUserByPhone = async (phoneNumber) => {
  try {
    // 쿼리 스트링 매개변수 명칭(phone_number)을 DB/백엔드 규격에 맞춰 전송
    const response = await axios.get('/api/users/search', {
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
