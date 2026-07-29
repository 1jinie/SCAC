import axiosInstance from './axiosInstance.js';

export const paymentApi = {
  getPayments: async () => {
    const response = await axiosInstance.get('/api/payments');
    return response.data.data;
  },

  getPayment: async (paymentId) => {
    const response = await axiosInstance.get(`/api/payments/${paymentId}`);
    return response.data.data;
  },

  cancelPayment: async (paymentId, cancelReason) => {
    const response = await axiosInstance.patch(
      `/api/payments/${paymentId}/cancel`,
      { cancelReason },
    );
    return response.data.data;
  },

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
};
