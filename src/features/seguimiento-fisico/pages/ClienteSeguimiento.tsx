// src/features/seguimiento-fisico/pages/ClienteSeguimiento.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Activity, 
  User, 
  Calendar, 
  Mail, 
  Phone,
  Scale,
  Target,
  TrendingUp,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Components
import { ControlsStats } from '../components/controls/ControlsStats';
import { ControlsFilters } from '../components/controls/ControlsFilters';
import { ControlsTable } from '../components/controls/ControlsTable';
import { CreateControlDialog } from '../components/dialogs/CreateControlDialog';
import { EditControlDialog } from '../components/dialogs/EditControlDialog';
import { ViewControlDialog } from '../components/dialogs/ViewControlDialog';
import { DeleteControlDialog } from '../components/dialogs/DeleteControlDialog';
import ControlFisicoCharts from '../components/charts/ControlFisicoCharts';
import ControlStatisticsPanel from '../components/statistics/ControlStatisticsPanel';

// Hooks
import { useControlsByCliente, useControlFisicoDashboard } from '../hooks/useSeguimientoFisico';
import { useClient } from '@/features/auth/hooks/useClients';

// Types
import { ListControlFisicoParams } from '../types/seguimiento-fisico-api.types';

type DialogType = 'create' | 'edit' | 'view' | 'delete';

interface DialogStates {
  create: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
}

interface IMCStatus {
  label: string;
  variant: 'default' | 'secondary' | 'destructive';
  color: string;
}

interface ClientMetric {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  status?: string;
  progress?: number;
}

