import { Navigate } from 'react-router-dom';

export default function AdminPrivateRoute({ children }) {
  // 추후 JWT에서 가져올 예정
  const isAdmin = false;

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
