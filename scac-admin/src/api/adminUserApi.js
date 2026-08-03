import axiosInstance from "./axiosInstance";

/* 전체 사용자 목록 조회 */
export const getAdminUsers = async () => {
  const response = await axiosInstance.get("/api/admin/users");

  return response.data.data;
};

/* 특정 사용자 상세 조회 */
export const getAdminUserById = async (userId) => {
  const response = await axiosInstance.get(`/api/admin/users/${userId}`);

  return response.data.data;
};

/* 사용자 제재 및 상태 변경 (백엔드 AdminUserController PATCH /penalty와 통일) */
export const updateAdminUserPenalty = async (userId, penaltyData) => {
  // penaltyData 예시: { userStatus: "SUSPENDED", penaltyType: "ACCOUNT_SUSPEND", reason: "소음 유발", penaltyEndDate: "2026-08-10" }
  const response = await axiosInstance.patch(
    `/api/admin/users/${userId}/penalty`,
    penaltyData,
  );
  return response.data.data;
};
