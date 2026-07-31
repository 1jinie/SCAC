import axiosInstance from "./axiosInstance.js";

export const adminApi = {
  login: (data) => axiosInstance.post("/api/admin/auth/login", data),

  //refresh () 작성 예정

  logout: () => axiosInstance.post("/api/admin/auth/logout"),

  getDashboardSummary: () => axiosInstance.get("/api/admin/dashboard"),

  getAdminProfile: () => axiosInstance.get("/api/admin/profile"),
};
