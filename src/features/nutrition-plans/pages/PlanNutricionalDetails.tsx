// src/features/nutrition-plans/pages/PlanNutricionalDetails.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Clock, 
  User, 
  Activity,
  ChefHat,
  TrendingUp,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Download,
  Share2,
  MoreHorizontal,
  Utensils,
  Zap,
  Heart
} from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Hooks
import { usePlanCompleto } from '../hooks/useNutritionPlans';

const PlanNutricionalDetails = () => {
  const { clienteId, planId } = useParams<{ clienteId: string; planId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Hook para obtener el plan completo
  const { data: plan, isLoading, error } = usePlanCompleto(planId || '');

  const handleGoBack = () => {
    navigate(`/panel/clients/${clienteId}/seguimiento`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getObjetivoInfo = (objetivo: string) => {
    const objetivos = {
      'PERDIDA_PESO': { label: 'Pérdida de Peso', icon: TrendingUp, color: 'text-red-600 bg-red-50 border-red-200' },
      'GANANCIA_MUSCULAR': { label: 'Ganancia Muscular', icon: Activity, color: 'text-blue-600 bg-blue-50 border-blue-200' },
      'MANTENIMIENTO': { label: 'Mantenimiento', icon: Target, color: 'text-green-600 bg-green-50 border-green-200' },
      'DEFINICION': { label: 'Definición', icon: Star, color: 'text-purple-600 bg-purple-50 border-purple-200' },
      'VOLUMEN': { label: 'Volumen', icon: Zap, color: 'text-orange-600 bg-orange-50 border-orange-200' },
      'RECUPERACION': { label: 'Recuperación', icon: Heart, color: 'text-pink-600 bg-pink-50 border-pink-200' },
    };
    return objetivos[objetivo as keyof typeof objetivos] || objetivos['MANTENIMIENTO'];
  };

  const getPrioridadBadge = (prioridad: string) => {
    const prioridades = {
      'ALTA': { variant: 'destructive' as const, label: 'Alta' },
      'MEDIA': { variant: 'default' as const, label: 'Media' },
      'BAJA': { variant: 'secondary' as const, label: 'Baja' },
    };
    return prioridades[prioridad as keyof typeof prioridades] || prioridades['MEDIA'];
  };

  const getRespuestaBadge = (respuesta: string) => {
    const respuestas = {
      'PENDIENTE': { icon: Clock, variant: 'outline' as const, label: 'Pendiente', color: 'text-yellow-600' },
      'ACEPTADA': { icon: CheckCircle, variant: 'default' as const, label: 'Aceptada', color: 'text-green-600' },
      'RECHAZADA': { icon: XCircle, variant: 'destructive' as const, label: 'Rechazada', color: 'text-red-600' },
      'MODIFICADA': { icon: Edit, variant: 'secondary' as const, label: 'Modificada', color: 'text-blue-600' },
    };
    return respuestas[respuesta as keyof typeof respuestas] || respuestas['PENDIENTE'];
  };

  // Loading state
  if (isLoading) {
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
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Error or not found
  if (error || !plan) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-medium">Plan no encontrado</h3>
          <p className="text-muted-foreground">
            El plan nutricional solicitado no existe o no tienes permisos para verlo.
          </p>
          <Button variant="outline" onClick={handleGoBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const objetivoInfo = getObjetivoInfo(plan.objetivo);
  const ObjectiveIcon = objetivoInfo.icon;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGoBack}
            className="mt-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${objetivoInfo.color}`}>
                <ObjectiveIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{plan.nombre}</h1>
                <p className="text-muted-foreground">{plan.descripcion}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {objetivoInfo.label}
              </Badge>
              <Badge variant={plan.estaActivo ? "default" : "secondary"}>
                {plan.estado}
              </Badge>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDate(plan.fechaInicio)}
              </span>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Editar Plan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cliente Info y Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cliente */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliente</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {getInitials(plan.cliente?.nombreCompleto || 'Cliente')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{plan.cliente?.nombreCompleto}</p>
                <p className="text-xs text-muted-foreground">
                  {plan.cliente?.edad ? `${plan.cliente.edad} años` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progreso */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{plan.progreso}%</div>
              <Progress value={plan.progreso} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {plan.diasRestantes ? `${plan.diasRestantes} días restantes` : 'Completado'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Duración */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duración</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan.duracion || 0}</div>
            <p className="text-xs text-muted-foreground">
              días totales
            </p>
          </CardContent>
        </Card>

        {/* Recomendaciones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recomendaciones</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan.resumenRecomendaciones?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {plan.resumenRecomendaciones?.pendientes || 0} pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrición</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
        </TabsList>

        {/* Tab: Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objetivos Nutricionales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objetivos Nutricionales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{plan.caloriasObjetivo || 0}</p>
                    <p className="text-sm text-muted-foreground">Calorías</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{plan.proteinaObjetivo || 0}g</p>
                    <p className="text-sm text-muted-foreground">Proteínas</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{plan.carbohidratosObjetivo || 0}g</p>
                    <p className="text-sm text-muted-foreground">Carbohidratos</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{plan.grasasObjetivo || 0}g</p>
                    <p className="text-sm text-muted-foreground">Grasas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estado del Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Estado del Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estado actual:</span>
                    <Badge variant={plan.estaActivo ? "default" : "secondary"}>
                      {plan.estado}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fecha inicio:</span>
                    <span className="text-sm font-medium">{formatDate(plan.fechaInicio)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fecha fin:</span>
                    <span className="text-sm font-medium">
                      {plan.fechaFin ? formatDate(plan.fechaFin) : 'Sin fecha límite'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Puede modificarse:</span>
                    <Badge variant={plan.puedeSerModificado ? "default" : "secondary"}>
                      {plan.puedeSerModificado ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Recomendaciones */}
        <TabsContent value="recommendations" className="space-y-6">
          {plan.resumenRecomendaciones && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{plan.resumenRecomendaciones.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{plan.resumenRecomendaciones.pendientes}</div>
                  <div className="text-sm text-muted-foreground">Pendientes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{plan.resumenRecomendaciones.aceptadas}</div>
                  <div className="text-sm text-muted-foreground">Aceptadas</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{plan.resumenRecomendaciones.rechazadas}</div>
                  <div className="text-sm text-muted-foreground">Rechazadas</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lista de Recomendaciones */}
          <div className="space-y-4">
            {plan.recomendaciones?.map((recomendacion) => {
              const prioridadBadge = getPrioridadBadge(recomendacion.prioridad);
              const respuestaBadge = getRespuestaBadge(recomendacion.respuestaUsuario);
              const RespuestaIcon = respuestaBadge.icon;

              return (
                <Card key={recomendacion.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{recomendacion.iconoProducto}</div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{recomendacion.tituloRecomendacion}</h3>
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
                        
                        <p className="text-sm text-muted-foreground">{recomendacion.razonamiento}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Utensils className="w-3 h-3" />
                            <span className="font-medium">Dosis:</span> {recomendacion.dosis}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="font-medium">Frecuencia:</span> {recomendacion.frecuencia}
                          </div>
                        </div>

                        {recomendacion.timingAdicional && (
                          <div className="p-3 bg-muted/50 rounded-lg text-sm">
                            <strong>Timing adicional:</strong> {recomendacion.timingAdicional}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab: Nutrición */}
        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Macronutrientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">{plan.proteinaObjetivo || 0}g</span>
                  </div>
                  <div>
                    <p className="font-medium">Proteínas</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.proteinaObjetivo && plan.caloriasObjetivo ? 
                        `${Math.round((plan.proteinaObjetivo * 4 / plan.caloriasObjetivo) * 100)}%` : '0%'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">{plan.carbohidratosObjetivo || 0}g</span>
                  </div>
                  <div>
                    <p className="font-medium">Carbohidratos</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.carbohidratosObjetivo && plan.caloriasObjetivo ? 
                        `${Math.round((plan.carbohidratosObjetivo * 4 / plan.caloriasObjetivo) * 100)}%` : '0%'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-600">{plan.grasasObjetivo || 0}g</span>
                  </div>
                  <div>
                    <p className="font-medium">Grasas</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.grasasObjetivo && plan.caloriasObjetivo ? 
                        `${Math.round((plan.grasasObjetivo * 9 / plan.caloriasObjetivo) * 100)}%` : '0%'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Progreso */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seguimiento del Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Progreso General</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.progreso}% completado
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{plan.progreso}%</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.diasRestantes ? `${plan.diasRestantes} días restantes` : 'Completado'}
                    </p>
                  </div>
                </div>
                <Progress value={plan.progreso} className="h-3" />
                
                {plan.pesoInicial && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{plan.pesoInicial}kg</p>
                      <p className="text-sm text-muted-foreground">Peso Inicial</p>
                    </div>
                    {plan.grasaInicial && (
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold">{plan.grasaInicial}%</p>
                        <p className="text-sm text-muted-foreground">Grasa Inicial</p>
                      </div>
                    )}
                    {plan.muscularInicial && (
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold">{plan.muscularInicial}kg</p>
                        <p className="text-sm text-muted-foreground">Masa Muscular Inicial</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Próximas Recomendaciones */}
          {plan.resumenRecomendaciones?.proximasRecomendaciones && plan.resumenRecomendaciones.proximasRecomendaciones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Próximas Recomendaciones Prioritarias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.resumenRecomendaciones.proximasRecomendaciones.map((rec) => (
                    <div key={rec.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg">{rec.iconoProducto}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{rec.tituloRecomendacion}</p>
                        <p className="text-xs text-muted-foreground">{rec.timingRecomendado}</p>
                      </div>
                      <Badge variant="destructive">
                        {getPrioridadBadge(rec.prioridad).label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-6 border-t">
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Compartir Plan
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Descargar PDF
        </Button>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Editar Plan
        </Button>
      </div>
    </div>
  );
};

export default PlanNutricionalDetails;