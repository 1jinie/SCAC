import { create } from 'zustand';
import { postLogin, postAdminLogin, postLogout } from '../api/authApi';

export const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  // 1. 일반 사용자 로그인 (phoneNumber, password)
  login: async (phoneNumber, password) => {
    set({ isLoading: true });
    try {
      const res = await postLogin(phoneNumber, password);
      if (res.isSuccess && res.data) {
        const { accessToken, refreshToken, user } = res.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(user));

        set({
          accessToken,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
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

  // 2. 관리자 로그인 (loginId, password) 👈 [추가됨]
  adminLogin: async (loginId, password) => {
    set({ isLoading: true });
    try {
      const res = await postAdminLogin(loginId, password);
      if (res.isSuccess && res.data) {
        const { accessToken, refreshToken, adminInfo } = res.data;

        // 관리자 정보를 user 상태에 동일 규격으로 저장
        const userObj = adminInfo || { loginId, role: 'ROLE_ADMIN' };

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(userObj));

        set({
          accessToken,
          user: userObj,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
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

  // 3. 로그아웃
  logout: async () => {
    try {
      await postLogout();
    } catch (e) {
      console.warn('Logout API Failed:', e);
    } finally {
      localStorage.clear();
      set({ accessToken: null, user: null, isAuthenticated: false });
    }
  },
}));
