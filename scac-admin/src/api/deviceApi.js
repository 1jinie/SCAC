import axiosInstance from './axiosInstance';

export const deviceApi = {
  // 전체 장치 조회(기본값은 활성화된 장치만 조회, true로 하면 비활성화 장치도 함께 조회)
  getDevices: async (includeInactive = false) => {
    const response = await axiosInstance.get('/api/admin/devices', {
      params: { includeInactive },
    });
    return response.data.data;
  },

  // 특정 장치 조회
  getDevice: async (deviceId) => {
    const response = await axiosInstance.get(`/api/admin/devices/${deviceId}`);
    return response.data.data;
  },

  // 특정 장치 로그 조회
  getDeviceLogs: async (deviceId) => {
    const response = await axiosInstance.get(
      `/api/admin/devices/${deviceId}/logs`,
    );
    return response.data.data;
  },

  // 관리자 장치 상태 변경
  updateDeviceStatus: async (deviceId, status, message) => {
    const response = await axiosInstance.patch(
      `/api/admin/devices/${deviceId}/status`,
      {
        status,
        message,
      },
    );
    return response.data.data;
  },

  // 장치 활성 비활성 변경
  updateDeviceActive: async (deviceId, isActive) => {
    const response = await axiosInstance.patch(
      `/api/admin/devices/${deviceId}/active`,
      { isActive },
    );
    return response.data.data;
  },
};
