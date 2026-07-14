import { create } from 'zustand';

export const reservationStore = create((set) => ({
  reservation: {
    roomId: null,
    date: null,
    startTime: null,
    endTime: null,
  },

  setReservation: (data) =>
    set((state) => ({
      reservation: {
        ...state.reservation,
        ...data,
      },
    })),

  clearReservation: () =>
    set({
      reservation: {
        roomId: null,
        date: null,
        startTime: null,
        endTime: null,
      },
    }),
}));
