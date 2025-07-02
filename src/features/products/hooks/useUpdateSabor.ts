import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../api/product.api';
import { UpdateSaborRequest } from '../types/product-api.types';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useUpdateSabor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSaborRequest }) => 
      productApi.updateSabor(id, data),
    onSuccess: (data) => {
      toast.success('Sabor actualizado exitosamente', {
        description: data.nombre,
      });
      queryClient.invalidateQueries({ queryKey: ['sabores'] });
      queryClient.invalidateQueries({ queryKey: ['sabor'] });
    },
    onError: (error) => {
      toast.error('Error al actualizar sabor', {
        description: getErrorMessage(error),
      });
    },
  });
};
