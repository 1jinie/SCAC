import { create } from 'zustand';
import {
  postLogin,
  postAdminLogin,
  postLogout,
  postAdminLogout,
} from '../api/authApi';
import { postSignUp, postGuestSignUp } from '../api/userApi';

export const useAuthStore = create((set, get) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  // 1. 일반 사용자 로그인
  login: async (phoneNumber, password) => {
    set({ isLoading: true });
    try {
      const res = await postLogin(phoneNumber, password);
      if (res.isSuccess && res.data) {
        const { accessToken, refreshToken, userId, phoneNumber, role } =
          res.data;

        const userObj = {
          userId,
          phoneNumber,
          role,
          isAdmin: false,
        };

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(userObj));

        set({
          accessToken,
          user: userObj,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, role: userObj?.role };
      }
      set({ isLoading: false });
      return {
        success: false,
        message: res.message || '로그인에 실패했습니다.',
      };
    } catch (error) {
      set({ isLoading: false });
      const message =
        error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      return { success: false, message };
    }
  },

  // 2. 관리자 로그인 (SUPER_ADMIN, STAFF 등의 실제 역할 저장)
  adminLogin: async (loginId, password) => {
    set({ isLoading: true });
    try {
      const res = await postAdminLogin(loginId, password);
      if (res.isSuccess && res.data) {
        const { accessToken, refreshToken, adminId, loginId, role } = res.data;

        const userObj = {
          adminId,
          loginId,
          role: role, // 'SUPER_ADMIN' 또는 'STAFF'
          isAdmin: true,
        };

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(userObj));

        set({
          accessToken,
          user: userObj,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, role: userObj.role };
      }
      set({ isLoading: false });
      return {
        success: false,
        message: res.message || '관리자 로그인에 실패했습니다.',
      };
    } catch (error) {
      set({ isLoading: false });
      const message =
        error.response?.data?.message ||
        '관리자 로그인 중 오류가 발생했습니다.';
      return { success: false, message };
    }
  },

  // 3. 회원가입
  signUp: async (userData) => {
    set({ isLoading: true });
    try {
      const res = await postSignUp(userData);
      set({ isLoading: false });
      if (res.isSuccess) {
        return { success: true, userId: res.data?.userId };
      }
      return {
        success: false,
        errorMessage: res.message || '회원가입에 실패했습니다.',
      };
    } catch (error) {
      set({ isLoading: false });
      const errorMessage =
        error.response?.data?.message ||
        '회원가입 처리 중 오류가 발생했습니다.';
      return { success: false, errorMessage };
    }
  },

  // 4. 게스트 등록
  guestSignUp: async (userData) => {
    set({ isLoading: true });
    try {
      const res = await postGuestSignUp(userData);
      set({ isLoading: false });
      if (res.isSuccess) {
        return { success: true, userId: res.data?.userId };
      }
      return {
        success: false,
        errorMessage: res.message || '비회원 등록에 실패했습니다.',
      };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        errorMessage:
          error.response?.data?.message ??
          '비회원 등록 처리 중 오류가 발생했습니다.',
      };
    }
  },

  // 5. 로그아웃 (관리자/사용자 구분하여 백엔드 DB 토큰 정상 삭제)
  logout: async () => {
    const currentUser = get().user;
    try {
      if (currentUser?.isAdmin || currentUser?.adminId) {
        await postAdminLogout();
      } else {
        await postLogout();
      }
    } catch (e) {
      console.warn('Logout API Call Error:', e);
    } finally {
      localStorage.clear();
      set({ accessToken: null, user: null, isAuthenticated: false });
    }
  },
}));
