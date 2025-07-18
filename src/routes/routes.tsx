// src/routes/routes.tsx - Actualización para incluir la nueva página
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

// Guards
import { AdminGuard } from '../guards/AdminGuard';
import { ClientGuard } from '../guards/ClientGuard';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ClientLayout } from '../layouts/ClientLayout';

// =============================================
// PÁGINAS LAZY
// =============================================

// Públicas
const Home = lazy(() => import('../features/landing/pages/Home'));
const Login = lazy(() => import('../features/auth/pages/Login'));

// Admin Panel
const RegisterClient = lazy(() => import('../features/admin/pages/RegisterClient'));
const RegisterAdmin = lazy(() => import('../features/admin/pages/RegisterAdmin'));
const ListAdmins = lazy(() => import('../features/admin/pages/ListAdmins'));
const ListClients = lazy(() => import('../features/admin/pages/ListClients'));
const ListProducts = lazy(() => import('../features/products/pages/ListProducts'));
const ListSabores = lazy(() => import('../features/products/pages/ListSabores'));
const ClienteSeguimiento = lazy(() => import('../features/seguimiento-fisico/pages/ClienteSeguimiento'));
const PlanNutricionalDetails = lazy(() => import('../features/nutrition-plans/pages/PlanNutricionalDetails'));
const GenerarRecomendacionesMCP = lazy(() => import('../features/nutrition-plans/pages/GenerarRecomendacionesMCP'));
const AsesoriaCompleta = lazy(() => import('../features/nutrition-plans/pages/AsesoriaCompleta'));

// Cliente
const Club = lazy(() => import('../features/client/pages/Club'));

// =============================================
// ROUTER
// =============================================

export const router = createBrowserRouter([
  // =============================================
  // RUTAS PÚBLICAS
  // =============================================
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
    ],
  },

  // =============================================
  // PANEL ADMIN (Protegido)
  // =============================================
  {
    path: '/panel',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { path: 'register-client', element: <RegisterClient /> },
      { path: 'register-admin', element: <RegisterAdmin /> },
      { path: 'list-users/admin', element: <ListAdmins /> },
      { path: 'list-users/client', element: <ListClients /> },
      { path: 'inventory', element: <ListProducts /> },
      { path: 'inventory/sabores', element: <ListSabores /> },
      { path: 'clients/:clienteId/seguimiento', element: <ClienteSeguimiento /> },
      { path: 'clients/:clienteId/plan/:planId', element: <PlanNutricionalDetails /> },
      { path: 'clients/:clienteId/recomendaciones-ia', element: <GenerarRecomendacionesMCP /> },
      { path: 'clients/:clienteId/asesoria-completa', element: <AsesoriaCompleta /> },
    ],
  },

  // =============================================
  // CLIENTE (Protegido)
  // =============================================
  {
    path: '/club',
    element: (
      <ClientGuard>
        <ClientLayout />
      </ClientGuard>
    ),
    children: [
      { path: '', element: <Club /> },
    ],
  },

  // =============================================
  // 404 - Not Found
  // =============================================
  {
    path: '*',
    element: <div>Página no encontrada</div>,
  },
]);
