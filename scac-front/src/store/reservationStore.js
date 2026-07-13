import { create } from 'zustand';

export const reservationStore = create((set) => ({
  roomId: null,

  setRoomId: (roomId) =>
    set({
      roomId,
    }),
  clearReservation: () =>
    set({
      roomId: null,
    }),
}));
