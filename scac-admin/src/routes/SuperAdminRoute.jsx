import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function SuperAdminRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== 'SUPER_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}
