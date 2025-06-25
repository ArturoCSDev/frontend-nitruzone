import { Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const ProtectedRoutes = () => {
  // Aquí puedes agregar tu lógica de autenticación
  const isAuthenticated = true; // Reemplazar con tu lógica real

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};
