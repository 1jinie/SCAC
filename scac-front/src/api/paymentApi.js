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

  payPrepare: async (data) => {
    const response = await axiosInstance.post(
      `/api/payments/tossPrepare`,
      data,
    );
    return response.data.data;
  },

  payConfirm: async (data) => {
    const response = await axiosInstance.post('/payments/tossConfirm', data);

    return response.data.data;
  },
};
