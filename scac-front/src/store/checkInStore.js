import { create } from 'zustand';
import { checkinApi } from '../api/checkinApi';

export const checkInStore = create((set, get) => ({
  currentUser: null,
  currentCheckIn: null,
  // 임시 인증정보
  tempAuth: {
    phoneNumber: null,
    password: null,
  },
  isLoading: false,
  errorMessage: '',

  // 입실 검증
  verifyEntryPassword: async (phoneNumber, password, seatId = null) => {
    try {
      const response = await checkinApi.verifyEntryPassword({
        phoneNumber,
        password,
      });

      set({
        currentUser: response.data.data,
        tempAuth: {
          phoneNumber,
          password,
        },
      });

      return {
        success: true,
        message: '인증되었습니다',
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
      tempAuth: {
        phoneNumber: null,
        password: null,
      },
    });
  },

  // 입실 요청
  completeCheckIn: async (seatId) => {
    const { tempAuth } = get();

    if (!tempAuth.phoneNumber || !tempAuth.password) {
      return {
        success: false,
        message: '인증 정보가 없습니다',
      };
    }

    try {
      const response = await checkinApi.checkin({
        phoneNumber: tempAuth.phoneNumber,
        password: tempAuth.password,
        seatId,
      });

      set({
        currentCheckIn: response.data.data.checkIn,
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
}));
