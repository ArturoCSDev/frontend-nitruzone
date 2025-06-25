import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/auth.store';
import { useLogout } from '../features/auth/hooks/useLogout';

export const AdminLayout = () => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Panel Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hola, {user?.nombreCompleto}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/panel/register-client"
                  className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Registrar Cliente
                </Link>
              </li>
              <li>
                <Link 
                  to="/panel/register-admin"
                  className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Registrar Admin
                </Link>
              </li>
              <li>
                <Link 
                  to="/panel/list-users/client"
                  className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Lista Clientes
                </Link>
              </li>
              <li>
                <Link 
                  to="/panel/list-users/admin"
                  className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Lista Admins
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};