// src/features/seguimiento-fisico/pages/ClienteSeguimiento.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Activity, User, Calendar } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Components
import { ControlsStats } from '../components/controls/ControlsStats';
import { ControlsFilters } from '../components/controls/ControlsFilters';
import { ControlsTable } from '../components/controls/ControlsTable';
import { CreateControlDialog } from '../components/dialogs/CreateControlDialog';
import { EditControlDialog } from '../components/dialogs/EditControlDialog';
import { ViewControlDialog } from '../components/dialogs/ViewControlDialog';
import { DeleteControlDialog } from '../components/dialogs/DeleteControlDialog';

// Hooks
import { useControlsByCliente } from '../hooks/useSeguimientoFisico';
import { useClient } from '@/features/auth/hooks/useClients';

// Types
import { ListControlFisicoParams } from '../types/seguimiento-fisico-api.types';

const ClienteSeguimiento = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<ListControlFisicoParams>({
    onlyWithMetrics: false,
    onlyRecent: false,
    realizadoPor: '',
  });
  const [selectedControls, setSelectedControls] = useState<string[]>([]);
  const [dialogStates, setDialogStates] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [currentControlId, setCurrentControlId] = useState<string>('');

  // Hooks
  const { data: cliente, isLoading: isLoadingCliente } = useClient(clienteId || '');
  const { data: controlesData, isLoading: isLoadingControles, error } = useControlsByCliente(clienteId || '', filters);

  const controles = controlesData?.controles || [];
  const summary = controlesData?.summary;

  // Handlers
  const handleOpenDialog = (type: keyof typeof dialogStates, controlId?: string) => {
    if (controlId) setCurrentControlId(controlId);
    setDialogStates(prev => ({ ...prev, [type]: true }));
  };

  const handleCloseDialog = (type: keyof typeof dialogStates) => {
    setDialogStates(prev => ({ ...prev, [type]: false }));
    setCurrentControlId('');
  };

  const handleFiltersChange = (newFilters: ListControlFisicoParams) => {
    setFilters(newFilters);
  };

  const handleSelectControl = (controlId: string, checked: boolean) => {
    setSelectedControls(prev => 
      checked 
        ? [...prev, controlId]
        : prev.filter(id => id !== controlId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedControls(checked ? controles.map(c => c.id) : []);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getIMCStatus = (imc: number | null) => {
    if (!imc) return { label: 'N/A', variant: 'secondary' as const };
    if (imc < 18.5) return { label: 'Bajo peso', variant: 'destructive' as const };
    if (imc < 25) return { label: 'Normal', variant: 'default' as const };
    if (imc < 30) return { label: 'Sobrepeso', variant: 'secondary' as const };
    return { label: 'Obesidad', variant: 'destructive' as const };
  };

  // Loading state
  if (isLoadingCliente) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Error or not found
  if (!cliente || !clienteId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Cliente no encontrado</p>
          <Button variant="outline" onClick={() => navigate('/panel/list-users/client')}>
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  const imcStatus = getIMCStatus(cliente.cliente.imc);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/panel/list-users/client')}
            className="mt-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">
                {getInitials(cliente.nombreCompleto)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{cliente.nombreCompleto}</h1>
              <p className="text-muted-foreground">Seguimiento físico y controles</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  DNI: {cliente.dni}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {cliente.cliente.edad ? `${cliente.cliente.edad} años` : 'Edad no registrada'}
                </span>
                <Badge variant={cliente.active ? "default" : "secondary"}>
                  {cliente.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog('create')}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Control
        </Button>
      </div>

      {/* Cliente Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={cliente.cliente.hasCompleteProfile ? "default" : "secondary"}>
                {cliente.cliente.hasCompleteProfile ? 'Completo' : 'Incompleto'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Estado del perfil
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cliente.cliente.peso ? `${cliente.cliente.peso}kg` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Peso actual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IMC</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={imcStatus.variant}>
                {cliente.cliente.imc ? cliente.cliente.imc.toFixed(1) : 'N/A'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {imcStatus.label}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacto</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{cliente.email}</div>
            <p className="text-xs text-muted-foreground">
              {cliente.cliente.telefono || 'Sin teléfono'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <ControlsStats 
        controles={controles}
        summary={summary}
        isLoading={isLoadingControles}
      />

      {/* Filters */}
      <ControlsFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Table */}
      <ControlsTable 
        controles={controles}
        selectedControls={selectedControls}
        onSelectControl={handleSelectControl}
        onSelectAll={handleSelectAll}
        onOpenDialog={handleOpenDialog}
        isLoading={isLoadingControles}
        error={error}
      />

      {/* Dialogs */}
      <CreateControlDialog 
        open={dialogStates.create}
        onOpenChange={() => handleCloseDialog('create')}
        clienteId={clienteId}
        onSuccess={() => handleCloseDialog('create')}
      />

      <EditControlDialog 
        open={dialogStates.edit}
        onOpenChange={() => handleCloseDialog('edit')}
        controlId={currentControlId}
        onSuccess={() => handleCloseDialog('edit')}
      />

      <ViewControlDialog 
        open={dialogStates.view}
        onOpenChange={() => handleCloseDialog('view')}
        controlId={currentControlId}
      />

      <DeleteControlDialog 
        open={dialogStates.delete}
        onOpenChange={() => handleCloseDialog('delete')}
        controlId={currentControlId}
        onSuccess={() => handleCloseDialog('delete')}
      />
    </div>
  );
};

export default ClienteSeguimiento;