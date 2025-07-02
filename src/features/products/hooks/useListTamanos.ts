import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';
import { ListTamanosParams } from '../types/product-api.types';

export const useListTamanos = (params?: ListTamanosParams) => {
  return useQuery({
    queryKey: ['tamanos', params],
    queryFn: () => productApi.listTamanos(params),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
