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

  updateTicket: async (ticketId, ticket) => {
    const response = await axiosInstance.put(
      `/api/tickets/${ticketId}`,
      ticket,
    );
    return response.data.data;
  },
  createTicket: async (ticket) => {
    const response = await axiosInstance.post(`/api/tickets`, ticket);
    return response.data.data;
  },
};
