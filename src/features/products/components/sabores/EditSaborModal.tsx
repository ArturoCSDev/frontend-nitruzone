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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useUpdateSabores } from '../../hooks/useUpdateSabores';
import { UpdateSaborRequest, SaborItem } from '../../types/product-api.types';

const editSaborSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  descripcion: z
    .string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  activo: z.boolean(),
});

type EditSaborFormData = z.infer<typeof editSaborSchema>;

interface EditSaborModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sabor: SaborItem | null;
}

export const EditSaborModal = ({ open, onOpenChange, sabor }: EditSaborModalProps) => {
  const updateMutation = useUpdateSabores();

  const form = useForm<EditSaborFormData>({
    resolver: zodResolver(editSaborSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      activo: true,
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = form;

  // Cargar datos del sabor al abrir el modal
  useEffect(() => {
    if (sabor && open) {
      setValue('nombre', sabor.nombre);
      setValue('descripcion', sabor.descripcion || '');
      setValue('activo', sabor.activo);
    }
  }, [sabor, open, setValue]);

  const onSubmit = async (data: EditSaborFormData) => {
    if (!sabor) return;

    const requestData: UpdateSaborRequest = {
      nombre: data.nombre,
      descripcion: data.descripcion || undefined,
      activo: data.activo,
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
            <Palette className="w-5 h-5 text-primary" />
            Editar Sabor
          </DialogTitle>
          <DialogDescription>
            Modifica la información del sabor "{sabor.nombre}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Información del sabor */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <p className="text-sm font-medium">Información actual:</p>
            <p className="text-xs text-muted-foreground">ID: {sabor.id}</p>
            <p className="text-xs text-muted-foreground">
              Creado: {new Date(sabor.fechaCreacion).toLocaleDateString()}
            </p>
            {sabor.fechaActualizacion && (
              <p className="text-xs text-muted-foreground">
                Última actualización: {new Date(sabor.fechaActualizacion).toLocaleDateString()}
              </p>
            )}
            {sabor.productCount !== undefined && (
              <p className="text-xs text-muted-foreground">
                Productos asociados: {sabor.productCount}
              </p>
            )}
          </div>

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
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label>Estado del Sabor</Label>
            <Select 
              value={watch('activo') ? 'true' : 'false'} 
              onValueChange={(value) => setValue('activo', value === 'true')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            {sabor.productCount !== undefined && sabor.productCount > 0 && watch('activo') === false && (
              <p className="text-xs text-orange-600">
                ⚠️ Este sabor está asociado a {sabor.productCount} producto(s). 
                Desactivarlo puede afectar la disponibilidad de esos productos.
              </p>
            )}
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
              className="bg-primary hover:bg-primary/90"
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