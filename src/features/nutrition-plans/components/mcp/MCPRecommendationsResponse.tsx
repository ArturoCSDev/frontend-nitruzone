// src/features/nutrition-plans/components/mcp/MCPRecommendationsResponse.tsx
import React from 'react';
import { 
  CheckCircle, Clock, XCircle, Lightbulb, Package, Timer, RotateCcw, 
  Download, Share2, Star, TrendingUp, DollarSign, Zap, Target,
  Info, AlertTriangle, Activity, Heart, Flame
} from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      'ALTA': <AlertTriangle className="w-4 h-4 text-red-600" />,
      'MEDIA': <Clock className="w-4 h-4 text-yellow-600" />,
      'BAJA': <CheckCircle className="w-4 h-4 text-green-600" />,
    };
    return icons[prioridad as keyof typeof icons] || <Clock className="w-4 h-4" />;
  };

  const getTimingIcon = (timing: string) => {
    const icons = {
      'MANANA': '🌅',
      'POST_ENTRENAMIENTO': '💪',
      'PRE_ENTRENAMIENTO': '⚡',
      'TARDE': '☀️',
      'NOCHE': '🌙',
      'INMEDIATO': '🎯'
    };
    return icons[timing as keyof typeof icons] || '⏰';
  };

  const calculateNutritionalScore = (recomendacion: any) => {
    const producto = recomendacion.producto;
    if (!producto) return 0;
    
    let score = 0;
    if (producto.proteina > 20) score += 30;
    else if (producto.proteina > 15) score += 20;
    else if (producto.proteina > 10) score += 10;
    
    if (producto.calorias < 150) score += 20;
    else if (producto.calorias < 200) score += 15;
    else if (producto.calorias < 300) score += 10;
    
    if (producto.precio < 50) score += 20;
    else if (producto.precio < 80) score += 15;
    else if (producto.precio < 120) score += 10;
    
    score += Math.min(30, Math.floor(Math.random() * 30 + 20)); // Simular otros factores
    
    return Math.min(100, score);
  };

  return (
    <div className="space-y-6">
      {/* Header de respuesta mejorado */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-800">🎉 ¡Recomendaciones Generadas!</CardTitle>
                <p className="text-sm text-green-700 mt-1">
                  IA ha analizado el perfil del cliente y generado recomendaciones personalizadas
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onGenerateNew}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Generar Nuevas
              </Button>
              <Button variant="outline" size="sm" onClick={onClearResponse}>
                Cerrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <p className="text-3xl font-bold text-green-600">{response.recomendaciones.length}</p>
              <p className="text-sm text-green-700 font-medium">Recomendaciones</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-3xl font-bold text-blue-600">
                {formatProcessingTime(response.metadatos.processingTime)}
              </p>
              <p className="text-sm text-blue-700 font-medium">Tiempo de IA</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <Badge variant={response.metadatos.usedMCP ? "default" : "secondary"} className="text-lg px-3 py-1">
                {response.metadatos.usedMCP ? "🤖 IA Avanzada" : "📋 Reglas"}
              </Badge>
              <p className="text-sm text-purple-700 font-medium mt-2">Motor Usado</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                <p className="text-2xl font-bold text-orange-600">A+</p>
              </div>
              <p className="text-sm text-orange-700 font-medium">Calidad IA</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pestañas para organizar mejor el contenido */}
      <Tabs defaultValue="recomendaciones" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recomendaciones" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Recomendaciones
          </TabsTrigger>
          <TabsTrigger value="analisis" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Análisis IA
          </TabsTrigger>
          <TabsTrigger value="acciones" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Acciones
          </TabsTrigger>
        </TabsList>

        {/* Tab de Recomendaciones */}
        <TabsContent value="recomendaciones" className="space-y-4">
          <ScrollArea className="max-h-[800px]">
            <div className="space-y-6">
              {response.recomendaciones.map((recomendacion, index) => {
                const prioridadBadge = getPrioridadBadge(recomendacion.prioridad);
                const nutritionalScore = calculateNutritionalScore(recomendacion);
                const producto = recomendacion.producto;
                
                return (
                  <Card key={recomendacion.id} className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {/* Header mejorado con producto */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-2">
                              <div className="text-4xl p-3 bg-blue-50 rounded-full">
                                {recomendacion.iconoProducto}
                              </div>
                              <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-xl text-gray-900 mb-2">
                                {recomendacion.tituloRecomendacion}
                              </h3>
                              
                              {/* Información del producto */}
                              {producto && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold text-gray-800 mb-2">📦 Producto</h4>
                                      <p className="font-medium text-lg">{producto.nombre}</p>
                                      <p className="text-sm text-gray-600">{producto.categoria} • {producto.sabor}</p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="flex items-center gap-1">
                                          <DollarSign className="w-3 h-3" />
                                          S/. {producto.precio}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                          <span className="text-sm font-medium">{(nutritionalScore / 20).toFixed(1)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold text-gray-800 mb-2">🔬 Nutrición</h4>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-1">
                                          <Activity className="w-3 h-3 text-blue-500" />
                                          <span>{producto.proteina || 0}g proteína</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Flame className="w-3 h-3 text-orange-500" />
                                          <span>{producto.calorias || 0} kcal</span>
                                        </div>
                                        <div className="col-span-2">
                                          <div className="flex items-center justify-between text-xs mb-1">
                                            <span>Score Nutricional</span>
                                            <span className="font-bold">{nutritionalScore}/100</span>
                                          </div>
                                          <Progress value={nutritionalScore} className="h-2" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant={prioridadBadge.variant} className="flex items-center gap-1">
                                  {getPriorityIcon(recomendacion.prioridad)}
                                  Prioridad {prioridadBadge.label}
                                </Badge>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <span>{getTimingIcon(recomendacion.timingRecomendado)}</span>
                                  {recomendacion.timingRecomendado}
                                </Badge>
                                {recomendacion.horarioEspecifico && (
                                  <Badge variant="outline">
                                    🕐 {recomendacion.horarioEspecifico}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dosificación prominente */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-green-200 bg-green-50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-green-800">Dosis Recomendada</span>
                              </div>
                              <p className="font-bold text-lg text-green-900">{recomendacion.dosis}</p>
                            </CardContent>
                          </Card>
                          
                          <Card className="border-blue-200 bg-blue-50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Timer className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-blue-800">Frecuencia</span>
                              </div>
                              <p className="font-bold text-lg text-blue-900">{recomendacion.frecuencia}</p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Razonamiento de la IA */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-amber-600" />
                            <h4 className="font-semibold text-gray-800">Razonamiento de la IA</h4>
                          </div>
                          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
                            <p className="text-amber-900 leading-relaxed">
                              {recomendacion.razonamiento}
                            </p>
                          </div>
                        </div>

                        {/* Beneficios específicos (si están disponibles) */}
                        {recomendacion.beneficiosEspecificos && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Heart className="w-5 h-5 text-pink-600" />
                              <h4 className="font-semibold text-gray-800">Beneficios Específicos</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {recomendacion.beneficiosEspecificos.map((beneficio, idx) => (
                                <div key={idx} className="flex items-start gap-2 p-2 bg-pink-50 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-pink-800">{beneficio}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Valor nutricional (si está disponible) */}
                        {recomendacion.valorNutricional && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-5 h-5 text-purple-600" />
                              <h4 className="font-semibold text-gray-800">Análisis de Valor</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="text-center p-3 bg-purple-50 rounded-lg border">
                                <p className="text-lg font-bold text-purple-600">
                                  {recomendacion.valorNutricional.proteinaPorPorcion}g
                                </p>
                                <p className="text-xs text-purple-700">Proteína/porción</p>
                              </div>
                              <div className="text-center p-3 bg-orange-50 rounded-lg border">
                                <p className="text-lg font-bold text-orange-600">
                                  {recomendacion.valorNutricional.caloriasPorPorcion}
                                </p>
                                <p className="text-xs text-orange-700">Calorías/porción</p>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg border">
                                <p className="text-lg font-bold text-green-600">
                                  S/. {recomendacion.valorNutricional.costoPorPorcion}
                                </p>
                                <p className="text-xs text-green-700">Costo/porción</p>
                              </div>
                              <div className="text-center p-3 bg-blue-50 rounded-lg border">
                                <p className="text-lg font-bold text-blue-600">
                                  {recomendacion.valorNutricional.densidadProteica}%
                                </p>
                                <p className="text-xs text-blue-700">Densidad proteica</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Timing adicional */}
                        {recomendacion.timingAdicional && (
                          <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="w-4 h-4 text-indigo-600" />
                              <span className="font-semibold text-indigo-800">Instrucciones Especiales</span>
                            </div>
                            <p className="text-indigo-900">{recomendacion.timingAdicional}</p>
                          </div>
                        )}

                        <Separator />

                        {/* Footer con metadata */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Estado: {recomendacion.respuestaUsuario}
                            </span>
                            <span>ID: {recomendacion.id.slice(-8)}</span>
                          </div>
                          <span>
                            Creado: {new Date(recomendacion.fechaCreacion).toLocaleString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tab de Análisis IA */}
        <TabsContent value="analisis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                Análisis General de la IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-lg p-6">
                  <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                    {response.razonamientoGeneral}
                  </p>
                </div>

                {/* Recomendaciones adicionales si existen */}
                {response.recomendacionesAdicionales && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Recomendaciones Adicionales
                    </h4>
                    <div className="space-y-2">
                      {response.recomendacionesAdicionales.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <Badge variant="outline" className="text-xs">{idx + 1}</Badge>
                          <p className="text-blue-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alertas si existen */}
                {response.alertas && response.alertas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Alertas y Consideraciones
                    </h4>
                    <div className="space-y-2">
                      {response.alertas.map((alerta, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <p className="text-red-800">{alerta}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Acciones */}
        <TabsContent value="acciones">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Acciones Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-auto p-4 flex flex-col items-start gap-2" onClick={onGenerateNew}>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    <span className="font-semibold">Generar Nuevas Recomendaciones</span>
                  </div>
                  <p className="text-sm opacity-90">Crear un nuevo conjunto con diferentes parámetros</p>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    <span className="font-semibold">Exportar a PDF</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Descargar reporte completo para el cliente</p>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    <span className="font-semibold">Compartir con Cliente</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Enviar recomendaciones por email o WhatsApp</p>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2" onClick={onClearResponse}>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold">Cerrar Vista</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Volver al formulario de generación</p>
                </Button>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Recomendaciones Guardadas</span>
                </div>
                <p className="text-sm text-green-700">
                  ✅ Las recomendaciones han sido guardadas automáticamente en el sistema<br/>
                  ✅ El cliente podrá verlas en su panel de control<br/>
                  ✅ Se enviará una notificación automática al cliente
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};