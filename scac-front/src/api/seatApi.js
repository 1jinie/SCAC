import axiosInstance from './axiosInstance';

// 공용
export const seatApi = {
  getSeatList: () => axiosInstance.get('/api/seats'),

  getSeatById: (seatId) => axiosInstance.get(`/api/seats/${seatId}`),

  getOccupiedSeats: () => axiosInstance.get('/api/seats/occupied'),
};
