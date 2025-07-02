import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';

export const useGetProductoById = (id: string) => {
  return useQuery({
    queryKey: ['producto', id],
    queryFn: () => productApi.getProductoById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
