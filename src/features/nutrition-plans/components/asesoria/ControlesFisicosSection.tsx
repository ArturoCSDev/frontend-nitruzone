// src/features/nutrition-plans/components/asesoria/ControlesFisicosSection.tsx
import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Calendar, Eye } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Types
import { ControlesFisicosCompletos } from '../../types/asesoria-completa-api.types';

interface ControlesFisicosSectionProps {
  controles: ControlesFisicosCompletos;
  onViewControl?: (controlId: string) => void;
  onViewAllControls?: () => void;
}

export const ControlesFisicosSection: React.FC<ControlesFisicosSectionProps> = ({ 
  controles, 
  onViewControl,
  onViewAllControls 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatMetric = (value: number | null, unit: string) => {
    return value ? `${value}${unit}` : 'N/A';
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subiendo':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'bajando':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'estable':
        return <Minus className="w-4 h-4 text-blue-600" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'subiendo':
        return 'text-green-600';
      case 'bajando':
        return 'text-red-600';
      case 'estable':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTendenciaLabel = (tendencia: string) => {
    switch (tendencia) {
      case 'subiendo':
        return 'Subiendo';
      case 'bajando':
        return 'Bajando';
      case 'estable':
        return 'Estable';
      default:
        return 'Sin datos';
    }
  };

  const getEnergyLevel = (nivel: number | null) => {
    if (!nivel) return 'No registrado';
    const levels = ['', 'Muy Bajo', 'Bajo', 'Moderado', 'Alto', 'Muy Alto'];
    return levels[nivel] || 'No registrado';
  };

  const getEnergyBadge = (nivel: number | null) => {
    if (!nivel) return <Badge variant="outline">N/A</Badge>;
    if (nivel >= 4) return <Badge variant="default">Alto</Badge>;
    if (nivel >= 3) return <Badge variant="secondary">Medio</Badge>;
    return <Badge variant="destructive">Bajo</Badge>;
  };

  if (controles.resumen.totalControles === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Controles Físicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Sin Controles Físicos</h3>
            <p className="text-muted-foreground">
              No se han registrado controles físicos para este cliente.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Último Control */}
      {controles.ultimo && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Último Control Físico
              </CardTitle>
              <div className="flex gap-2">
                {onViewControl && (
                  <Button variant="outline" size="sm" onClick={() => onViewControl(controles.ultimo!.id)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Button>
                )}
                {onViewAllControls && (
                  <Button variant="outline" size="sm" onClick={onViewAllControls}>
                    Ver Todos
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Información del Control</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fecha:</span>
                      <span className="text-sm font-medium">
                        {formatDate(controles.ultimo.fechaControl)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Días desde control:</span>
                      <span className="text-sm font-medium">
                        {controles.ultimo.diasDesdeControl} días
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Realizado por:</span>
                      <span className="text-sm font-medium">
                        {controles.ultimo.realizadoPor || 'No especificado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estado:</span>
                      <div className="flex gap-1">
                        {controles.ultimo.hasCompleteMetrics && (
                          <Badge variant="default">Métricas</Badge>
                        )}
                        {controles.ultimo.hasSubjectiveEvaluation && (
                          <Badge variant="secondary">Evaluación</Badge>
                        )}
                        {controles.ultimo.isRecentControl && (
                          <Badge variant="outline">Reciente</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Métricas Físicas */}
                <div>
                  <h4 className="font-medium mb-3">Métricas Físicas</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">
                        {formatMetric(controles.ultimo.peso, 'kg')}
                      </p>
                      <p className="text-xs text-blue-700">Peso</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">
                        {formatMetric(controles.ultimo.grasaCorporal, '%')}
                      </p>
                      <p className="text-xs text-orange-700">Grasa</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {formatMetric(controles.ultimo.masaMuscular, 'kg')}
                      </p>
                      <p className="text-xs text-green-700">Músculo</p>
                    </div>
                  </div>
                </div>

                {/* Evaluación Subjetiva */}
                {(controles.ultimo.nivelEnergia || controles.ultimo.estadoAnimo) && (
                  <div>
                    <h4 className="font-medium mb-3">Evaluación Subjetiva</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Energía:</span>
                          {getEnergyBadge(controles.ultimo.nivelEnergia)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getEnergyLevel(controles.ultimo.nivelEnergia)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Ánimo:</span>
                          {getEnergyBadge(controles.ultimo.estadoAnimo)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getEnergyLevel(controles.ultimo.estadoAnimo)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notas */}
            {controles.ultimo.notas && (
              <div>
                <h4 className="font-medium mb-2">Notas del Control</h4>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm">{controles.ultimo.notas}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tendencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tendencias y Progreso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Peso */}
            {controles.tendencias.peso && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {getTendenciaIcon(controles.tendencias.peso.tendencia)}
                  <span className={`text-sm font-medium ${getTendenciaColor(controles.tendencias.peso.tendencia)}`}>
                    {getTendenciaLabel(controles.tendencias.peso.tendencia)}
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {formatMetric(controles.tendencias.peso.actual, 'kg')}
                </p>
                <p className="text-xs text-blue-700">Peso Actual</p>
                {controles.tendencias.peso.cambio && (
                  <p className="text-xs text-muted-foreground">
                    {controles.tendencias.peso.cambio > 0 ? '+' : ''}{controles.tendencias.peso.cambio}kg
                  </p>
                )}
              </div>
            )}

            {/* Grasa Corporal */}
            {controles.tendencias.grasaCorporal && (
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {getTendenciaIcon(controles.tendencias.grasaCorporal.tendencia)}
                  <span className={`text-sm font-medium ${getTendenciaColor(controles.tendencias.grasaCorporal.tendencia)}`}>
                    {getTendenciaLabel(controles.tendencias.grasaCorporal.tendencia)}
                  </span>
                </div>
                <p className="text-lg font-bold text-orange-600">
                  {formatMetric(controles.tendencias.grasaCorporal.actual, '%')}
                </p>
                <p className="text-xs text-orange-700">Grasa Corporal</p>
                {controles.tendencias.grasaCorporal.cambio && (
                  <p className="text-xs text-muted-foreground">
                    {controles.tendencias.grasaCorporal.cambio > 0 ? '+' : ''}{controles.tendencias.grasaCorporal.cambio}%
                  </p>
                )}
              </div>
            )}

            {/* Masa Muscular */}
            {controles.tendencias.masaMuscular && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {getTendenciaIcon(controles.tendencias.masaMuscular.tendencia)}
                  <span className={`text-sm font-medium ${getTendenciaColor(controles.tendencias.masaMuscular.tendencia)}`}>
                    {getTendenciaLabel(controles.tendencias.masaMuscular.tendencia)}
                  </span>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {formatMetric(controles.tendencias.masaMuscular.actual, 'kg')}
                </p>
                <p className="text-xs text-green-700">Masa Muscular</p>
                {controles.tendencias.masaMuscular.cambio && (
                  <p className="text-xs text-muted-foreground">
                    {controles.tendencias.masaMuscular.cambio > 0 ? '+' : ''}{controles.tendencias.masaMuscular.cambio}kg
                  </p>
                )}
              </div>
            )}

            {/* Nivel de Energía */}
            {controles.tendencias.nivelEnergia && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {getTendenciaIcon(controles.tendencias.nivelEnergia.tendencia)}
                  <span className={`text-sm font-medium ${getTendenciaColor(controles.tendencias.nivelEnergia.tendencia)}`}>
                    {getTendenciaLabel(controles.tendencias.nivelEnergia.tendencia)}
                  </span>
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {controles.tendencias.nivelEnergia.actual || 'N/A'}
                </p>
                <p className="text-xs text-purple-700">Energía</p>
                {controles.tendencias.nivelEnergia.cambio && (
                  <p className="text-xs text-muted-foreground">
                    {controles.tendencias.nivelEnergia.cambio > 0 ? '+' : ''}{controles.tendencias.nivelEnergia.cambio}
                  </p>
                )}
              </div>
            )}

            {/* Estado de Ánimo */}
            {controles.tendencias.estadoAnimo && (
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {getTendenciaIcon(controles.tendencias.estadoAnimo.tendencia)}
                  <span className={`text-sm font-medium ${getTendenciaColor(controles.tendencias.estadoAnimo.tendencia)}`}>
                    {getTendenciaLabel(controles.tendencias.estadoAnimo.tendencia)}
                  </span>
                </div>
                <p className="text-lg font-bold text-pink-600">
                  {controles.tendencias.estadoAnimo.actual || 'N/A'}
                </p>
                <p className="text-xs text-pink-700">Ánimo</p>
                {controles.tendencias.estadoAnimo.cambio && (
                  <p className="text-xs text-muted-foreground">
                    {controles.tendencias.estadoAnimo.cambio > 0 ? '+' : ''}{controles.tendencias.estadoAnimo.cambio}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Resumen de Controles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{controles.resumen.totalControles}</p>
              <p className="text-sm text-muted-foreground">Total Controles</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{controles.resumen.controlesConMetricas}</p>
              <p className="text-sm text-muted-foreground">Con Métricas</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{controles.resumen.controlesConEvaluacion}</p>
              <p className="text-sm text-muted-foreground">Con Evaluación</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">
                {controles.resumen.frecuenciaPromedio ? `${controles.resumen.frecuenciaPromedio}d` : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">Frecuencia Promedio</p>
            </div>
          </div>

          {/* Próximo Control */}
          {controles.resumen.proximoControl && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Próximo Control Programado</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {formatDate(controles.resumen.proximoControl)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};