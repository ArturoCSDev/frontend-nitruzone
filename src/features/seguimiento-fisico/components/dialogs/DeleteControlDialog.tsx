// src/features/seguimiento-fisico/components/dialogs/DeleteControlDialog.tsx
import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

// Shadcn UI Components
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Hooks
import { useControlFisico } from '../../hooks/useSeguimientoFisico';
import { useDeleteControlFisico } from '../../hooks/useControlFisicoMutations';

interface DeleteControlDialogProps {
  open: boolean;
  onOpenChange: () => void;
  controlId: string;
  onSuccess: () => void;
}

export const DeleteControlDialog: React.FC<DeleteControlDialogProps> = ({
  open,
  onOpenChange,
  controlId,
  onSuccess
}) => {
  const { data: control, isLoading } = useControlFisico(controlId);
  const deleteControl = useDeleteControlFisico();

  const handleDelete = () => {
    deleteControl.mutate(controlId, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMetric = (value: number | null, unit: string) => {
    return value ? `${value}${unit}` : 'No registrado';
  };

  if (isLoading) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </AlertDialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
          </div>
          <AlertDialogFooter>
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (!control) return null;

  const { controlFisico, cliente } = control;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Eliminar Control Físico
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El control físico será eliminado permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Información del Control a Eliminar */}
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Fecha del Control</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(controlFisico.fechaControl)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {controlFisico.hasCompleteMetrics && (
                    <Badge variant="default">Métricas Completas</Badge>
                  )}
                  {controlFisico.hasSubjectiveEvaluation && (
                    <Badge variant="secondary">Evaluación Subjetiva</Badge>
                  )}
                </div>
              </div>

              {cliente && (
                <div>
                  <p className="font-medium">Cliente</p>
                  <p className="text-sm text-muted-foreground">{cliente.nombre}</p>
                </div>
              )}

              {/* Resumen de métricas */}
              {(controlFisico.peso || controlFisico.grasaCorporal || controlFisico.masaMuscular) && (
                <div>
                  <p className="font-medium">Métricas registradas</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Peso: {formatMetric(controlFisico.peso, 'kg')}</span>
                    <span>Grasa: {formatMetric(controlFisico.grasaCorporal, '%')}</span>
                    <span>Músculo: {formatMetric(controlFisico.masaMuscular, 'kg')}</span>
                  </div>
                </div>
              )}

              {/* Evaluación subjetiva */}
              {(controlFisico.nivelEnergia || controlFisico.estadoAnimo) && (
                <div>
                  <p className="font-medium">Evaluación subjetiva</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Energía: {controlFisico.nivelEnergia || 'No registrada'}</span>
                    <span>Ánimo: {controlFisico.estadoAnimo || 'No registrado'}</span>
                  </div>
                </div>
              )}

              {/* Notas */}
              {controlFisico.notas && (
                <div>
                  <p className="font-medium">Notas</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {controlFisico.notas}
                  </p>
                </div>
              )}

              {/* Realizado por */}
              {controlFisico.realizadoPor && (
                <div>
                  <p className="font-medium">Realizado por</p>
                  <p className="text-sm text-muted-foreground">{controlFisico.realizadoPor}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Advertencia adicional */}
        <div className="bg-destructive/10 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-sm font-medium">Advertencia</p>
          </div>
          <p className="text-sm text-destructive/80 mt-1">
            Se perderán todos los datos del control físico incluyendo métricas, evaluaciones y notas.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteControl.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteControl.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Control
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};