import axiosInstance from './axiosInstance';

export const checkinApi = {
  prepare: (data) => axiosInstance.post('/api/checkin/prepare', data),

  checkin: (data) => axiosInstance.post('/api/checkin', data),

  goOut: (checkinId) => axiosInstance.patch(`/api/checkin/${checkinId}/away`),

  comeBack: (checkinId) =>
    axiosInstance.patch(`/api/checkin/${checkinId}/comeback`),

  checkout: (checkinId) =>
    axiosInstance.patch(`/api/checkin/${checkinId}/checkout`),
};
