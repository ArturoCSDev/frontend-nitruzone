// src/features/admin/pages/RegisterAdmin.tsx
import { RegisterAdminForm } from '../components/register-admin/RegisterAdminForm';

export default function RegisterAdmin() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Registrar Nuevo Administrador
        </h1>
        <p className="text-muted-foreground">
          Crea una nueva cuenta de administrador en el sistema. Configura los permisos 
          y departamento según las responsabilidades del usuario.
        </p>
      </div>

      {/* Form */}
      <RegisterAdminForm />
    </div>
  );
}