import { Navigate } from "react-router-dom";

export default function AdminPrivateRoute({ children }) {
  // TODO
  // 로그인 성공 시 adminAccessToken 저장
  const accessToken = localStorage.getItem("adminAccessToken");

  // TODO
  // accessToken 만료 여부 검사
  // JWT 만료 확인
  // 만료 시 refresh API 호출
  // refresh 성공 -> 새 accessToken 저장
  // refresh 실패 -> 로그인 페이지 이동

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
