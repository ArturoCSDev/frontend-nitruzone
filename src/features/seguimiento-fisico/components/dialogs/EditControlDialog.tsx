// src/features/seguimiento-fisico/components/dialogs/EditControlDialog.tsx
import React, { useState, useEffect } from 'react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Hooks
import { useControlFisico } from '../../hooks/useSeguimientoFisico';
import { useUpdateControlFisico } from '../../hooks/useControlFisicoMutations';

// Types
import { UpdateControlFisicoRequest } from '../../types/seguimiento-fisico-api.types';

interface EditControlDialogProps {
  open: boolean;
  onOpenChange: () => void;
  controlId: string;
  onSuccess: () => void;
}

export const EditControlDialog: React.FC<EditControlDialogProps> = ({
  open,
  onOpenChange,
  controlId,
  onSuccess
}) => {
  const { data: control, isLoading } = useControlFisico(controlId);
  const updateControl = useUpdateControlFisico();
  const [formData, setFormData] = useState<UpdateControlFisicoRequest>({});

  useEffect(() => {
    if (control) {
      setFormData({
        peso: control.controlFisico.peso || undefined,
        grasaCorporal: control.controlFisico.grasaCorporal || undefined,
        masaMuscular: control.controlFisico.masaMuscular || undefined,
        nivelEnergia: control.controlFisico.nivelEnergia || undefined,
        estadoAnimo: control.controlFisico.estadoAnimo || undefined,
        notas: control.controlFisico.notas || undefined,
        realizadoPor: control.controlFisico.realizadoPor || undefined,
        proximaCita: control.controlFisico.proximaCita || undefined,
      });
    }
  }, [control]);

  const handleSubmit = () => {
    updateControl.mutate({
      controlId,
      data: formData
    }, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };

  const handleInputChange = (field: keyof UpdateControlFisicoRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!control) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Control Físico</DialogTitle>
          <DialogDescription>
            Modifica los datos del control del {formatDate(control.controlFisico.fechaControl)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información del Control */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Fecha del Control</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(control.controlFisico.fechaControl)}
                </p>
              </div>
              <div className="flex gap-2">
                {control.controlFisico.hasCompleteMetrics && (
                  <Badge variant="default">Métricas Completas</Badge>
                )}
                {control.controlFisico.hasSubjectiveEvaluation && (
                  <Badge variant="secondary">Evaluación Subjetiva</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Métricas Físicas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Métricas Físicas</h3>
              <Badge variant="outline">Opcional</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  placeholder="70.5"
                  value={formData.peso || ''}
                  onChange={(e) => handleInputChange('peso', parseFloat(e.target.value) || undefined)}
                />
              </div>
              <div>
                <Label htmlFor="grasaCorporal">Grasa Corporal (%)</Label>
                <Input
                  id="grasaCorporal"
                  type="number"
                  step="0.1"
                  min="3"
                  max="50"
                  placeholder="15.2"
                  value={formData.grasaCorporal || ''}
                  onChange={(e) => handleInputChange('grasaCorporal', parseFloat(e.target.value) || undefined)}
                />
              </div>
              <div>
                <Label htmlFor="masaMuscular">Masa Muscular (kg)</Label>
                <Input
                  id="masaMuscular"
                  type="number"
                  step="0.1"
                  min="20"
                  max="100"
                  placeholder="32.8"
                  value={formData.masaMuscular || ''}
                  onChange={(e) => handleInputChange('masaMuscular', parseFloat(e.target.value) || undefined)}
                />
              </div>
            </div>
          </div>

          {/* Evaluación Subjetiva */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Evaluación Subjetiva</h3>
              <Badge variant="outline">Opcional</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nivelEnergia">Nivel de Energía</Label>
                <Select 
                  value={formData.nivelEnergia?.toString() || ''}
                  onValueChange={(value) => handleInputChange('nivelEnergia', parseInt(value) || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Muy Bajo</SelectItem>
                    <SelectItem value="2">2 - Bajo</SelectItem>
                    <SelectItem value="3">3 - Moderado</SelectItem>
                    <SelectItem value="4">4 - Alto</SelectItem>
                    <SelectItem value="5">5 - Muy Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estadoAnimo">Estado de Ánimo</Label>
                <Select 
                  value={formData.estadoAnimo?.toString() || ''}
                  onValueChange={(value) => handleInputChange('estadoAnimo', parseInt(value) || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Muy Mal</SelectItem>
                    <SelectItem value="2">2 - Mal</SelectItem>
                    <SelectItem value="3">3 - Regular</SelectItem>
                    <SelectItem value="4">4 - Bien</SelectItem>
                    <SelectItem value="5">5 - Muy Bien</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Información Administrativa */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Información Administrativa</h3>
              <Badge variant="outline">Opcional</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="realizadoPor">Realizado por</Label>
                <Input
                  id="realizadoPor"
                  placeholder="Nombre del profesional"
                  value={formData.realizadoPor || ''}
                  onChange={(e) => handleInputChange('realizadoPor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="proximaCita">Próxima Cita</Label>
                <Input
                  id="proximaCita"
                  type="date"
                  value={formData.proximaCita || ''}
                  onChange={(e) => handleInputChange('proximaCita', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                placeholder="Observaciones y comentarios adicionales..."
                value={formData.notas || ''}
                onChange={(e) => handleInputChange('notas', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onOpenChange}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={updateControl.isPending}>
              {updateControl.isPending ? 'Guardando...' : 'Actualizar Control'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};