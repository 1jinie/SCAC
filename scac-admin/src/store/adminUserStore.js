import { create } from 'zustand';
import {
  getAdminUsers,
  getAdminUserById,
  updateAdminUserStatus,
  updateAdminUserRole,
} from '../api/adminUserApi';
import adminUserData from '../data/adminUserData.json';

export const useAdminUserStore = create((set, get) => ({
  // users: [],
  users: adminUserData, // 임시 데이터로 초기화 나중에 지워주세요
  selectedUser: null,

  isLoading: false,
  isUpdating: false,
  errorMessage: '',

  /* 전체 사용자 목록 조회 */
  fetchUsers: async () => {
    set({
      isLoading: true,
      errorMessage: '',
    });

    try {
      const data = await getAdminUsers();

      set({
        users: data,
      });

      return {
        success: true,
        data,
      };
    } catch (error) {
      // 나중에 api 연결 후 주석 해제해주세요
      // console.error('Admin User List Error:', error);

      // set({
      //   errorMessage: '사용자 목록을 불러오지 못했습니다.',
      // });

      return {
        success: false,
        error,
      };
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  /* 목록에서 사용자 선택 */
  selectUser: (user) => {
    set({
      selectedUser: user,
      errorMessage: '',
    });
  },

  /* 사용자 상세 정보 조회 */
  fetchUserDetail: async (userId) => {
    set({
      isLoading: true,
      errorMessage: '',
    });

    try {
      const data = await getAdminUserById(userId);

      set((state) => ({
        selectedUser: data,

        users: state.users.map((user) =>
          user.userId === data.userId
            ? {
                ...user,
                ...data,
              }
            : user,
        ),
      }));

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Admin User Detail Error:', error);

      set({
        errorMessage: '사용자 상세 정보를 불러오지 못했습니다.',
      });

      return {
        success: false,
        error,
      };
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  /* 사용자 상태 변경 */
  changeUserStatus: async (userId, userStatus, penaltyEndDate = null) => {
    set({
      isUpdating: true,
      errorMessage: '',
    });

    try {
      const requestData = {
        userStatus,
        penaltyEndDate: userStatus === 'SUSPENDED' ? penaltyEndDate : null,
      };

      const responseData = await updateAdminUserStatus(userId, requestData);

      /*
       * 서버가 수정된 전체 사용자 객체를 반환한다면 responseData 사용.
       * 반환하지 않는다면 requestData를 사용.
       */
      const updatedData = {
        ...requestData,
        ...responseData,
      };

      set((state) => ({
        users: state.users.map((user) =>
          user.userId === userId
            ? {
                ...user,
                ...updatedData,
              }
            : user,
        ),

        selectedUser:
          state.selectedUser?.userId === userId
            ? {
                ...state.selectedUser,
                ...updatedData,
              }
            : state.selectedUser,
      }));

      return {
        success: true,
        data: updatedData,
      };
    } catch (error) {
      console.error('Admin User Status Update Error:', error);

      set({
        errorMessage: '사용자 상태 변경에 실패했습니다.',
      });

      return {
        success: false,
        error,
      };
    } finally {
      set({
        isUpdating: false,
      });
    }
  },

  /* 사용자 권한 변경 */
  changeUserRole: async (userId, role) => {
    set({
      isUpdating: true,
      errorMessage: '',
    });

    try {
      const responseData = await updateAdminUserRole(userId, {
        role,
      });

      const updatedData = {
        role,
        ...responseData,
      };

      set((state) => ({
        users: state.users.map((user) =>
          user.userId === userId
            ? {
                ...user,
                ...updatedData,
              }
            : user,
        ),

        selectedUser:
          state.selectedUser?.userId === userId
            ? {
                ...state.selectedUser,
                ...updatedData,
              }
            : state.selectedUser,
      }));

      return {
        success: true,
        data: updatedData,
      };
    } catch (error) {
      console.error('Admin User Role Update Error:', error);

      set({
        errorMessage: '사용자 권한 변경에 실패했습니다.',
      });

      return {
        success: false,
        error,
      };
    } finally {
      set({
        isUpdating: false,
      });
    }
  },

  clearSelectedUser: () => {
    set({
      selectedUser: null,
      errorMessage: '',
    });
  },

  clearErrorMessage: () => {
    set({
      errorMessage: '',
    });
  },

  resetAdminUserStore: () => {
    set({
      users: [],
      selectedUser: null,
      isLoading: false,
      isUpdating: false,
      errorMessage: '',
    });
  },
}));
