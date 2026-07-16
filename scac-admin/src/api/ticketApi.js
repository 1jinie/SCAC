import tickets from '../data/tickets.json';
import axiosInstance from './axiosInstance.js';

export const ticketApi = {
  getTicketList: async () => {
    return tickets;
  },

  // getTicketList: () => axiosInstance.get('/tickets',data);,

  getById: async (ticketId) => {
    return tickets.find((ticket) => ticket.ticketId === ticketId) ?? null;
  },
};
