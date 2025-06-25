import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../../auth/api/auth.api';
import { RegisterClientRequest } from '../../auth/types/auth-api.types';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useRegisterClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterClientRequest) => authApi.registerClient(data),
    onSuccess: (data) => {
      toast.success('¡Cliente registrado exitosamente!', {
        description: `${data.user.nombreCompleto} puede ahora acceder al sistema`,
        duration: 5000,
      });
      
      // Invalidar cache de listados
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al registrar cliente', {
        description: message,
        duration: 6000,
      });
    },
  });
};