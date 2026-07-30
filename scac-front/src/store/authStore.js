import { create } from 'zustand';
import { postLogin, postAdminLogin, postLogout } from '../api/authApi';

export const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  login: async (phoneNumber, password) => {
    set({ isLoading: true });
    try {
      const res = await postLogin(phoneNumber, password); // ApiResponse
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
      return { success: false, message: res.message };
    } catch (error) {
      set({ isLoading: false });
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      return { success: false, message };
    }
  },

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
