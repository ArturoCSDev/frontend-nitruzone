import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../api/product.api';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useDeleteSabor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteSabor(id),
    onSuccess: () => {
      toast.success('Sabor eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['sabores'] });
    },
    onError: (error) => {
      toast.error('Error al eliminar sabor', {
        description: getErrorMessage(error),
      });
    },
  });
};
