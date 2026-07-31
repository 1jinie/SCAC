import { create } from 'zustand';
import {
  postLogin,
  postSignUp,
  postGuestSignUp,
  postLogout,
} from '../api/authApi';

export const useAuthStore = create((set) => ({
  // --- 상태 (State) ---
  isLoggedIn: false,
  userRole: 'GUEST',
  memberId: null,
  userPhone: null,
  accessToken: null,
  refreshToken: null,

  // --- 액션 (Actions) ---
  login: async (phoneNumber, password) => {
    try {
      const response = await postLogin(phoneNumber, password);
      const result = response.data;

      if (!result.success) {
        return { success: false, message: result.message };
      }

      const user = result.data;
      set({
        isLoggedIn: true,
        userRole: user.role,
        memberId: user.userId,
        userPhone: user.phoneNumber,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });

      localStorage.setItem('accessToken', user.accessToken);
      localStorage.setItem('refreshToken', user.refreshToken);

      return { success: true, role: user.role };
    } catch (error) {
      console.error('Store Login Error:', error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          '로그인 처리 중 오류가 발생했습니다.',
      };
    }
  },

  logout: async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error('Store Logout Error:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    set({
      isLoggedIn: false,
      userRole: 'GUEST',
      memberId: null,
      userPhone: null,
      accessToken: null,
      refreshToken: null,
    });
  },

  signUp: async (userData) => {
    try {
      const response = await postSignUp(userData);
      const result = response.data;

      if (!result.success) {
        return {
          success: false,
          errorMessage: result.message,
        };
      }

      const user = result.data;
      return {
        success: true,
        memberId: user.userId,
        phoneNumber: user.phoneNumber,
      };
    } catch (error) {
      console.error('Store SignUp Error:', error);
      return {
        success: false,
        errorMessage:
          error?.response?.data?.message ||
          '회원가입 처리 중 오류가 발생했습니다.',
      };
    }
  },

  guestSignUp: async (userData) => {
    try {
      const response = await postGuestSignUp(userData);
      const result = response.data;

      if (!result.success) {
        return {
          success: false,
          errorMessage: result.message,
        };
      }

      const user = result.data;
      return {
        success: true,
        memberId: user.userId,
        phoneNumber: user.phoneNumber,
      };
    } catch (error) {
      console.error('Store GuestSignUp Error:', error);
      return {
        success: false,
        errorMessage:
          error?.response?.data?.message ||
          '비회원 등록 처리 중 오류가 발생했습니다.',
      };
    }
  },
}));
