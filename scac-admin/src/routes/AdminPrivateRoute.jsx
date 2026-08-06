import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // 경로 확인

/**
 * 순수 JS 기반 JWT 토큰 만료 여부 검사 함수
 */
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;

    // Base64Url 디코딩
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false;

    // 현재 시간(ms)과 exp(s) 비교
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};

export default function AdminPrivateRoute({ children }) {
  // null: 인증 상태 검증 중, true: 인증 성공, false: 인증 실패
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const accessToken = localStorage.getItem('adminAccessToken');
      const refreshToken = localStorage.getItem('adminRefreshToken');

      // 1. Access Token이 아예 없는 경우
      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      // 2. Access Token이 유효한 경우 (만료 안 됨)
      if (!isTokenExpired(accessToken)) {
        setIsAuthenticated(true);
        return;
      }

      // 3. Access Token이 만료되었으나 Refresh Token이 존재하는 경우 -> 재발급 시도
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          // 백엔드 관리자 토큰 재발급 API 호출 (/api/admin/auth/refresh)
          const response = await axiosInstance.post('/api/admin/auth/refresh', {
            refreshToken,
          });

          // ApiResponse 구조 확인 (isSuccess: true)
          if (response.data?.isSuccess && response.data?.data) {
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = response.data.data;

            // 로컬 스토리지에 새 토큰 저장
            localStorage.setItem('adminAccessToken', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('adminRefreshToken', newRefreshToken);
            }

            setIsAuthenticated(true);
            return;
          }
        } catch (error) {
          console.error('관리자 토큰 재발급 실패:', error);
        }
      }

      // 4. 토큰 재발급 실패 또는 Refresh Token도 만료된 경우 -> 토큰 삭제 후 로그인 이동
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
      setIsAuthenticated(false);
    };

    verifyAuth();
  }, []);

  // 인증 검증 진행 중일 때는 화면 튕김(Flickering) 방지
  if (isAuthenticated === null) {
    return null;
  }

  // 인증 실패 시 관리자 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
