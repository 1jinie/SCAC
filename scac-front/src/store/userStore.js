import { create } from 'zustand';
import {
  getUserProfile,
  updateUserProfile,
  getUserByPhone,
} from '../api/userApi';

export const useUserStore = create((set, get) => ({
  userProfile: null, // 마이페이지에 표시할 유저 상세 정보 객체
  searchResult: null, // 관리자가 전화번호로 검색한 유저 정보
  isLoading: false, // 로딩 상태 변수
  errorMessage: '', // 에러 메시지 보관 변수

  /* 내 프로필 정보 조회 (마이페이지용) */
  getUserProfile: async (memberId) => {
    set({ isLoading: true, errorMessage: '' });
    try {
      const response = await getUserProfile(memberId);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message);
      }

      set({
        userProfile: result.data,
      });
      return { success: true };
    } catch (error) {
      console.error('Store Get Profile Error:', error);
      set({ errorMessage: '프로필 정보를 불러오지 못했습니다.' });
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },
  /* 내 프로필 정보 조회 (마이페이지 수정용) */
  modifyUserProfile: async (memberId, updatedData) => {
    set({ isLoading: true, errorMessage: '' });
    try {
      const response = await updateUserProfile(memberId, updatedData);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message);
      }

      const currentProfile = get().userProfile;
      set({
        userProfile: {
          ...currentProfile,
          ...updatedData,
        },
      });
      return { success: true };
    } catch (error) {
      console.error('Store Modify Profile Error:', error);
      set({ errorMessage: '정보 수정에 실패했습니다.' });
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },

  /* 관리자용 회원 검색 (결제 취소/좌석 제어) */
  searchUserByPhone: async (phoneNumber) => {
    set({ isLoading: true, errorMessage: '', searchResult: null });
    try {
      const response = await getUserByPhone(phoneNumber);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message);
      }

      set({ searchResult: result.data });
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Store Search User Error:', error);
      set({ errorMessage: '존재하지 않는 회원 번호입니다.' });
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },

  /* 초기화 (로그아웃 시 유저 정보 제거) */
  clearUserData: () => {
    set({
      userProfile: null,
      searchResult: null,
      errorMessage: '',
    });
  },
}));
