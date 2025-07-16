// src/features/nutrition-plans/pages/GenerarRecomendacionesMCP.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, AlertCircle, User, Activity } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Components
import { MCPRecommendationsForm } from '../components/mcp/MCPRecommendationsForm';
import { MCPRecommendationsResponse } from '../components/mcp/MCPRecommendationsResponse';

// Hooks
import { useClient } from '@/features/auth/hooks/useClients';
import { useGetActivePlanByCliente } from '../hooks/useGetPlanByCliente';
import { useCreateRecommendationMCP } from '../hooks/useCreateRecommendationMCP';
import { useHealthCheckMCP } from '../hooks/useAsesoriaCompleta';

// Types
import { CreateRecommendationMCPInput } from '../schemas/mcp-recommendations.schema';
import { CreateRecommendationMCPResponse } from '../types/asesoria-completa-api.types';

const GenerarRecomendacionesMCP = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  
  const [response, setResponse] = useState<CreateRecommendationMCPResponse | null>(null);
  const [showForm, setShowForm] = useState(true);

  // Hooks
  const { data: cliente, isLoading: isLoadingCliente, error: clienteError } = useClient(clienteId || '');
  const { data: planActivo, isLoading: isLoadingPlan } = useGetActivePlanByCliente(clienteId || '');
  const { data: mcpHealth, isLoading: isLoadingHealth } = useHealthCheckMCP();
  const createRecommendation = useCreateRecommendationMCP();

  const handleSubmit = (data: CreateRecommendationMCPInput) => {
    createRecommendation.mutate(data, {
      onSuccess: (responseData) => {
        setResponse(responseData);
        setShowForm(false);
      }
    });
  };

  const handleClearResponse = () => {
    setResponse(null);
    setShowForm(true);
  };

  const handleGenerateNew = () => {
    setResponse(null);
    setShowForm(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Debug effect
  useEffect(() => {
    console.log('🔍 GenerarRecomendacionesMCP - Estado:', {
      clienteId,
      hasCliente: !!cliente,
      hasPlanActivo: !!planActivo,
      mcpStatus: mcpHealth?.mcpServer?.status,
      showForm,
      hasResponse: !!response
    });
  }, [clienteId, cliente, planActivo, mcpHealth, showForm, response]);

  // Loading state
  if (isLoadingCliente || isLoadingHealth) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Error or not found
  if (clienteError || !cliente || !clienteId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-medium">Cliente no encontrado</h3>
          <p className="text-muted-foreground">
            No se pudo cargar la información del cliente solicitado.
          </p>
          <Button variant="outline" onClick={() => navigate('/panel/list-users/client')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  // MCP Health check failed
  if (mcpHealth?.mcpServer?.status !== 'healthy') {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-medium">Servicio MCP no disponible</h3>
          <p className="text-muted-foreground">
            El servicio de inteligencia artificial no está disponible en este momento.
          </p>
          <Button variant="outline" onClick={() => navigate(`/panel/clients/${clienteId}/seguimiento`)} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al seguimiento
          </Button>
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
              <h1 className="text-3xl font-bold">Recomendaciones IA</h1>
              <p className="text-muted-foreground">
                Generar recomendaciones personalizadas para {cliente.nombreCompleto}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  DNI: {cliente.dni}
                </span>
                <Badge variant={cliente.active ? "default" : "secondary"}>
                  {cliente.active ? 'Activo' : 'Inactivo'}
                </Badge>
                {planActivo && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Plan Activo
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Badge variant="default" className="flex items-center gap-1">
            <Bot className="w-3 h-3" />
            MCP Disponible
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            IA v{mcpHealth?.mcpServer?.version || '1.0'}
          </p>
        </div>
      </div>

      {/* Cliente Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil del Cliente</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Perfil:</span>
                <Badge variant={cliente.cliente.hasCompleteProfile ? "default" : "secondary"}>
                  {cliente.cliente.hasCompleteProfile ? 'Completo' : 'Incompleto'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Edad:</span>
                <span className="text-sm font-medium">
                  {cliente.cliente.edad ? `${cliente.cliente.edad} años` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Peso:</span>
                <span className="text-sm font-medium">
                  {cliente.cliente.peso ? `${cliente.cliente.peso}kg` : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Nutricional</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingPlan ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : planActivo ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plan:</span>
                  <Badge variant="default">Activo</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Objetivo:</span>
                  <span className="text-sm font-medium">{planActivo.objetivo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Progreso:</span>
                  <span className="text-sm font-medium">{planActivo.progreso}%</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Sin plan activo</p>
                <Badge variant="outline">Inactivo</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">MCP Server:</span>
                <Badge variant="default">Conectado</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Base de Datos:</span>
                <Badge variant={mcpHealth?.database?.status === 'connected' ? "default" : "destructive"}>
                  {mcpHealth?.database?.status === 'connected' ? 'Conectada' : 'Desconectada'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Versión:</span>
                <span className="text-sm font-medium">v{mcpHealth?.mcpServer?.version || '1.0'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y avisos */}
      {!cliente.cliente.hasCompleteProfile && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Perfil incompleto:</strong> Para obtener recomendaciones más precisas, 
            considera completar el perfil del cliente con información como preferencias alimentarias, 
            alergenos y objetivos fitness.
          </AlertDescription>
        </Alert>
      )}

      {/* Error state */}
      {createRecommendation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error al generar recomendaciones:</strong> {
              createRecommendation.error instanceof Error 
                ? createRecommendation.error.message 
                : 'Ha ocurrido un error inesperado'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Formulario o Respuesta */}
      {showForm && !response ? (
        <MCPRecommendationsForm
          clienteId={clienteId}
          planId={planActivo?.id}
          onSubmit={handleSubmit}
          isLoading={createRecommendation.isPending}
        />
      ) : response ? (
        <MCPRecommendationsResponse
          response={response}
          onClearResponse={handleClearResponse}
          onGenerateNew={handleGenerateNew}
        />
      ) : null}
    </div>
  );
};

export default GenerarRecomendacionesMCP;