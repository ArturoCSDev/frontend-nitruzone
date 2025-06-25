import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { RegisterAdminRequest } from '../types/auth-api.types';
import { getErrorMessage } from '../../../lib/api/error-handlers';

export const useRegisterAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterAdminRequest) => authApi.registerAdmin(data),
    onSuccess: (data) => {
      toast.success('¡Administrador registrado exitosamente!', {
        description: `${data.user.nombreCompleto} puede ahora acceder al sistema`,
        duration: 5000,
      });
      
      // Invalidar cache de listados de administradores
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al registrar administrador', {
        description: message,
        duration: 6000,
      });
    },
  });
};