import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../api/product.api';
import { UpdateProductoRequest } from '../types/product-api.types';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductoRequest }) => 
      productApi.updateProducto(id, data),
    onSuccess: (data) => {
      toast.success('Producto actualizado exitosamente', {
        description: data.nombre,
      });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['producto'] });
    },
    onError: (error) => {
      toast.error('Error al actualizar producto', {
        description: getErrorMessage(error),
      });
    },
  });
};
