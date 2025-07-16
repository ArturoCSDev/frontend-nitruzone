// src/features/nutrition-plans/components/asesoria/AsesoriaOverviewCards.tsx
import React from 'react';
import { TrendingUp, Activity, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Types
import { AsesoriaCompletaResponse } from '../../types/asesoria-completa-api.types';

interface AsesoriaOverviewCardsProps {
  data: AsesoriaCompletaResponse;
}

export const AsesoriaOverviewCards: React.FC<AsesoriaOverviewCardsProps> = ({ data }) => {
  const getEstadoBadge = (estado: string) => {
    const badges = {
      'activo': { variant: 'default' as const, label: 'Activo' },
      'inactivo': { variant: 'secondary' as const, label: 'Inactivo' },
      'pausado': { variant: 'outline' as const, label: 'Pausado' },
    };
    return badges[estado as keyof typeof badges] || badges['inactivo'];
  };

  const getAlertasCount = (nivel: 'alta' | 'media' | 'baja') => {
    return data.resumen.alertas.filter(alerta => alerta.prioridad === nivel).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Estado General */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estado General</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant={getEstadoBadge(data.resumen.estado).variant}>
              {getEstadoBadge(data.resumen.estado).label}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Cliente {data.cliente.active ? 'activo' : 'inactivo'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Activo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plan Nutricional</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {data.planActivo ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">{data.planActivo.progreso}%</div>
              <Progress value={data.planActivo.progreso} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.planActivo.diasRestantes ? `${data.planActivo.diasRestantes} días restantes` : 'Plan completado'}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Badge variant="outline">Sin Plan</Badge>
              <p className="text-xs text-muted-foreground mt-1">No hay plan activo</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recomendaciones</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {data.recomendaciones.resumen.pendientes}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendientes de {data.recomendaciones.resumen.totalActivas} activas
            </p>
            <div className="flex gap-1">
              <Badge variant="default" className="text-xs">
                {data.recomendaciones.resumen.aceptadas} aceptadas
              </Badge>
              <Badge variant="destructive" className="text-xs">
                {data.recomendaciones.resumen.rechazadas} rechazadas
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {data.resumen.alertas.length}
            </div>
            <p className="text-xs text-muted-foreground">Total de alertas</p>
            <div className="flex gap-1">
              {getAlertasCount('alta') > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {getAlertasCount('alta')} alta
                </Badge>
              )}
              {getAlertasCount('media') > 0 && (
                <Badge variant="outline" className="text-xs">
                  {getAlertasCount('media')} media
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles Físicos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Último Control</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {data.controlesFisicos.ultimo ? (
            <div className="space-y-2">
              <div className="text-sm font-bold">
                {new Date(data.controlesFisicos.ultimo.fechaControl).toLocaleDateString('es-ES')}
              </div>
              <p className="text-xs text-muted-foreground">
                Hace {data.controlesFisicos.ultimo.diasDesdeControl} días
              </p>
              <div className="flex gap-1">
                {data.controlesFisicos.ultimo.hasCompleteMetrics && (
                  <Badge variant="default" className="text-xs">Métricas</Badge>
                )}
                {data.controlesFisicos.ultimo.hasSubjectiveEvaluation && (
                  <Badge variant="secondary" className="text-xs">Evaluación</Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Badge variant="outline">Sin Controles</Badge>
              <p className="text-xs text-muted-foreground mt-1">No hay controles registrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Historial</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {data.metadata.diasHistorial}
            </div>
            <p className="text-xs text-muted-foreground">Días de historial</p>
            <div className="text-xs text-muted-foreground">
              Controles: {data.controlesFisicos.resumen.totalControles}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tiempo como Cliente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo como Cliente</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {data.estadisticas?.diasComoCliente || 0}
            </div>
            <p className="text-xs text-muted-foreground">Días registrado</p>
            <div className="text-xs text-muted-foreground">
              Nivel: {data.estadisticas?.nivelActividad || 'Sin datos'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasa de Aceptación */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa Aceptación</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {data.estadisticas?.tasaAceptacion ? `${data.estadisticas.tasaAceptacion}%` : 'N/A'}
            </div>
            <Progress 
              value={data.estadisticas?.tasaAceptacion || 0} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground">
              De {data.estadisticas?.recomendacionesRecibidas || 0} recomendaciones
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};