const ClienteSeguimiento: React.FC = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<ListControlFisicoParams>({
    onlyWithMetrics: false,
    onlyRecent: false,
    realizadoPor: '',
  });
  const [selectedControls, setSelectedControls] = useState<string[]>([]);
  const [dialogStates, setDialogStates] = useState<DialogStates>({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [currentControlId, setCurrentControlId] = useState<string>('');
  const [statisticsDays, setStatisticsDays] = useState<number>(90);
  const [selectedControlForStats, setSelectedControlForStats] = useState<string>('');

  // Hooks
  const { data: cliente, isLoading: isLoadingCliente } = useClient(clienteId || '');
  const { data: controlesData, isLoading: isLoadingControles, error } = useControlsByCliente(clienteId || '', filters);
  
  // Hook para obtener estadísticas del último control
  const lastControlId = controlesData?.controles?.[0]?.id || '';
  const { data: statsData, isLoading: isLoadingStats } = useControlFisicoDashboard(
    selectedControlForStats || lastControlId, 
    statisticsDays
  );

  const controles = controlesData?.controles || [];
  const summary = controlesData?.summary;

  // Handlers
  const handleOpenDialog = (type: DialogType, controlId?: string): void => {
    if (controlId) setCurrentControlId(controlId);
    setDialogStates(prev => ({ ...prev, [type]: true }));
  };

  const handleCloseDialog = (type: DialogType): void => {
    setDialogStates(prev => ({ ...prev, [type]: false }));
    setCurrentControlId('');
  };

  const handleFiltersChange = (newFilters: ListControlFisicoParams): void => {
    setFilters(newFilters);
  };

  const handleSelectControl = (controlId: string, checked: boolean): void => {
    setSelectedControls(prev => 
      checked 
        ? [...prev, controlId]
        : prev.filter(id => id !== controlId)
    );
  };

  const handleSelectAll = (checked: boolean): void => {
    setSelectedControls(checked ? controles.map(c => c.id) : []);
  };

  const handleControlSelect = (controlId: string): void => {
    setSelectedControlForStats(controlId);
  };

  const handleStatisticsDaysChange = (days: string): void => {
    setStatisticsDays(parseInt(days));
  };

  // Utility functions
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getIMCStatus = (imc: number | null): IMCStatus => {
    if (!imc) return { label: 'N/A', variant: 'secondary', color: 'text-gray-500' };
    if (imc < 18.5) return { label: 'Bajo peso', variant: 'destructive', color: 'text-red-600' };
    if (imc < 25) return { label: 'Normal', variant: 'default', color: 'text-green-600' };
    if (imc < 30) return { label: 'Sobrepeso', variant: 'secondary', color: 'text-yellow-600' };
    return { label: 'Obesidad', variant: 'destructive', color: 'text-red-600' };
  };

  const formatControlDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getClientMetrics = (): ClientMetric[] => {
    if (!cliente) return [];
    
    const imcStatus = getIMCStatus(cliente.cliente.imc);
    
    return [
      {
        label: 'Perfil',
        value: cliente.cliente.hasCompleteProfile ? 'Completo' : 'Incompleto',
        icon: User,
        color: cliente.cliente.hasCompleteProfile ? 'text-green-600' : 'text-yellow-600',
        status: cliente.cliente.hasCompleteProfile ? 'success' : 'warning',
        progress: cliente.cliente.hasCompleteProfile ? 100 : 60
      },
      {
        label: 'Peso Actual',
        value: cliente.cliente.peso ? `${cliente.cliente.peso}kg` : 'N/A',
        icon: Scale,
        color: 'text-blue-600',
        status: cliente.cliente.peso ? 'success' : 'empty'
      },
      {
        label: 'IMC',
        value: cliente.cliente.imc ? cliente.cliente.imc.toFixed(1) : 'N/A',
        icon: Target,
        color: imcStatus.color,
        status: imcStatus.label
      },
      {
        label: 'Controles',
        value: controles.length.toString(),
        icon: Activity,
        color: 'text-purple-600',
        status: controles.length > 0 ? 'active' : 'inactive'
      }
    ];
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
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Error or not found
  if (!cliente || !clienteId) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cliente no encontrado. Verifica que el ID sea correcto.
          </AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => navigate('/panel/list-users/client')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  const clientMetrics = getClientMetrics();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
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
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-xl font-semibold">
                  {getInitials(cliente.nombreCompleto)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <Badge variant={cliente.active ? "default" : "secondary"} className="text-xs">
                  {cliente.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{cliente.nombreCompleto}</h1>
              <p className="text-muted-foreground">Seguimiento físico y controles</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>DNI: {cliente.dni}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{cliente.cliente.edad ? `${cliente.cliente.edad} años` : 'Edad no registrada'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{cliente.email}</span>
                </div>
                {cliente.cliente.telefono && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{cliente.cliente.telefono}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Button onClick={() => handleOpenDialog('create')} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Control
        </Button>
      </div>

      {/* Client Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clientMetrics.map((metric, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.status && (
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {metric.status}
                  </Badge>
                  {metric.progress && (
                    <span className="text-xs text-muted-foreground">
                      {metric.progress}%
                    </span>
                  )}
                </div>
              )}
              {metric.progress && (
                <Progress value={metric.progress} className="h-1" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="controls" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="controls" className="gap-2">
            <FileText className="w-4 h-4" />
            Controles
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Análisis
          </TabsTrigger>
          <TabsTrigger value="charts" className="gap-2">
            <Activity className="w-4 h-4" />
            Gráficas
          </TabsTrigger>
        </TabsList>

        {/* Tab: Controles */}
        <TabsContent value="controls" className="space-y-4">
          <ControlsStats 
            controles={controles}
            summary={summary}
            isLoading={isLoadingControles}
          />

          <ControlsFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          <ControlsTable 
            controles={controles}
            selectedControls={selectedControls}
            onSelectControl={handleSelectControl}
            onSelectAll={handleSelectAll}
            onOpenDialog={handleOpenDialog}
            isLoading={isLoadingControles}
            error={error}
          />
        </TabsContent>

        {/* Tab: Análisis */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Control a analizar:</label>
                <Select 
                  value={selectedControlForStats || lastControlId} 
                  onValueChange={handleControlSelect}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Seleccionar control" />
                  </SelectTrigger>
                  <SelectContent>
                    {controles.map((control) => (
                      <SelectItem key={control.id} value={control.id}>
                        {formatControlDate(control.fechaControl)} - {control.peso ? `${control.peso}kg` : 'Sin peso'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Período:</label>
                <Select value={statisticsDays.toString()} onValueChange={handleStatisticsDaysChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 días</SelectItem>
                    <SelectItem value="60">60 días</SelectItem>
                    <SelectItem value="90">90 días</SelectItem>
                    <SelectItem value="180">6 meses</SelectItem>
                    <SelectItem value="365">1 año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <Clock className="w-3 h-3" />
              Última actualización: {statsData ? 'Ahora' : 'Cargando...'}
            </Badge>
          </div>

          {statsData && (
            <ControlStatisticsPanel
              statistics={statsData.statistics!}
              trends={statsData.trends}
              progressSummary={statsData.progressSummary}
              insights={statsData.insights}
              correlations={statsData.correlations}
              isLoading={isLoadingStats}
            />
          )}
        </TabsContent>

        {/* Tab: Gráficas */}
        <TabsContent value="charts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Control base:</label>
                <Select 
                  value={selectedControlForStats || lastControlId} 
                  onValueChange={handleControlSelect}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Seleccionar control" />
                  </SelectTrigger>
                  <SelectContent>
                    {controles.map((control) => (
                      <SelectItem key={control.id} value={control.id}>
                        {formatControlDate(control.fechaControl)} - {control.peso ? `${control.peso}kg` : 'Sin peso'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Período:</label>
                <Select value={statisticsDays.toString()} onValueChange={handleStatisticsDaysChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 días</SelectItem>
                    <SelectItem value="60">60 días</SelectItem>
                    <SelectItem value="90">90 días</SelectItem>
                    <SelectItem value="180">6 meses</SelectItem>
                    <SelectItem value="365">1 año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <Activity className="w-3 h-3" />
              {controles.length} controles disponibles
            </Badge>
          </div>

          {statsData?.chartData ? (
            <ControlFisicoCharts
              chartData={statsData.chartData}
              trends={statsData.trends}
              statistics={statsData.statistics}
              isLoading={isLoadingStats}
            />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay datos suficientes para mostrar gráficas. Se necesitan al menos 2 controles para generar visualizaciones.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

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