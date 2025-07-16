// src/features/nutrition-plans/components/mcp/MCPRecommendationsResponse.tsx
import React from 'react';
import { CheckCircle, Clock, XCircle, Lightbulb, Package, Timer, RotateCcw, Download, Share2 } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types
import { CreateRecommendationMCPResponse } from '../../types/asesoria-completa-api.types';
import { getPrioridadBadge } from '../../utils/plan.utils';

interface MCPRecommendationsResponseProps {
  response: CreateRecommendationMCPResponse;
  onClearResponse: () => void;
  onGenerateNew: () => void;
}

export const MCPRecommendationsResponse: React.FC<MCPRecommendationsResponseProps> = ({
  response,
  onClearResponse,
  onGenerateNew
}) => {
  const formatProcessingTime = (time: number) => {
    return time > 1000 ? `${(time / 1000).toFixed(1)}s` : `${time}ms`;
  };

  const getPriorityIcon = (prioridad: string) => {
    const icons = {
      'ALTA': <XCircle className="w-4 h-4 text-red-600" />,
      'MEDIA': <Clock className="w-4 h-4 text-yellow-600" />,
      'BAJA': <CheckCircle className="w-4 h-4 text-green-600" />,
    };
    return icons[prioridad as keyof typeof icons] || <Clock className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header de respuesta */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <CardTitle className="text-green-800">Recomendaciones Generadas</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onGenerateNew}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Generar Nuevas
              </Button>
              <Button variant="outline" size="sm" onClick={onClearResponse}>
                Cerrar Respuesta
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{response.recomendaciones.length}</p>
              <p className="text-sm text-green-700">Recomendaciones</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {formatProcessingTime(response.metadatos.processingTime)}
              </p>
              <p className="text-sm text-blue-700">Tiempo de Procesamiento</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Badge variant={response.metadatos.usedMCP ? "default" : "secondary"}>
                  {response.metadatos.usedMCP ? "IA Activada" : "Reglas Básicas"}
                </Badge>
              </div>
              <p className="text-sm text-purple-700 mt-1">Motor Utilizado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Razonamiento general */}
      {response.razonamientoGeneral && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              Razonamiento de la IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
              <p className="text-amber-800 whitespace-pre-wrap leading-relaxed">
                {response.razonamientoGeneral}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Recomendaciones Detalladas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-4">
              {response.recomendaciones.map((recomendacion, index) => {
                const prioridadBadge = getPrioridadBadge(recomendacion.prioridad);
                
                return (
                  <Card key={recomendacion.id} className="border-l-4 border-l-blue-400">
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {/* Header de la recomendación */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{recomendacion.iconoProducto}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{recomendacion.tituloRecomendacion}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={prioridadBadge.variant} className="flex items-center gap-1">
                                  {getPriorityIcon(recomendacion.prioridad)}
                                  Prioridad {prioridadBadge.label}
                                </Badge>
                                <Badge variant="outline">#{index + 1}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {recomendacion.timingRecomendado}
                            </div>
                            {recomendacion.horarioEspecifico && (
                              <div className="mt-1">{recomendacion.horarioEspecifico}</div>
                            )}
                          </div>
                        </div>

                        {/* Dosificación y frecuencia */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Dosis Recomendada</p>
                            <p className="font-medium">{recomendacion.dosis}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Frecuencia</p>
                            <p className="font-medium">{recomendacion.frecuencia}</p>
                          </div>
                        </div>

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

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                          <span>Estado: {recomendacion.respuestaUsuario}</span>
                          <span>Creado: {new Date(recomendacion.fechaCreacion).toLocaleString('es-ES')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Acciones adicionales */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <p>💡 Las recomendaciones han sido guardadas automáticamente</p>
              <p>El cliente podrá verlas en su panel de control</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};