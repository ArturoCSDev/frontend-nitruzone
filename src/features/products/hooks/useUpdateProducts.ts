// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { productApi } from '../api/product.api';
// import { UpdateProductoRequest } from '../types/product-api.types';
// import { getErrorMessage } from '../../../lib/api/error-handlers';

// export const useUpdateProducts = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: UpdateProductoRequest }) => 
//       productApi.updateProducto(id, data),
//     onSuccess: (data) => {
//       toast.success('¡Producto actualizado exitosamente!', {
//         description: `${data.producto.nombre} ha sido modificado en el inventario`,
//         duration: 5000,
//       });
      
//       // Invalidar cache de listados relacionados
//       queryClient.invalidateQueries({ queryKey: ['products'] });
//       queryClient.invalidateQueries({ queryKey: ['sabores'] });
//       queryClient.invalidateQueries({ queryKey: ['categorias'] });
//     },
//     onError: (error) => {
//       const message = getErrorMessage(error);
//       toast.error('Error al actualizar producto', {
//         description: message,
//         duration: 6000,
//       });
//     },
//   });
// };
