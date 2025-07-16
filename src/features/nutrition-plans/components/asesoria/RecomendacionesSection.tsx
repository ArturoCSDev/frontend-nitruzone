// src/features/nutrition-plans/components/asesoria/RecomendacionesSection.tsx
import React, { useState } from 'react';
import { Star, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Types
import { RecomendacionesCompletas, RecomendacionDetallada } from '../../types/asesoria-completa-api.types';
import { getPrioridadBadge, getRespuestaBadge } from '../../utils/plan.utils';

interface RecomendacionesSectionProps {
  recomendaciones: RecomendacionesCompletas;
  showHistoricas?: boolean;
}

interface RecomendacionCardProps {
  recomendacion: RecomendacionDetallada;
  isExpanded?: boolean;
}

export const RecomendacionesSection: React.FC<RecomendacionesSectionProps> = ({ 
  recomendaciones, 
  showHistoricas = false 
}) => {
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRecommendations);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRecommendations(newExpanded);
  };

  const RecomendacionCard: React.FC<RecomendacionCardProps> = ({ recomendacion, isExpanded = false }) => {
    const prioridadBadge = getPrioridadBadge(recomendacion.prioridad);
    const respuestaBadge = getRespuestaBadge(recomendacion.respuestaUsuario);
    const RespuestaIcon = respuestaBadge.icon;

    return (
      <Card className={`transition-all ${isExpanded ? 'border-primary' : ''}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-2xl">{recomendacion.iconoProducto}</div>
                <div className="flex-1">
                  <h4 className="font-semibold">{recomendacion.tituloRecomendacion}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={prioridadBadge.variant}>
                      Prioridad {prioridadBadge.label}
                    </Badge>
                    <Badge variant={respuestaBadge.variant} className="flex items-center gap-1">
                      <RespuestaIcon className="w-3 h-3" />
                      {respuestaBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {recomendacion.timingRecomendado}
                </div>
                {recomendacion.horarioEspecifico && (
                  <div className="mt-1">{recomendacion.horarioEspecifico}</div>
                )}
              </div>
            </div>

            {/* Dosificación rápida */}
            <div className="flex items-center gap-4 text-sm bg-muted/50 p-2 rounded">
              <span><strong>Dosis:</strong> {recomendacion.dosis}</span>
              <span><strong>Frecuencia:</strong> {recomendacion.frecuencia}</span>
            </div>

            {/* Botón expandir */}
            <Collapsible 
              open={expandedRecommendations.has(recomendacion.id)}
              onOpenChange={() => toggleExpanded(recomendacion.id)}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  {expandedRecommendations.has(recomendacion.id) ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Ocultar detalles
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Ver detalles
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {/* Razonamiento */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Razonamiento</p>
                  <p className="text-sm leading-relaxed bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    {recomendacion.razonamiento}
                  </p>
                </div>

                {/* Timing adicional */}
                {recomendacion.timingAdicional && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Instrucciones Adicionales</p>
                    <p className="text-sm bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                      {recomendacion.timingAdicional}
                    </p>
                  </div>
                )}

                {/* Producto (si está disponible) */}
                {recomendacion.producto && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Información del Producto</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h5 className="font-medium">{recomendacion.producto.nombre}</h5>
                      <p className="text-sm text-muted-foreground">{recomendacion.producto.descripcion}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span>Precio: ${recomendacion.producto.precio}</span>
                        {recomendacion.producto.proteina && (
                          <span>Proteína: {recomendacion.producto.proteina}g</span>
                        )}
                        {recomendacion.producto.calorias && (
                          <span>Calorías: {recomendacion.producto.calorias}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Creado: {new Date(recomendacion.fechaCreacion).toLocaleDateString('es-ES')}</span>
                  {recomendacion.fechaRespuesta && (
                    <span>Respondido: {new Date(recomendacion.fechaRespuesta).toLocaleDateString('es-ES')}</span>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (recomendaciones.resumen.totalActivas === 0 && (!showHistoricas || !recomendaciones.historicas)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Star className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Sin Recomendaciones</h3>
            <p className="text-muted-foreground">
              Este cliente no tiene recomendaciones en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Recomendaciones
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="default">{recomendaciones.resumen.totalActivas} Activas</Badge>
          <Badge variant="outline">{recomendaciones.resumen.pendientes} Pendientes</Badge>
          <Badge variant="secondary">{recomendaciones.resumen.aceptadas} Aceptadas</Badge>
          <Badge variant="destructive">{recomendaciones.resumen.rechazadas} Rechazadas</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activas">
              Activas ({recomendaciones.resumen.totalActivas})
            </TabsTrigger>
            <TabsTrigger value="proximas">
              Próximas ({recomendaciones.proximasRecomendaciones.length})
            </TabsTrigger>
            {showHistoricas && recomendaciones.historicas && (
              <TabsTrigger value="historicas">
                Históricas ({recomendaciones.resumen.totalHistoricas})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="activas" className="space-y-4">
            {recomendaciones.activas.length > 0 ? (
              <div className="space-y-4">
                {recomendaciones.activas.map((recomendacion) => (
                  <RecomendacionCard
                    key={recomendacion.id}
                    recomendacion={recomendacion}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">No hay recomendaciones activas</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="proximas" className="space-y-4">
            {recomendaciones.proximasRecomendaciones.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">Próximas Recomendaciones Prioritarias</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Recomendaciones que requieren atención inmediata basadas en prioridad y timing.
                  </p>
                </div>
                {recomendaciones.proximasRecomendaciones.map((recomendacion) => (
                  <RecomendacionCard
                    key={recomendacion.id}
                    recomendacion={recomendacion}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">No hay próximas recomendaciones programadas</p>
              </div>
            )}
          </TabsContent>

          {showHistoricas && recomendaciones.historicas && (
            <TabsContent value="historicas" className="space-y-4">
              {recomendaciones.historicas.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Historial de Recomendaciones</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recomendaciones previas y su estado de cumplimiento.
                    </p>
                  </div>
                  {recomendaciones.historicas.map((recomendacion) => (
                    <RecomendacionCard
                      key={recomendacion.id}
                      recomendacion={recomendacion}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">No hay recomendaciones históricas</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        {/* Estadísticas por prioridad */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3">Distribución por Prioridad</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {recomendaciones.resumen.porPrioridad.alta}
              </div>
              <div className="text-sm text-muted-foreground">Alta Prioridad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {recomendaciones.resumen.porPrioridad.media}
              </div>
              <div className="text-sm text-muted-foreground">Media Prioridad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {recomendaciones.resumen.porPrioridad.baja}
              </div>
              <div className="text-sm text-muted-foreground">Baja Prioridad</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};