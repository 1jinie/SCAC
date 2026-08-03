import { create } from "zustand";
import {
  getAdminUsers,
  getAdminUserById,
  updateAdminUserPenalty,
} from "../api/adminUserApi";

export const useAdminUserStore = create((set, get) => ({
  users: [], // 💡 정적 데이터 제거 및 빈 배열 초기화
  selectedUser: null,

  isLoading: false,
  isUpdating: false,
  errorMessage: "",

  /* 전체 사용자 목록 조회 */
  fetchUsers: async () => {
    set({ isLoading: true, errorMessage: "" });

    try {
      const data = await getAdminUsers();
      set({ users: data });
      return { success: true, data };
    } catch (error) {
      console.error("Admin User List Error:", error);
      set({ errorMessage: "사용자 목록을 불러오지 못했습니다." });
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },

  /* 목록에서 사용자 선택 */
  selectUser: (user) => {
    set({
      selectedUser: user,
      errorMessage: "",
    });
  },

  /* 사용자 상세 정보 조회 */
  fetchUserDetail: async (userId) => {
    set({
      isLoading: true,
      errorMessage: "",
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
      console.error("Admin User Detail Error:", error);

      set({
        errorMessage: "사용자 상세 정보를 불러오지 못했습니다.",
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

  /* 사용자 제재/상태 변경 (통합 처리) */
  changeUserStatus: async (
    userId,
    userStatus,
    penaltyEndDate = null,
    reason = "관리자 제재 처리",
  ) => {
    set({ isUpdating: true, errorMessage: "" });

    try {
      const penaltyReq = {
        userStatus,
        penaltyType: userStatus === "SUSPENDED" ? "ACCOUNT_SUSPEND" : "NONE",
        reason,
        penaltyEndDate: userStatus === "SUSPENDED" ? penaltyEndDate : null,
      };

      await updateAdminUserPenalty(userId, penaltyReq);

      // 로컬 스토리지/상태 즉시 반영
      set((state) => ({
        users: state.users.map((user) =>
          user.userId === userId
            ? { ...user, userStatus, penaltyEndDate }
            : user,
        ),
        selectedUser:
          state.selectedUser?.userId === userId
            ? { ...state.selectedUser, userStatus, penaltyEndDate }
            : state.selectedUser,
      }));

      return { success: true };
    } catch (error) {
      console.error("Admin User Penalty Update Error:", error);
      set({ errorMessage: "회원 제재 상태 변경에 실패했습니다." });
      return { success: false, error };
    } finally {
      set({ isUpdating: false });
    }
  },

  clearSelectedUser: () => set({ selectedUser: null, errorMessage: "" }),
  clearErrorMessage: () => set({ errorMessage: "" }),
  resetAdminUserStore: () =>
    set({
      users: [],
      selectedUser: null,
      isLoading: false,
      isUpdating: false,
      errorMessage: "",
    }),
}));
