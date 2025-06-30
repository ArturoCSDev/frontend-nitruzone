import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';

export const useListCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => productApi.listCategorias(),
    staleTime: 10 * 60 * 1000, // 10 minutos (datos más estables)
    refetchOnWindowFocus: false,
  });
};