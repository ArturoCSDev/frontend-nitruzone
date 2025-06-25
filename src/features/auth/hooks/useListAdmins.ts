import { useQuery } from '@tanstack/react-query';
// import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
// import { getErrorMessage } from '../../../lib/api/error-handlers';

interface UseListAdminsParams {
  search?: string;
  onlyActive?: boolean;
  departamento?: string;
  minAccessLevel?: number;
}

export const useListAdmins = (params?: UseListAdminsParams) => {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: () => authApi.listAdmins(params),
    // onError: (error) => {
    //   const message = getErrorMessage(error);
    //   toast.error(`Error al cargar administradores: ${message}`);
    // },
    // Configuraciones adicionales
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
