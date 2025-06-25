// src/features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { authSessionService } from '../../../services/session/auth-session.service';
import { useAuthStore } from '../stores/auth.store';
import { getErrorMessage } from '../../../lib/api/error-handlers';
import { LoginRequest } from '../types/auth-api.types';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      // Guardar en session service
      authSessionService.setSession(data.token, data.user, data.profile);
      
      // Actualizar store
      setAuth(data.user, data.profile);
      
      // Toast de éxito
      toast.success(`¡Bienvenido ${data.user.nombreCompleto}!`, {
        description: `Accediendo como ${data.user.rol.toLowerCase()}`,
        duration: 3000,
      });
      
      // Redirigir según rol
      if (data.user.rol === 'ADMINISTRADOR') {
        navigate('/panel/register-client');
      } else {
        navigate('/club');
      }
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al iniciar sesión', {
        description: message,
        duration: 5000,
      });
    },
  });
};