import axiosInstance from './axiosInstance.js';

export const reservationApi = {
  // 전체 예약 조회
  getReservationList: () => axiosInstance.get('/api/meeting-rooms'),

  // 예약 생성
  createReservation: (data) =>
    axiosInstance.post('/api/meeting-rooms/reservations', data),

  // 예약 취소
  cancelReservation: (reservationId) =>
    axiosInstance.patch(
      `/api/meeting-rooms/reservations/${reservationId}/cancel`,
    ),

  // 예약 가능 시간 조회
  getAvailableTime: (roomId, date) =>
    axiosInstance.get(`/api/meeting-rooms/${roomId}/availability`, {
      params: {
        date,
      },
    }),

  // 현재 사용자의 예약 조회
  getCurrentReservation: () => axiosInstance.get('/api/meeting-rooms/current'),
};
