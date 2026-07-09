import { create } from 'zustand';

export const useTicketStore = create((set) => ({
  selectedTicket: null,

  selectTicket: (ticket) => set({ selectedTicket: ticket }),

  clearSelectedTicket: () => set({ selectedTicket: null }),
}));
