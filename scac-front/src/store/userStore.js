import { create } from 'zustand';
import { users as mockUsers } from '../data/User';

export const useUserStore = create((set, get) => ({
  userProfile: null, // 마이페이지에 표시할 유저 상세 정보 객체
  searchResult: null, // 관리자가 전화번호로 검색한 유저 정보
  isLoading: false, // 로딩 상태 변수
  errorMessage: '', // 에러 메시지 보관 변수

  /* 내 프로필 정보 조회 (마이페이지용) */
  getUserProfile: async (memberId) => {
    set({ isLoading: true, errorMessage: '' });
    try {
      const user = mockUsers.find((item) => item.id === memberId);
      if (!user) {
        throw new Error('회원 정보를 찾을 수 없습니다.');
      }

      set({
        userProfile: {
          ...user,
          phoneNumber: user.phone,
        },
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
      const userIndex = mockUsers.findIndex((item) => item.id === memberId);
      if (userIndex < 0) {
        throw new Error('회원 정보를 찾을 수 없습니다.');
      }

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updatedData,
      };

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
      const user = mockUsers.find((item) => item.phone === phoneNumber);
      if (!user) {
        throw new Error('존재하지 않는 회원 번호입니다.');
      }
      set({ searchResult: user });
      return { success: true, data: user };
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
