import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../api/product.api';
import { CreateSaborRequest } from '../types/product-api.types';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useCreateSabor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaborRequest) => productApi.createSabor(data),
    onSuccess: (data) => {
      toast.success('Sabor creado exitosamente', {
        description: data.nombre,
      });
      queryClient.invalidateQueries({ queryKey: ['sabores'] });
    },
    onError: (error) => {
      toast.error('Error al crear sabor', {
        description: getErrorMessage(error),
      });
    },
  });
};
