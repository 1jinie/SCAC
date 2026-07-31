import axiosInstance from './axiosInstance';

export const deviceApi = {
  // 전체 장치 조회
  getDevices: async () => {
    const response = await axiosInstance.get('/api/devices');

    return response.data.data;
  },

  // 특정 장치 조회
  getDevice: async (deviceId) => {
    const response = await axiosInstance.get(`/api/devices/${deviceId}`);

    return response.data.data;
  },

  // 특정 장치 로그 조회
  getDeviceLogs: async (deviceId) => {
    const response = await axiosInstance.get(`/api/devices/${deviceId}/logs`);

    return response.data.data;
  },

  // 관리자 장치 상태 변경
  updateDeviceStatus: async (deviceId, status, message) => {
    const response = await axiosInstance.patch(
      `/api/devices/${deviceId}/status`,
      {
        status,
        message,
      },
    );

    return response.data.data;
  },
};
