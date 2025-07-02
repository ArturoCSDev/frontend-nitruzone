import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';
import { ListSaboresParams } from '../types/product-api.types';

export const useListSabores = (params?: ListSaboresParams) => {
  return useQuery({
    queryKey: ['sabores', params],
    queryFn: () => productApi.listSabores(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
