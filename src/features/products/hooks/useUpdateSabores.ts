// useUpdateSabores.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../api/product.api';
import { UpdateSaborRequest } from '../types/product-api.types';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useUpdateSabores = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSaborRequest }) => 
      productApi.updateSabor(id, data),
    onSuccess: (data) => {
      toast.success('¡Sabor actualizado exitosamente!', {
        description: `${data.sabor.nombre} ha sido modificado`,
        duration: 5000,
      });
      
      // Invalidar cache de listados
      queryClient.invalidateQueries({ queryKey: ['sabores'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Por relación
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al actualizar sabor', {
        description: message,
        duration: 6000,
      });
    },
  });
};
