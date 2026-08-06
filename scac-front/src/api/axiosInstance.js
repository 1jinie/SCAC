import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8888';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 1. Request Interceptor: Access Token 자동 첨부 */
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* 2. Response Interceptor: 401 발생 시 관리자/사용자 구분하여 자동 재발급 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // 관리자 API 요청인지 확인하여 재발급 엔드포인트 분기 처리
          const isAdminRequest = originalRequest.url?.includes('/api/admin');
          const refreshEndpoint = isAdminRequest
            ? '/api/admin/auth/refresh'
            : '/api/auth/refresh';

          const response = await axios.post(`${API_URL}${refreshEndpoint}`, {
            refreshToken,
          });

          if (response.data?.isSuccess && response.data?.data) {
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = response.data.data;

            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('토큰 재발급 실패:', refreshError);
          localStorage.clear();
          const isAdminRequest = originalRequest.url?.includes('/api/admin');
          window.location.href = isAdminRequest ? '/admin/login' : '/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.clear();
        const isAdminRequest = originalRequest.url?.includes('/api/admin');
        window.location.href = isAdminRequest ? '/admin/login' : '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
