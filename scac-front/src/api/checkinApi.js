import axiosInstance from './axiosInstance';

export const checkinApi = {
  prepare: (data) => axiosInstance.post('/api/checkin/prepare', data),

  prepareMember: () => axiosInstance.post('/api/checkin/prepare/member'),

  checkin: (data) => axiosInstance.post('/api/checkin', data),

  goOut: (data) => axiosInstance.patch('/api/checkin/away', data),

  memberGoOut: () => axiosInstance.patch('/api/checkin/away/member'),

  comeBack: (data) => axiosInstance.patch('/api/checkin/comeback', data),

  memberComeBack: () => axiosInstance.patch('/api/checkin/comeback/member'),

  checkout: (data) => axiosInstance.patch('/api/checkin/checkout', data),

  memberCheckOut: () => axiosInstance.patch('/api/checkin/checkout/member'),
};
