import { create } from 'zustand';

export const useTicketStore = create((set) => ({
  //선택한 티켓 아아디
  selectedTicketId: null,

  //선택한 티켓 타입('SEAT', 'STUDY_ROOM')
  purchaseType: null,

  selectTicket: (ticketId) => set({ selectedTicketId: ticketId }),

  setPurchaseType: (purchaseType) => set({ purchaseType: purchaseType }),

  resetStore: () => set({ selectedTicketId: null, purchaseType: null }),
}));
