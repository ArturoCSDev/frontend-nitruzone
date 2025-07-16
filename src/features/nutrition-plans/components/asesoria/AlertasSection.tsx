// src/features/nutrition-plans/components/asesoria/AlertasSection.tsx
import React from 'react';
import { AlertTriangle, Info, XCircle, CheckSquare, Lightbulb, ArrowRight } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types
import { ResumenAsesoria } from '../../types/asesoria-completa-api.types';

interface AlertasSectionProps {
  resumen: ResumenAsesoria;
}

export const AlertasSection: React.FC<AlertasSectionProps> = ({ resumen }) => {
  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getAlertVariant = (tipo: string) => {
    switch (tipo) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      case 'info':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return <Badge variant="destructive">Alta Prioridad</Badge>;
      case 'media':
        return <Badge variant="outline">Media Prioridad</Badge>;
      case 'baja':
        return <Badge variant="secondary">Baja Prioridad</Badge>;
      default:
        return <Badge variant="outline">Sin Prioridad</Badge>;
    }
  };

  const hasAlertas = resumen.alertas && resumen.alertas.length > 0;
  const hasSiguientesPasos = resumen.siguientesPasos && resumen.siguientesPasos.length > 0;
  const hasNotasImportantes = resumen.notasImportantes && resumen.notasImportantes.length > 0;

  if (!hasAlertas && !hasSiguientesPasos && !hasNotasImportantes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-green-600" />
            Estado del Asesoramiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckSquare className="mx-auto h-12 w-12 text-green-600" />
            <h3 className="mt-4 text-lg font-medium text-green-800">Todo en Orden</h3>
            <p className="text-green-600">
              No hay alertas ni acciones pendientes en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {hasAlertas && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Alertas ({resumen.alertas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumen.alertas.map((alerta, index) => (
              <Alert key={index} variant={getAlertVariant(alerta.tipo)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alerta.tipo)}
                    <div className="flex-1">
                      <AlertDescription className="font-medium">
                        {alerta.mensaje}
                      </AlertDescription>
                    </div>
                  </div>
                  <div className="ml-4">
                    {getPrioridadBadge(alerta.prioridad)}
                  </div>
                </div>
              </Alert>
            ))}

            {/* Resumen de alertas por tipo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {resumen.alertas.filter(a => a.tipo === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Críticas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {resumen.alertas.filter(a => a.tipo === 'warning').length}
                </div>
                <div className="text-sm text-muted-foreground">Advertencias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {resumen.alertas.filter(a => a.tipo === 'info').length}
                </div>
                <div className="text-sm text-muted-foreground">Informativas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notas Importantes */}
      {hasNotasImportantes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Notas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resumen.notasImportantes.map((nota, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 leading-relaxed">{nota}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Siguientes Pasos */}
      {hasSiguientesPasos && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-green-600" />
              Próximos Pasos Recomendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resumen.siguientesPasos.map((paso, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-green-800 leading-relaxed">{paso}</p>
                </div>
              ))}
            </div>

            {/* Indicador de progreso */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Plan de Acción</span>
                <span className="text-sm text-muted-foreground">
                  {resumen.siguientesPasos.length} pasos identificados
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Sigue estos pasos para optimizar el asesoramiento del cliente
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Resumen del Estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">
                {hasAlertas ? resumen.alertas.length : 0}
              </div>
              <div className="text-sm text-muted-foreground">Alertas Activas</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">
                {hasSiguientesPasos ? resumen.siguientesPasos.length : 0}
              </div>
              <div className="text-sm text-muted-foreground">Acciones Pendientes</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">
                {hasNotasImportantes ? resumen.notasImportantes.length : 0}
              </div>
              <div className="text-sm text-muted-foreground">Notas Importantes</div>
            </div>
          </div>

          {/* Estado general */}
          <div className="mt-4 p-3 rounded-lg text-center">
            {!hasAlertas && !hasSiguientesPasos ? (
              <div className="text-green-600">
                <CheckSquare className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">El cliente está en buen estado</p>
                <p className="text-sm">No hay acciones críticas pendientes</p>
              </div>
            ) : (
              <div className="text-amber-600">
                <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">Requiere atención</p>
                <p className="text-sm">Hay acciones pendientes o alertas activas</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};