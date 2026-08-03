import axiosInstance from './axiosInstance';

export const checkinApi = {
  prepare: (data) => axiosInstance.post('/api/checkin/prepare', data),

  prepareMember: () => axiosInstance.post('/api/checkin/prepare/member'),

  checkin: (data) => axiosInstance.post('/api/checkin', data),

  goOut: (data) => axiosInstance.patch('/api/checkin/away', data),

  comeBack: (data) => axiosInstance.patch('/api/checkin/comeback', data),

  checkout: (data) => axiosInstance.patch('/api/checkin/checkout', data),
};
