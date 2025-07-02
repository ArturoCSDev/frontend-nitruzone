import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';
import { ListCategoriasParams } from '../types/product-api.types';

export const useListCategorias = (params?: ListCategoriasParams) => {
  return useQuery({
    queryKey: ['categorias', params],
    queryFn: () => productApi.listCategorias(params),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
