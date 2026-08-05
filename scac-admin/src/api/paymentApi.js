import axiosInstance from './axiosInstance.js';

export const paymentApi = {
  getPayments: async () => {
    const response = await axiosInstance.get('/api/admin/payments');
    return response.data.data;
  },

  getPayment: async (paymentId) => {
    const response = await axiosInstance.get(
      `/api/admin/payments/${paymentId}`,
    );
    return response.data.data;
  },

  cancelPayment: async (paymentId, cancelReason) => {
    const response = await axiosInstance.patch(
      `/api/admin/payments/${paymentId}/cancel`,
      { cancelReason },
    );
    return response.data.data;
  },
  deletePayment: async (paymentId) => {
    const response = await axiosInstance.delete(
      `/api/admin/payments/${paymentId}`,
    );
    return response.data;
  },
};
