// src/features/seguimiento-fisico/pages/SeguimientoFisico.tsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';

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

// Types
import { ListControlFisicoParams } from '../types/seguimiento-fisico-api.types';

const SeguimientoFisico = () => {
  const [selectedClienteId, setSelectedClienteId] = useState<string>('client-123'); // TODO: Get from auth/context
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
  const { data: controlesData, isLoading, error } = useControlsByCliente(selectedClienteId, filters);

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Seguimiento Físico</h1>
          <p className="text-muted-foreground">Gestiona y analiza los controles físicos de los clientes</p>
        </div>
        <Button onClick={() => handleOpenDialog('create')}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Control
        </Button>
      </div>

      {/* Stats Cards */}
      <ControlsStats 
        controles={controles}
        summary={summary}
        isLoading={isLoading}
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
        isLoading={isLoading}
        error={error}
      />

      {/* Dialogs */}
      <CreateControlDialog 
        open={dialogStates.create}
        onOpenChange={() => handleCloseDialog('create')}
        clienteId={selectedClienteId}
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

export default SeguimientoFisico;