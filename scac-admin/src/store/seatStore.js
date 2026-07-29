import { create } from "zustand";
import { seatApi } from "../api/seatApi";
import { seatLayouts } from "../constants/SeatLayout";

export const seatStore = create((set) => ({
  // 좌석 선택, 초기화
  seats: [],
  selectedSeat: null,

  // 좌석 조회
  fetchSeats: async () => {
    const response = await seatApi.getSeatList();
    const statusMap = {
      AVB: "available",
      USR: "using",
      BRK: "repair",
      UNA: "unavailable",
    };
    const seats = response.data.data.map((seat) => {
      const layout = seatLayouts.find(
        (item) => item.id === seat.seatId && item.type === "seat",
      );
      return {
        id: seat.seatId,
        name: seat.seatNumber,
        type: "seat",
        status: statusMap[seat.status],
        currentUserId: seat.currentUserId,
        ...layout,
      };
    });
    set({
      seats,
    });
  },

  selectSeat: (seatId) =>
    set((state) => ({
      selectedSeat: state.selectedSeat === seatId ? null : seatId,
    })),

  // 선택 좌석 초기화
  clearSelected: () =>
    set({
      selectedSeat: null,
    }),

  // 체크인 성공시 좌석 사용중 변경
  checkInSeat: (seatId) =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              status: "using",
            }
          : seat,
      ),
      selectedSeat: null,
    })),

  // 체크아웃 성공시 좌석 사용가능 변경
  checkOutSeat: (seatId) =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              status: "available",
            }
          : seat,
      ),
    })),

  // 특정 좌석 상태 변경(관리자용)
  updateSeatStatus: (seatId, status) =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              status,
            }
          : seat,
      ),
    })),
}));
