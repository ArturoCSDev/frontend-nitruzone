// src/features/products/components/sabores/CreateSaborModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

import { useRegisterSabores } from '../../hooks/useRegisterSabores';
import { CreateSaborRequest } from '../../types/product-api.types';

const createSaborSchema = z.object({
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
  activo: z.boolean().default(true),
});

type CreateSaborFormData = z.infer<typeof createSaborSchema>;

interface CreateSaborModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSaborModal = ({ open, onOpenChange }: CreateSaborModalProps) => {
  const registerMutation = useRegisterSabores();

  const form = useForm<CreateSaborFormData>({
    resolver: zodResolver(createSaborSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      activo: true,
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = form;

  const onSubmit = async (data: CreateSaborFormData) => {
    const requestData: CreateSaborRequest = {
      nombre: data.nombre,
      descripcion: data.descripcion || undefined,
      activo: data.activo,
    };

    registerMutation.mutate(requestData, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Crear Nuevo Sabor
          </DialogTitle>
          <DialogDescription>
            Añade un nuevo sabor al catálogo de productos disponibles.
          </DialogDescription>
        </DialogHeader>

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
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={registerMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={registerMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Palette className="w-4 h-4 mr-2" />
                  Crear Sabor
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};