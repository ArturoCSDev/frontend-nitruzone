import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';

interface UseListProductsParams {
  search?: string;
  categoriaId?: string;
  onlyActive?: boolean;
  onlyInStock?: boolean;
  onlyLowStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export const useListProducts = (params?: UseListProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.listProductos(params),
    staleTime: 2 * 60 * 1000, // 2 minutos (datos más dinámicos por stock)
    refetchOnWindowFocus: false,
  });
};