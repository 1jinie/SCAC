import axiosInstance from "./axiosInstance";

// 공용
export const seatApi = {
  getSeatList: () => axiosInstance.get("/api/seats"),

  getSeatById: (seatId) => axiosInstance.get(`/api/seats/${seatId}`),

  getOccupiedSeats: () => axiosInstance.get("/api/seats/occupied"),
};

// 관리자용
export const adminSeatApi = {
  // 좌석 상태 변경
  updateSeatStatus: (seatId, status) =>
    axiosInstance.patch(`/api/admin/seats/${seatId}/status`, {
      status,
    }),

  // 강제 퇴실
  forceCheckout: (seatId) =>
    axiosInstance.post(`/api/admin/seats/${seatId}/force-checkout`),

  // 선택 좌석 이용 로그
  getSeatLogs: (seatId) => axiosInstance.get(`/api/admin/seats/${seatId}/logs`),
};
