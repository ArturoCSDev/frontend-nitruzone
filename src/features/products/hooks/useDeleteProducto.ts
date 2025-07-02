import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../api/product.api';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProducto(id),
    onSuccess: () => {
      toast.success('Producto eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
    onError: (error) => {
      toast.error('Error al eliminar producto', {
        description: getErrorMessage(error),
      });
    },
  });
};
