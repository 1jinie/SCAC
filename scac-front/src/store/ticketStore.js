import { create } from 'zustand';

export const useTicketStore = create((set) => ({
  //선택한 티켓 아아디
  selectedTicketId: null,

  //선택한 티켓 타입('SEAT', 'MEETING_ROOM')
  targetType: null,

  selectTicket: (ticketId) => set({ selectedTicketId: ticketId }),

  setPurchaseType: (targetType) => set({ targetType: targetType }),

  resetStore: () => set({ selectedTicketId: null, targetType: null }),
}));
