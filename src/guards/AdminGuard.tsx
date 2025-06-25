import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/auth.store';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/club" replace />;
  }

  return <>{children}</>;
};
