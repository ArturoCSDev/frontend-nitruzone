// src/features/seguimiento-fisico/components/dialogs/CreateControlDialog.tsx
import React, { useState } from 'react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Hooks
import { useCreateControlFisico } from '../../hooks/useCreateControlFisico';

// Types
import { CreateControlFisicoRequest } from '../../types/seguimiento-fisico-api.types';

interface CreateControlDialogProps {
  open: boolean;
  onOpenChange: () => void;
  clienteId: string;
  onSuccess: () => void;
}

export const CreateControlDialog: React.FC<CreateControlDialogProps> = ({
  open,
  onOpenChange,
  clienteId,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CreateControlFisicoRequest>({
    clienteId,
    fechaControl: new Date().toISOString().split('T')[0],
  });

  const createControl = useCreateControlFisico();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createControl.mutate(formData, {
      onSuccess: () => {
        onSuccess();
        setFormData({ clienteId, fechaControl: new Date().toISOString().split('T')[0] });
      }
    });
  };

  // El tipo de value refleja los posibles tipos de los campos de CreateControlFisicoRequest
const handleInputChange = (
  field: keyof CreateControlFisicoRequest,
  value: string | number | undefined | Record<string, unknown>
) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Control Físico</DialogTitle>
          <DialogDescription>
            Registra un nuevo control físico para el cliente
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaControl">Fecha del Control *</Label>
                <Input
                  id="fechaControl"
                  type="date"
                  value={formData.fechaControl}
                  onChange={(e) => handleInputChange('fechaControl', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="realizadoPor">Realizado por</Label>
                <Input
                  id="realizadoPor"
                  placeholder="Nombre del profesional"
                  value={formData.realizadoPor || ''}
                  onChange={(e) => handleInputChange('realizadoPor', e.target.value)}
                />
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

          {/* Notas y Próxima Cita */}
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

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onOpenChange}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={createControl.isPending}>
              {createControl.isPending ? 'Guardando...' : 'Crear Control'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};