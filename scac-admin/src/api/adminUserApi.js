import axiosInstance from './axiosInstance';

/* 전체 사용자 목록 조회 */
export const getAdminUsers = async () => {
  const response = await axiosInstance.get('/admin/users');

  return response.data;
};

/* 특정 사용자 상세 조회 */
export const getAdminUserById = async (userId) => {
  const response = await axiosInstance.get(`/admin/users/${userId}`);

  return response.data;
};

/* 사용자 상태 변경 */
export const updateAdminUserStatus = async (userId, statusData) => {
  const response = await axiosInstance.patch(
    `/admin/users/${userId}/status`,
    statusData,
  );

  return response.data;
};

/* 사용자 권한 변경 */
export const updateAdminUserRole = async (userId, roleData) => {
  const response = await axiosInstance.patch(
    `/admin/users/${userId}/role`,
    roleData,
  );

  return response.data;
};
