import { create } from "zustand";
import { seats as initialSeats } from "../data/Seats";

export const seatStore = create((set) => ({
  seats: initialSeats,

  // 현재 선택 좌석 id
  selectedSeat: null,
  // 좌석 선택, 초기화

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
  checkInSeat: () =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.id === state.selectedSeat
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

  // 특정 좌석 상태 변경(관리자용) - seatId가 문자열로 들어오는 경우 처리
  updateSeatStatus: (seatId, status) =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        Number(seat.id) === Number(seatId)
          ? {
              ...seat,
              status,
            }
          : seat,
      ),
    })),
}));
