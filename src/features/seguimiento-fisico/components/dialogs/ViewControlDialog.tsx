// src/features/seguimiento-fisico/components/dialogs/ViewControlDialog.tsx
import React from 'react';
import { Calendar, User, Activity, Heart, FileText, Clock } from 'lucide-react';

// Shadcn UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Hooks
import { useControlFisico } from '../../hooks/useSeguimientoFisico';

interface ViewControlDialogProps {
  open: boolean;
  onOpenChange: () => void;
  controlId: string;
}

export const ViewControlDialog: React.FC<ViewControlDialogProps> = ({
  open,
  onOpenChange,
  controlId
}) => {
  const { data: control, isLoading } = useControlFisico(controlId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMetric = (value: number | null, unit: string) => {
    return value ? `${value}${unit}` : 'No registrado';
  };

  const getEnergyLevel = (nivel: number | null) => {
    if (!nivel) return 'No registrado';
    const levels = ['', 'Muy Bajo', 'Bajo', 'Moderado', 'Alto', 'Muy Alto'];
    return levels[nivel] || 'No registrado';
  };

  const getEnergyBadge = (nivel: number | null) => {
    if (!nivel) return <Badge variant="outline">No registrado</Badge>;
    if (nivel >= 4) return <Badge variant="default">Alto</Badge>;
    if (nivel >= 3) return <Badge variant="secondary">Medio</Badge>;
    return <Badge variant="destructive">Bajo</Badge>;
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!control) return null;

  const { controlFisico, cliente } = control;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Control Físico - {formatDate(controlFisico.fechaControl)}
          </DialogTitle>
          <DialogDescription>
            Información detallada del control físico y evaluación
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha del Control</p>
                  <p className="font-medium">{formatDate(controlFisico.fechaControl)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado del Control</p>
                  <div className="flex gap-2 mt-1">
                    {controlFisico.hasCompleteMetrics && (
                      <Badge variant="default">Métricas Completas</Badge>
                    )}
                    {controlFisico.hasSubjectiveEvaluation && (
                      <Badge variant="secondary">Evaluación Subjetiva</Badge>
                    )}
                    {controlFisico.isRecentControl && (
                      <Badge variant="outline">Reciente</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Días desde control</p>
                  <p className="font-medium">{controlFisico.diasDesdeControl} días</p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Cliente */}
            {cliente && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="font-medium">{cliente.nombre}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Edad</p>
                      <p className="font-medium">{cliente.edad || 'No registrada'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Género</p>
                      <p className="font-medium">{cliente.genero || 'No registrado'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Perfil</p>
                    <Badge variant={cliente.hasCompleteProfile ? "default" : "outline"}>
                      {cliente.hasCompleteProfile ? 'Completo' : 'Incompleto'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Métricas Físicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Métricas Físicas
              </CardTitle>
              <CardDescription>
                Mediciones corporales y composición física
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{formatMetric(controlFisico.peso, 'kg')}</p>
                  <p className="text-sm text-muted-foreground">Peso Corporal</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{formatMetric(controlFisico.grasaCorporal, '%')}</p>
                  <p className="text-sm text-muted-foreground">Grasa Corporal</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{formatMetric(controlFisico.masaMuscular, 'kg')}</p>
                  <p className="text-sm text-muted-foreground">Masa Muscular</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluación Subjetiva */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Evaluación Subjetiva
              </CardTitle>
              <CardDescription>
                Percepción personal de bienestar y energía
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Nivel de Energía</p>
                    {getEnergyBadge(controlFisico.nivelEnergia)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getEnergyLevel(controlFisico.nivelEnergia)}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Estado de Ánimo</p>
                    {getEnergyBadge(controlFisico.estadoAnimo)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getEnergyLevel(controlFisico.estadoAnimo)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notas y Observaciones */}
          {controlFisico.notas && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notas y Observaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{controlFisico.notas}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información Administrativa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Información Administrativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Realizado por</p>
                  <p className="font-medium">{controlFisico.realizadoPor || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Próxima Cita</p>
                  <p className="font-medium">
                    {controlFisico.proximaCita 
                      ? formatDate(controlFisico.proximaCita)
                      : 'No programada'
                    }
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Creado el</p>
                  <p>{formatDate(controlFisico.fechaCreacion)} a las {formatTime(controlFisico.fechaCreacion)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Última actualización</p>
                  <p>{formatDate(controlFisico.fechaActualizacion)} a las {formatTime(controlFisico.fechaActualizacion)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medidas Adicionales (si existen) */}
          {controlFisico.medidasAdicionales && Object.keys(controlFisico.medidasAdicionales).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Medidas Adicionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(controlFisico.medidasAdicionales).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">{key}</p>
                      <p className="font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};