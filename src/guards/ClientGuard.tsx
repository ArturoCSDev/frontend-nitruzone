import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/auth.store';

interface ClientGuardProps {
  children: React.ReactNode;
}

export const ClientGuard = ({ children }: ClientGuardProps) => {
  const { isAuthenticated, isClient } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isClient()) {
    return <Navigate to="/panel" replace />;
  }

  return <>{children}</>;
};
