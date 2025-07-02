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

import { useCreateSabor } from '../../hooks/useCreateSabor';
import { CreateSaborRequest } from '../../types/product-api.types';

const createSaborSchema = z.object({
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

type CreateSaborFormData = z.infer<typeof createSaborSchema>;

interface CreateSaborModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSaborModal = ({ open, onOpenChange }: CreateSaborModalProps) => {
  const createMutation = useCreateSabor();

  const form = useForm<CreateSaborFormData>({
    resolver: zodResolver(createSaborSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = form;

  const onSubmit = async (data: CreateSaborFormData) => {
    const requestData: CreateSaborRequest = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || null,
    };

    createMutation.mutate(requestData, {
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
            <Palette className="w-5 h-5 text-orange-500" />
            Crear Nuevo Sabor
          </DialogTitle>
          <DialogDescription>
            Añade un nuevo sabor que podrá ser utilizado en los productos.
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
            <p className="text-xs text-muted-foreground">
              La descripción ayuda a los clientes a entender mejor el sabor
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {createMutation.isPending ? (
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