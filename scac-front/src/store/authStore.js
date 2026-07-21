import { create } from 'zustand';
import { users as mockUsers } from '../data/User';

export const useAuthStore = create((set) => ({
  // --- 상태 (State) ---
  isLoggedIn: false,
  userRole: 'GUEST',
  memberId: null,
  userPhone: null,
  users: mockUsers,

  // --- 액션 (Actions) ---
  login: async (phoneNumber, password) => {
    try {
      const user = mockUsers.find(
        (item) => item.phone === phoneNumber && item.password === password,
      );

      if (!user) {
        return {
          success: false,
          error: '전화번호 또는 비밀번호가 일치하지 않습니다.',
        };
      }

      set({
        isLoggedIn: true,
        userRole: 'USER',
        memberId: user.id,
        userPhone: user.phone,
        users: mockUsers,
      });

      return { success: true, role: 'USER' };
    } catch (error) {
      console.error('Store Login Error:', error);
      return { success: false, error };
    }
  },

  logout: async () => {
    set({
      isLoggedIn: false,
      userRole: 'GUEST',
      memberId: null,
      userPhone: null,
    });
  },

  signUp: async (userData) => {
    try {
      const existingUser = mockUsers.find(
        (item) => item.phone === userData.phoneNumber,
      );

      if (existingUser) {
        return {
          success: false,
          errorMessage: '이미 등록된 전화번호입니다.',
        };
      }

      const nextId =
        mockUsers.length > 0
          ? Math.max(...mockUsers.map((item) => item.id)) + 1
          : 1;

      const newUser = {
        id: nextId,
        phone: userData.phoneNumber,
        password: userData.password,
        timeLeft: 120,
      };

      mockUsers.push(newUser);

      set({
        isLoggedIn: true,
        userRole: 'USER',
        memberId: nextId,
        userPhone: userData.phoneNumber,
        users: mockUsers,
      });

      return { success: true, memberId: nextId };
    } catch (error) {
      console.error('Store SignUp Error:', error);
      return {
        success: false,
        errorMessage: error.message || '회원가입 처리 중 오류가 발생했습니다.',
      };
    }
  },
}));
