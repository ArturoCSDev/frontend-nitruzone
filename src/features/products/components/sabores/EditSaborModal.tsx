// src/features/products/components/sabores/EditSaborModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Loader2, Palette } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { useUpdateSabor } from '../../hooks/useUpdateSabor';
import { UpdateSaborRequest, Sabor } from '../../types/product-api.types';

const editSaborSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  descripcion: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

type EditSaborFormData = z.infer<typeof editSaborSchema>;

interface EditSaborModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sabor: Sabor | null;
}

export const EditSaborModal = ({ open, onOpenChange, sabor }: EditSaborModalProps) => {
  const updateMutation = useUpdateSabor();

  const form = useForm<EditSaborFormData>({
    resolver: zodResolver(editSaborSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = form;

  // Cargar datos del sabor al abrir el modal
  useEffect(() => {
    if (sabor && open) {
      setValue('nombre', sabor.nombre);
      setValue('descripcion', sabor.descripcion || '');
    }
  }, [sabor, open, setValue]);

  const onSubmit = async (data: EditSaborFormData) => {
    if (!sabor) return;

    const requestData: UpdateSaborRequest = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || null,
    };

    updateMutation.mutate(
      { id: sabor.id, data: requestData },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (!sabor) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-500" />
            Editar Sabor
          </DialogTitle>
          <DialogDescription>
            Modifica la información del sabor "{sabor.nombre}".
          </DialogDescription>
        </DialogHeader>

        {/* Información actual del sabor */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <p className="text-sm font-medium">Información actual:</p>
          <div className="flex items-center gap-2">
            <Badge variant={sabor.activo ? 'default' : 'secondary'}>
              {sabor.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>ID: {sabor.id}</p>
            <p>Creado: {new Date(sabor.fechaCreacion).toLocaleDateString()}</p>
            {sabor.fechaActualizacion && (
              <p>Última actualización: {new Date(sabor.fechaActualizacion).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Sabor *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Vainilla, Chocolate, Fresa..."
              {...register('nombre')}
              className={errors.nombre ? 'border-destructive' : ''}
            />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe las características del sabor..."
              rows={3}
              {...register('descripcion')}
              className={errors.descripcion ? 'border-destructive' : ''}
            />
            {errors.descripcion && (
              <p className="text-sm text-destructive">{errors.descripcion.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              La descripción ayuda a los clientes a entender mejor el sabor
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Palette className="w-4 h-4 mr-2" />
                  Actualizar Sabor
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};