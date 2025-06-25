import { useQuery } from '@tanstack/react-query';
// import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
// import { getErrorMessage } from '../../../lib/api/error-handlers';

interface UseListClientsParams {
  search?: string;
  onlyActive?: boolean;
  onlyCompleteProfiles?: boolean;
}

export const useListClients = (params?: UseListClientsParams) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => authApi.listClients(params),
    // Configuraciones adicionales
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
