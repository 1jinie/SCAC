import { create } from 'zustand';
import { reservationApi } from '../api/reservationApi';

export const reservationStore = create((set) => ({
  // 예약 페이지에서 사용할 선택 예약 정보
  reservation: {
    userId: null,
    roomId: null,
    date: null,
    startTime: null,
    endTime: null,
  },

  // 전체 예약 목록
  reservations: [],

  // 예약 선택 정보 저장
  setReservation: (data) =>
    set((state) => ({
      reservation: {
        ...state.reservation,
        ...data,
      },
    })),

  // 예약 선택 정보 초기화
  clearReservation: () =>
    set({
      reservation: {
        userId: null,
        roomId: null,
        date: null,
        startTime: null,
        endTime: null,
      },
    }),

  // 전체 예약 목록 조회
  fetchReservations: async () => {
    try {
      const response = await reservationApi.getReservationList();

      set({
        reservations: response.data?.data ?? [],
      });
    } catch (error) {
      console.error('예약 목록 조회 실패: ', error);

      set({
        reservations: [],
      });
    }
  },

  // 현재 사용자 예약 조회
  fetchCurrentReservation: async () => {
    try {
      const response = await reservationApi.getCurrentReservation();
      const data = response.data.data;

      set({ currentReservation: data });

      return {
        success: true,
        data,
      };
    } catch (error) {
      set({ currentReservation: null });

      return {
        success: false,
        message:
          error.response?.data?.message ?? '현재 예약 조회에 실패했습니다',
      };
    }
  },
}));
