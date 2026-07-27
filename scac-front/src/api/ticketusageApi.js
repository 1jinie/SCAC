import axiosInstance from './axiosInstance.js';

export const ticketusageApi = {
  // 이용권 생성성성
  issueTicketUsage: async () => {
    const response = await axiosInstance.post('/api/ticket-usages');
    return response.data.data;
  },
};
