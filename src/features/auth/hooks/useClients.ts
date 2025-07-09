// src/features/auth/hooks/useClients.ts
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';

// =============================================
// OBTENER CLIENTE ESPECÍFICO POR ID DE CLIENTE
// =============================================

export const useClient = (clienteId: string) => {
  return useQuery({
    queryKey: ['auth', 'client', clienteId],
    queryFn: async () => {
      const response = await authApi.listClients({ clientId: clienteId });
      return response.users[0] || null;
    },
    enabled: !!clienteId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};