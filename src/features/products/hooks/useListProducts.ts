import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';
import { ListProductosParams } from '../types/product-api.types';

export const useListProductos = (params?: ListProductosParams) => {
  return useQuery({
    queryKey: ['productos', params],
    queryFn: () => productApi.listProductos(params),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
