import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';

export const useListTamanos = () => {
  return useQuery({
    queryKey: ['tamanos'],
    queryFn: () => productApi.listTamanos(),
    staleTime: 10 * 60 * 1000, // 10 minutos (datos más estables)
    refetchOnWindowFocus: false,
  });
};