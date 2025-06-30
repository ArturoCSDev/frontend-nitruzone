import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../api/product.api';
import { CreateSaborRequest } from '../types/product-api.types';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useRegisterSabores = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaborRequest) => productApi.createSabor(data),
    onSuccess: (data) => {
      toast.success('¡Sabor registrado exitosamente!', {
        description: `${data.sabor.nombre} ha sido añadido al catálogo`,
        duration: 5000,
      });
      
      // Invalidar cache de listados
      queryClient.invalidateQueries({ queryKey: ['sabores'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al registrar sabor', {
        description: message,
        duration: 6000,
      });
    },
  });
};