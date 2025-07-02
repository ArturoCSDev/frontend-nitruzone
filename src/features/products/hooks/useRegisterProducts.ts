// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { productApi } from '../api/product.api';
// import { CreateProductoRequest } from '../types/product-api.types';
// import { getErrorMessage } from '../../../lib/api/error-handlers';

// export const useRegisterProducts = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: CreateProductoRequest) => productApi.createProducto(data),
//     onSuccess: (data) => {
//       toast.success('¡Producto registrado exitosamente!', {
//         description: `${data.producto.nombre} ha sido añadido al inventario`,
//         duration: 5000,
//       });
      
//       // Invalidar cache de listados relacionados
//       queryClient.invalidateQueries({ queryKey: ['products'] });
//       queryClient.invalidateQueries({ queryKey: ['sabores'] });
//       queryClient.invalidateQueries({ queryKey: ['categorias'] });
//     },
//     onError: (error) => {
//       const message = getErrorMessage(error);
//       toast.error('Error al registrar producto', {
//         description: message,
//         duration: 6000,
//       });
//     },
//   });
// };