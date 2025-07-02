import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../api/product.api';
import { CreateProductoRequest } from '../types/product-api.types';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductoRequest) => productApi.createProducto(data),
    onSuccess: (data) => {
      toast.success('Producto creado exitosamente', {
        description: data.nombre,
      });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
    onError: (error) => {
      toast.error('Error al crear producto', {
        description: getErrorMessage(error),
      });
    },
  });
};
