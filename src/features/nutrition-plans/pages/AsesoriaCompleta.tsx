// src/features/nutrition-plans/pages/AsesoriaCompleta.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Activity, Settings, RefreshCw, Download, Share2, AlertCircle, FileText } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Components
import { AsesoriaOverviewCards } from '../components/asesoria/AsesoriaOverviewCards';
import { PlanActivoSection } from '../components/asesoria/PlanActivoSection';
import { RecomendacionesSection } from '../components/asesoria/RecomendacionesSection';
import { ControlesFisicosSection } from '../components/asesoria/ControlesFisicosSection';
import { AlertasSection } from '../components/asesoria/AlertasSection';

// Hooks
import { useClient } from '@/features/auth/hooks/useClients';
import { useAsesoriaCompletaFull, useAsesoriaLigera, useAsesoriaActual } from '../hooks/useAsesoriaCompleta';

// Types

type AsesoriaMode = 'ligera' | 'actual' | 'completa';

const AsesoriaCompleta = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<AsesoriaMode>('actual');
  const [activeTab, setActiveTab] = useState('overview');
  const [showHistoricas, setShowHistoricas] = useState(false);

  // Hooks condicionales según el modo
  const { data: dataLigera, isLoading: isLoadingLigera, error: errorLigera } = useAsesoriaLigera(clienteId || '');
  
  const { data: dataActual, isLoading: isLoadingActual, error: errorActual } = useAsesoriaActual(clienteId || '');
  
  const { data: dataCompleta, isLoading: isLoadingCompleta, error: errorCompleta } = useAsesoriaCompletaFull(clienteId || '');

  const { data: cliente, isLoading: isLoadingCliente } = useClient(clienteId || '');

  // Seleccionar datos según el modo
  const data = mode === 'ligera' ? dataLigera : mode === 'actual' ? dataActual : dataCompleta;
  const isLoading = mode === 'ligera' ? isLoadingLigera : mode === 'actual' ? isLoadingActual : isLoadingCompleta;
  const error = mode === 'ligera' ? errorLigera : mode === 'actual' ? errorActual : errorCompleta;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewPlan = (planId: string) => {
    navigate(`/panel/clients/${clienteId}/plan/${planId}`);
  };

  const handleViewControl = (controlId: string) => {
    // Navegar a ver control específico o abrir modal
    console.log('Ver control:', controlId);
  };

  const handleViewAllControls = () => {
    navigate(`/panel/clients/${clienteId}/seguimiento`);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getModeLabel = (mode: AsesoriaMode) => {
    switch (mode) {
      case 'ligera':
        return 'Vista Ligera (30 días)';
      case 'actual':
        return 'Vista Actual (7 días)';
      case 'completa':
        return 'Vista Completa (90 días)';
      default:
        return 'Vista Actual';
    }
  };

  const getModeDescription = (mode: AsesoriaMode) => {
    switch (mode) {
      case 'ligera':
        return 'Información básica de los últimos 30 días';
      case 'actual':
        return 'Datos recientes de los últimos 7 días con productos detallados';
      case 'completa':
        return 'Análisis completo con 90 días de historial y estadísticas';
      default:
        return 'Vista estándar';
    }
  };

  // Debug effect
  useEffect(() => {
    console.log('🔍 AsesoriaCompleta - Estado:', {
      clienteId,
      mode,
      hasData: !!data,
      isLoading,
      hasError: !!error,
      activeTab,
      showHistoricas
    });
  }, [clienteId, mode, data, isLoading, error, activeTab, showHistoricas]);

  // Loading state
  if (isLoadingCliente || isLoading) {
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
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Error or not found
  if (!cliente || !clienteId || error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-medium">Error al cargar asesoría</h3>
          <p className="text-muted-foreground">
            {error ? 
              `Error: ${error instanceof Error ? error.message : 'Error desconocido'}` :
              'No se pudo cargar la información del cliente solicitado.'
            }
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Button variant="outline" onClick={() => navigate('/panel/list-users/client')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la lista
            </Button>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Sin datos de asesoría</h3>
          <p className="text-muted-foreground">
            No hay información de asesoría disponible para este cliente en el período seleccionado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/panel/clients/${clienteId}/seguimiento`)}
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
              <h1 className="text-3xl font-bold">Asesoría Completa</h1>
              <p className="text-muted-foreground">
                Análisis integral para {cliente.nombreCompleto}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  DNI: {cliente.dni}
                </span>
                <Badge variant={cliente.active ? "default" : "secondary"}>
                  {cliente.active ? 'Activo' : 'Inactivo'}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {data.metadata.diasHistorial} días de historial
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Selector de modo */}
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <Select value={mode} onValueChange={(value: AsesoriaMode) => setMode(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar vista..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ligera">Vista Ligera</SelectItem>
                <SelectItem value="actual">Vista Actual</SelectItem>
                <SelectItem value="completa">Vista Completa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Información del modo */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          <strong>{getModeLabel(mode)}:</strong> {getModeDescription(mode)}
          {data.metadata.processingTime && (
            <span className="ml-2 text-muted-foreground">
              (Procesado en {data.metadata.processingTime}ms)
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Cards de Resumen */}
      <AsesoriaOverviewCards data={data} />

      {/* Contenido Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="plan">Plan Nutricional</TabsTrigger>
          <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
          <TabsTrigger value="controles">Controles Físicos</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlanActivoSection 
              plan={data.planActivo} 
              onViewPlan={handleViewPlan}
            />
            <AlertasSection resumen={data.resumen} />
          </div>
        </TabsContent>

        <TabsContent value="plan" className="space-y-6">
          <PlanActivoSection 
            plan={data.planActivo} 
            onViewPlan={handleViewPlan}
          />
        </TabsContent>

        <TabsContent value="recomendaciones" className="space-y-6">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistoricas(!showHistoricas)}
            >
              {showHistoricas ? 'Ocultar Históricas' : 'Mostrar Históricas'}
            </Button>
          </div>
          <RecomendacionesSection 
            recomendaciones={data.recomendaciones}
            showHistoricas={showHistoricas}
          />
        </TabsContent>

        <TabsContent value="controles" className="space-y-6">
          <ControlesFisicosSection 
            controles={data.controlesFisicos}
            onViewControl={handleViewControl}
            onViewAllControls={handleViewAllControls}
          />
        </TabsContent>

        <TabsContent value="alertas" className="space-y-6">
          <AlertasSection resumen={data.resumen} />
        </TabsContent>
      </Tabs>

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Fecha consulta:</span>
              <div>{new Date(data.metadata.fechaConsulta).toLocaleString('es-ES')}</div>
            </div>
            <div>
              <span className="font-medium">Última actualización:</span>
              <div>{new Date(data.metadata.ultimaActualizacion).toLocaleString('es-ES')}</div>
            </div>
            <div>
              <span className="font-medium">Días de historial:</span>
              <div>{data.metadata.diasHistorial} días</div>
            </div>
            <div>
              <span className="font-medium">Tiempo de procesamiento:</span>
              <div>{data.metadata.processingTime || 'N/A'}ms</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AsesoriaCompleta;