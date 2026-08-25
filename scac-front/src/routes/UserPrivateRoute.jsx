import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { postRefreshToken } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

/**
 * 순수 JS 기반 JWT 토큰 만료 여부 체킹
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

    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};

export default function UserPrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

      // 1. 토큰이 없거나 사용자 정보가 없는 경우 접근 거부
      if (!accessToken || !userInfo?.userId) {
        setIsAuthenticated(false);
        return;
      }

      // 2. Access Token이 유효한 경우 통과
      if (!isTokenExpired(accessToken)) {
        setIsAuthenticated(true);
        return;
      }

      // 3. Access Token이 만료된 경우 사용자 전용 Refresh API 호출
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const res = await postRefreshToken(refreshToken);
          if (res.isSuccess && res.data) {
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = res.data;

            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            useAuthStore.setState({
              accessToken: newAccessToken,
              isAuthenticated: true,
            });

            setIsAuthenticated(true);
            return;
          }
        } catch (error) {
          console.error('사용자 토큰 재발급 연동 실패:', error);
        }
      }

      // 4. 재발급 실패 시 스토리지 및 전역 상태 비우고 로그인 페이지로 이동
      localStorage.clear();
      useAuthStore.setState({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });
      setIsAuthenticated(false);
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return null; // 인증 확인 중 깜빡임 방지
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
