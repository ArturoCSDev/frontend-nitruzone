import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../api/product.api';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProducto(id),
    onSuccess: (data) => {
      toast.success(data.message, {
        duration: 5000,
      });
      
      // Invalidar cache de listados relacionados
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['sabores'] });
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message, {
        duration: 6000,
      });
    },
  });
};