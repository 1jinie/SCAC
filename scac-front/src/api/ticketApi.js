import axiosInstance from './axiosInstance.js';

export const ticketApi = {
  getTicketList: async () => {
    const response = await axiosInstance.get('/api/tickets');

    return response.data.data;
  },

  getById: async (ticketId) => {
    const response = await axiosInstance.get(`/api/tickets/${ticketId}`);

    return response.data.data;
  },
};
