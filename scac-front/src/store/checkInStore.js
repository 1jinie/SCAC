import { create } from 'zustand';
import { checkinApi } from '../api/checkinApi';

export const checkInStore = create((set, get) => ({
  currentUser: null,
  currentCheckIn: null,
  prepareUserId: null,
  prepareUsageId: null,
  isLoading: false,
  errorMessage: '',

  // 입실 준비
  prepareCheckIn: async (phoneNumber, password) => {
    try {
      const response = await checkinApi.prepare({
        phoneNumber,
        password,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '입실 준비 실패',
      };
    }
  },

  setPreparedInfo: (userId, usageId) =>
    set({
      prepareUserId: userId,
      prepareUsageId: usageId,
    }),

  // 입실
  checkIn: async (seatId) => {
    const { prepareUserId, prepareUsageId } = get();

    if (!prepareUserId || !prepareUsageId) {
      return {
        success: false,
        message: '입실 준비가 완료되지 않았습니다',
      };
    }

    try {
      const response = await checkinApi.checkin({
        userId: prepareUserId,
        seatId,
        usageId: prepareUsageId,
      });

      set({
        currentCheckIn: response.data.data,
      });

      return {
        success: true,
        message: '입실되었습니다',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ?? '입실 실패',
      };
    }
  },

  // 외출
  goOut: async (phoneNumber, password) => {
    try {
      const response = await checkinApi.goOut({
        phoneNumber,
        password,
      });

      set({
        currentCheckIn: response.data.data,
      });

      return {
        success: true,
        message: '외출 처리되었습니다',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ?? '외출 실패',
      };
    }
  },

  // 복귀
  comeBack: async (phoneNumber, password) => {
    try {
      const response = await checkinApi.comeBack({
        phoneNumber,
        password,
      });

      set({
        currentCheckIn: response.data.data,
      });

      return {
        success: true,
        message: '재입실되었습니다',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ?? '재입실 실패',
      };
    }
  },

  // 퇴실
  checkOut: async (phoneNumber, password) => {
    try {
      const response = await checkinApi.checkout({
        phoneNumber,
        password,
      });

      set({
        currentUser: null,
        currentUser: null,
      });

      return {
        success: true,
        message: '퇴실되었습니다',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ?? '퇴실 실패',
      };
    }
  },

  // 데이터 초기화
  clearCheckIn: () => {
    set({
      currentUser: null,
      currentCheckIn: null,
      prepareUserId: null,
      prepareUsageId: null,
    });
  },
}));
