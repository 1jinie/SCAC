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
      `/api/admin/tickets/${ticketId}`,
      ticket,
    );
    return response.data.data;
  },
  createTicket: async (ticket) => {
    const response = await axiosInstance.post(`/api/admin/tickets`, ticket);
    return response.data.data;
  },

  deleteTicket: async (ticketId) => {
    const response = await axiosInstance.delete(
      `/api/admin/tickets/${ticketId}`,
    );

    return response.data.data;
  },
};
