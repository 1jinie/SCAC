import axiosInstance from "./axiosInstance.js";

export const adminApi = {
  login: async (data) => {
    const response = await axiosInstance.post("/api/admin/auth/login", data);
    return response.data; // 로그인 응답은 토큰 저장을 위해 ApiResponse 전체 전달
  },

  //refresh () 작성 예정

  logout: async () => {
    const response = await axiosInstance.post("/api/admin/auth/logout");
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await axiosInstance.get("/api/admin/dashboard");
    return response.data.data; // 💡 .data.data로 대시보드 DTO(DashboardRes) 객체 직접 리턴
  },

  getAdminProfile: () => axiosInstance.get("/api/admin/profile"),
};
