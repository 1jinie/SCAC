import { create } from 'zustand';
import {
  getUserProfile,
  updateUserPassword,
  checkPhoneExists,
  verifyEntryPassword,
} from '../api/userApi';

export const useUserStore = create((set, get) => ({
  userProfile: null,
  isLoading: false,
  errorMessage: '',

  /* 1. 내 프로필 정보 조회 (마이페이지용) */
  getUserProfile: async (userId) => {
    set({ isLoading: true, errorMessage: '' });
    try {
      const result = await getUserProfile(userId);

      if (!result.success) {
        throw new Error(result.message);
      }

      set({ userProfile: result.data });
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Store Get Profile Error:', error);
      set({ errorMessage: '프로필 정보를 불러오지 못했습니다.' });
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },

  /* 2. 입실 비밀번호 변경 (마이페이지용) */
  modifyUserPassword: async (userId, newPassword) => {
    set({ isLoading: true, errorMessage: '' });
    try {
      const result = await updateUserPassword(userId, newPassword);

      if (!result.success) {
        throw new Error(result.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Store Modify Password Error:', error);
      set({ errorMessage: '비밀번호 변경에 실패했습니다.' });
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },

  /* 3. 전화번호 중복 / 존재 여부 확인 */
  checkPhoneExists: async (phoneNumber) => {
    set({ isLoading: true, errorMessage: '' });
    try {
      const result = await checkPhoneExists(phoneNumber);

      if (!result.success) {
        throw new Error(result.message);
      }

      return { success: true, exists: result.data };
    } catch (error) {
      console.error('Store Check Phone Error:', error);
      set({ errorMessage: '전화번호 확인 중 오류가 발생했습니다.' });
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },

  /* 4. 입실 비밀번호 검증 (키오스크용) */
  verifyEntryPassword: async (phoneNumber, password) => {
    set({ isLoading: true, errorMessage: '' });
    try {
      const result = await verifyEntryPassword(phoneNumber, password);

      if (!result.success) {
        throw new Error(result.message);
      }

      return { success: true, user: result.data };
    } catch (error) {
      console.error('Store Verify Password Error:', error);
      set({ errorMessage: '비밀번호가 일치하지 않거나 오류가 발생했습니다.' });
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },

  /* 초기화 */
  clearUserData: () => {
    set({
      userProfile: null,
      errorMessage: '',
    });
  },
}));
