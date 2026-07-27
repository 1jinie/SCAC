import axiosInstance from './axiosInstance.js';

export const roomApi = {
  // 스터디룸 전체 조회
  getRoomList: () => axiosInstance.get('api/rooms'),

  // 스터디룸 상세 조회
  getRoomById: (roomId) => axiosInstance.get(`/api/rooms/${roomId}`),
};
