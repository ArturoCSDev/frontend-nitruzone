// src/features/admin/pages/ListClients.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Users, UserCheck, UserX, Plus, MoreHorizontal, Edit, Trash2, 
  Activity, FileText, Loader2, Bot, FileBarChart 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useListClients } from '@/features/auth/hooks/useListClients';
import { useGetActivePlanByCliente } from '@/features/nutrition-plans/hooks/useGetPlanByCliente';
import { useCreatePlan } from '@/features/nutrition-plans/hooks/useCreatePlan';
import { UserClientItem } from '@/features/auth/types/auth-api.types';
import { CreatePlanNutricionalRequest } from '@/features/nutrition-plans/types/nutrition-plans-api.types';

export default function ListClients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [onlyActive, setOnlyActive] = useState<boolean | undefined>(undefined);
  const [onlyCompleteProfiles, setOnlyCompleteProfiles] = useState<boolean | undefined>(undefined);
  
  // Estados para el diálogo de plan
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<UserClientItem | null>(null);

  const { data, isLoading, error } = useListClients({
    search: search || undefined,
    onlyActive,
    onlyCompleteProfiles,
  });

  // Hook para obtener plan activo del cliente seleccionado
  const { 
    data: activePlan, 
    isLoading: isLoadingPlan, 
    refetch: refetchPlan 
  } = useGetActivePlanByCliente(selectedClient?.cliente.id || '');

  // Hook para crear plan
  const createPlan = useCreatePlan();

  const handleEdit = (client: UserClientItem) => {
    console.log('Editar cliente:', client);
    // TODO: Implementar navegación a edición
  };

  const handleDelete = (client: UserClientItem) => {
    console.log('Eliminar cliente:', client);
    // TODO: Implementar confirmación y eliminación
  };

  const handleViewSeguimiento = (client: UserClientItem) => {
    // Usar el ID de la tabla cliente, no del usuario
    navigate(`/panel/clients/${client.cliente.id}/seguimiento`);
  };

  const handleViewPlan = (client: UserClientItem) => {
    setSelectedClient(client);
    setPlanDialogOpen(true);
  };

  // ✅ NUEVA FUNCIÓN: Navegar a Asesoría Completa
  const handleViewAsesoria = (client: UserClientItem) => {
    navigate(`/panel/clients/${client.cliente.id}/asesoria-completa`);
  };

  // ✅ NUEVA FUNCIÓN: Navegar a Recomendaciones IA
  const handleGenerateRecommendations = (client: UserClientItem) => {
    navigate(`/panel/clients/${client.cliente.id}/recomendaciones-ia`);
  };

  const handleCreatePlan = () => {
    if (!selectedClient) return;

    // Datos básicos para crear un plan estándar
    const planData: CreatePlanNutricionalRequest = {
      clienteId: selectedClient.cliente.id,
      objetivo: 'MANTENIMIENTO', // Objetivo por defecto
      duracionDias: 30,
      fechaInicio: new Date().toISOString().split('T')[0],
    };

    createPlan.mutate(planData, {
      onSuccess: () => {
        refetchPlan(); // Refrescar el plan después de crear
      }
    });
  };

  const handleViewPlanDetails = () => {
    if (activePlan && selectedClient) {
      setPlanDialogOpen(false);
      // Navegar a la página de detalles del plan
      navigate(`/panel/clients/${selectedClient.cliente.id}/plan/${activePlan.id}`);
    }
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar los clientes</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Intentar nuevamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona y visualiza todos los clientes registrados
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => navigate('/panel/register-client')}
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary.totalActive || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary.totalInactive || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfiles Completos</CardTitle>
            <Filter className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary.totalCompleteProfiles || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o DNI..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={onlyActive === true ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlyActive(onlyActive === true ? undefined : true)}
              >
                Solo Activos
              </Button>
              <Button
                variant={onlyCompleteProfiles === true ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlyCompleteProfiles(onlyCompleteProfiles === true ? undefined : true)}
              >
                Perfil Completo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Contacto</th>
                  <th className="text-left p-4 font-medium">Perfil</th>
                  <th className="text-left p-4 font-medium">IMC</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data?.users.map((client) => {
                  const imcStatus = getIMCStatus(client.cliente.imc);
                  return (
                    <tr key={client.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {getInitials(client.nombreCompleto)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.nombreCompleto}</p>
                            <p className="text-sm text-muted-foreground">DNI: {client.dni}</p>
                            <p className="text-xs text-muted-foreground">ID Cliente: {client.cliente.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm">{client.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.cliente.telefono || 'Sin teléfono'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={client.cliente.hasCompleteProfile ? "default" : "secondary"}>
                          {client.cliente.hasCompleteProfile ? 'Completo' : 'Incompleto'}
                        </Badge>
                        {client.cliente.edad && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {client.cliente.edad} años • {client.cliente.genero || 'N/A'}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant={imcStatus.variant}>
                          {client.cliente.imc ? client.cliente.imc.toFixed(1) : 'N/A'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {imcStatus.label}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge variant={client.active ? "default" : "secondary"}>
                          {client.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(client.fechaCreacion).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          {/* ✅ MENÚ ACTUALIZADO CON NUEVAS OPCIONES */}
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {/* Asesoría Completa - Nueva opción principal */}
                            <DropdownMenuItem onClick={() => handleViewAsesoria(client)}>
                              <FileBarChart className="h-4 w-4 mr-2" />
                              Asesoría Completa
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            {/* Opciones existentes */}
                            <DropdownMenuItem onClick={() => handleViewPlan(client)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Ver Plan
                            </DropdownMenuItem>
                            
                            {/* Recomendaciones IA - Nueva opción */}
                            <DropdownMenuItem onClick={() => handleGenerateRecommendations(client)}>
                              <Bot className="h-4 w-4 mr-2" />
                              Generar Recomendaciones IA
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => handleViewSeguimiento(client)}>
                              <Activity className="h-4 w-4 mr-2" />
                              Ver Seguimiento
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => handleEdit(client)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(client)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {(!data?.users || data.users.length === 0) && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay clientes</h3>
              <p className="text-muted-foreground">
                {search ? 'No se encontraron clientes con los filtros aplicados.' : 'Comienza registrando tu primer cliente.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Plan Nutricional - Sin cambios */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Plan Nutricional - {selectedClient?.nombreCompleto}
            </DialogTitle>
            <DialogDescription>
              Gestiona el plan nutricional del cliente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Información del Cliente */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{selectedClient?.nombreCompleto}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DNI</p>
                <p className="font-medium">{selectedClient?.dni}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedClient?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Perfil</p>
                <Badge variant={selectedClient?.cliente.hasCompleteProfile ? "default" : "secondary"}>
                  {selectedClient?.cliente.hasCompleteProfile ? 'Completo' : 'Incompleto'}
                </Badge>
              </div>
            </div>

            {/* Estado del Plan */}
            {isLoadingPlan ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Verificando plan nutricional...</p>
              </div>
            ) : activePlan ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 text-green-800 mb-3">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Plan Nutricional Activo</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-600 font-medium">Nombre del Plan</p>
                      <p className="text-green-800">{activePlan.nombre}</p>
                    </div>
                    <div>
                      <p className="text-green-600 font-medium">Objetivo</p>
                      <p className="text-green-800">{activePlan.objetivo}</p>
                    </div>
                    <div>
                      <p className="text-green-600 font-medium">Fecha de Inicio</p>
                      <p className="text-green-800">
                        {new Date(activePlan.fechaInicio).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <p className="text-green-600 font-medium">Progreso</p>
                      <p className="text-green-800">{activePlan.progreso}%</p>
                    </div>
                  </div>

                  {activePlan.resumenRecomendaciones && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-green-600 font-medium mb-2">Recomendaciones</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-800">
                          Total: {activePlan.resumenRecomendaciones.total}
                        </span>
                        <span className="text-green-800">
                          Pendientes: {activePlan.resumenRecomendaciones.pendientes}
                        </span>
                        <span className="text-green-800">
                          Aceptadas: {activePlan.resumenRecomendaciones.aceptadas}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleViewPlanDetails} className="flex-1">
                    Ver Detalles del Plan
                  </Button>
                  <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                  <div className="flex items-center gap-2 text-amber-800 mb-3">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Sin Plan Nutricional</span>
                  </div>
                  
                  <p className="text-amber-700 text-sm mb-4">
                    Este cliente no tiene un plan nutricional activo. Puedes crear uno nuevo 
                    con configuraciones básicas o personalizadas.
                  </p>

                  {!selectedClient?.cliente.hasCompleteProfile && (
                    <div className="p-3 bg-amber-100 border border-amber-300 rounded text-sm text-amber-800 mb-4">
                      <p className="font-medium">⚠️ Perfil Incompleto</p>
                      <p>Para un plan más personalizado, considera completar el perfil del cliente 
                         con información como edad, peso, altura y objetivos.</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreatePlan} 
                    disabled={createPlan.isPending}
                    className="flex-1"
                  >
                    {createPlan.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando Plan...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Plan Básico
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}