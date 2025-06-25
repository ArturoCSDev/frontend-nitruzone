import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authSessionService } from '../../../services/session/auth-session.service';

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // Solo limpiar sesión local
      authSessionService.clearSession();
    },
    onSuccess: () => {
      toast.success('Su sesión ha finalizado');
      navigate('/login');
    },
    onError: () => {
      toast.error('Error al cerrar sesión');
    },
  });
};
