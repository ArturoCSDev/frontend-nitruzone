import { RegisterClientForm } from '../components/register-client/RegisterClientForm';

export default function RegisterClient() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Registrar Nuevo Cliente
        </h1>
        <p className="text-muted-foreground">
          Crea una nueva cuenta de cliente en el sistema. La información física es opcional 
          y puede completarse posteriormente.
        </p>
      </div>

      {/* Form */}
      <RegisterClientForm />
    </div>
  );
}