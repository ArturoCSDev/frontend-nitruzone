import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';

interface UseListSaboresParams {
  search?: string;
  onlyActive?: boolean;
}

export const useListSabores = (params?: UseListSaboresParams) => {
  return useQuery({
    queryKey: ['sabores', params],
    queryFn: () => productApi.listSabores(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};