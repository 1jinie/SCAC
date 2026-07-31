import axios from 'axios';

// 백엔드 서버 주소 (스프링 부트 포트에 맞게 확인해주세요)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8888';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 1. Request Interceptor: 모든 요청에 Access Token 자동 첨부[cite: 38] */
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/* 2. Response Interceptor: 401 발생 시 Refresh Token으로 자동 재발급 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // HTTP Status 401 에러이고, 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      // Refresh Token이 존재할 때 재발급 시도
      if (refreshToken) {
        try {
          // 백엔드 /api/auth/refresh 호출[cite: 1, 28]
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken,
          });

          // 백엔드의 ApiResponse 구조 확인 (isSuccess: true)[cite: 30, 36]
          if (response.data?.isSuccess && response.data?.data) {
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = response.data.data;

            // 로컬 스토리지에 새 토큰 저장[cite: 30]
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // 실패했던 이전 요청의 Authorization 헤더 교체 후 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh Token도 만료되었거나 유효하지 않은 경우 -> 강제 로그아웃
          console.error('토큰 재발급 실패:', refreshError);
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Refresh Token이 아예 없는 경우 -> 로그인 페이지 이동
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
