import { create } from "zustand";

export const deviceStore = create((set) => ({
  // 장치 목록
  devices: [],

  // 현재 선택 장치
  selectedDevice: null,

  // 장치 목록 설정
  setDevices: (devices) => {
    set({ devices });
  },

  // 장치 선택
  selectDevice: (device) => {
    set({ selectedDevice: device });
  },

  // 장치 선택 초기화
  clearSelectedDevice: () => {
    set({ selectedDevice: null });
  },

  // 장치 상태 변경
  updateDeviceStatus: (deviceId, status, message) => {
    set((state) => ({
      devices: state.devices.map((device) =>
        device.deviceId === deviceId
          ? {
              ...device,
              status,
              message: message ?? device.message,
            }
          : device,
      ),

      selectedDevice:
        state.selectedDevice?.deviceId === deviceId
          ? {
              ...state.selectedDevice,
              status,
              message: message ?? state.selectedDevice.message,
            }
          : state.selectedDevice,
    }));
  },
}));
