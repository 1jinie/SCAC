import axiosInstance from './axiosInstance.js';

export const ticketusageApi = {
  // 이용권 생성
  issueTicketUsage: async () => {
    const response = await axiosInstance.post('/api/ticket-usages');
    return response.data.data;
  },

  //이용권 구매 시 사용자가 이미 이용권을 가지고있는지 확인하는 API
  isTicketUsage: async () => {
    const response = await axiosInstance.get(
      '/api/ticket-usages/available-seat/exists',
    );
    return response.data.data;
  },
};
