import axiosInstance from './axiosInstance.js';

export const paymentApi = {
  // 토스 결제 준비
  createPayment: async (data) => {
    const response = await axiosInstance.post(`/api/payments`, data);
    return response.data.data;
  },

  // 토스결제 승인완료
  confirmPayment: async (data) => {
    const response = await axiosInstance.post('/api/payments/confirm', data);

    return response.data.data;
  },

  mockConfirmPayment: async (paymentId) => {
    const response = await axiosInstance.post(
      `/api/payments/${paymentId}/mock-confirm`,
    );
    return response.data.data;
  },

  // 사용자 결제 내역 조회
  getPayment: async (paymentId) => {
    const response = await axiosInstance.get(`/api/payments/${paymentId}`);

    return response.data.data;
  },
};
