// src/features/products/components/products/EditProductModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Loader2, Package, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { useUpdateProducts } from '../../hooks/useUpdateProducts';
import { useListCategorias } from '../../hooks/useListCategorias';
import { useListSabores } from '../../hooks/useListSabores';
import { useListTamanos } from '../../hooks/useListTamanos';
import { UpdateProductoRequest, ProductoItem } from '../../types/product-api.types';

const editProductSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  descripcion: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  precio: z
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .min(0.01, 'El precio debe ser mayor a 0')
    .max(9999.99, 'El precio no puede exceder S/ 9,999.99'),
  stock: z
    .number({ invalid_type_error: 'El stock debe ser un número' })
    .min(0, 'El stock no puede ser negativo')
    .int('El stock debe ser un número entero'),
  stockMinimo: z
    .number({ invalid_type_error: 'El stock mínimo debe ser un número' })
    .min(0, 'El stock mínimo no puede ser negativo')
    .int('El stock mínimo debe ser un número entero'),
  categoriaId: z
    .string()
    .min(1, 'Debe seleccionar una categoría'),
  activo: z.boolean(),
});

type EditProductFormData = z.infer<typeof editProductSchema>;

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductoItem | null;
}

export const EditProductModal = ({ open, onOpenChange, product }: EditProductModalProps) => {
  const [selectedSabores, setSelectedSabores] = useState<string[]>([]);
  const [selectedTamanos, setSelectedTamanos] = useState<string[]>([]);

  const updateMutation = useUpdateProducts();
  const { data: categorias } = useListCategorias();
  const { data: sabores } = useListSabores({ onlyActive: true });
  const { data: tamanos } = useListTamanos();

  const form = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      stockMinimo: 5,
      categoriaId: '',
      activo: true,
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = form;

  // Cargar datos del producto al abrir el modal
  useEffect(() => {
    if (product && open) {
      setValue('nombre', product.nombre);
      setValue('descripcion', product.descripcion || '');
      setValue('precio', product.precio);
      setValue('stock', product.stock);
      setValue('stockMinimo', product.stockMinimo);
      setValue('categoriaId', product.categoria.id);
      setValue('activo', product.activo);
      
      // Cargar sabores y tamaños seleccionados
      setSelectedSabores(product.sabores.map(s => s.id));
      setSelectedTamanos(product.tamanos.map(t => t.id));
    }
  }, [product, open, setValue]);

  const onSubmit = async (data: EditProductFormData) => {
    if (!product) return;

    const requestData: UpdateProductoRequest = {
      nombre: data.nombre,
      descripcion: data.descripcion || undefined,
      precio: data.precio,
      stock: data.stock,
      stockMinimo: data.stockMinimo,
      categoriaId: data.categoriaId,
      saboreIds: selectedSabores.length > 0 ? selectedSabores : undefined,
      tamanoIds: selectedTamanos.length > 0 ? selectedTamanos : undefined,
      activo: data.activo,
    };

    updateMutation.mutate(
      { id: product.id, data: requestData },
      {
        onSuccess: () => {
          reset();
          setSelectedSabores([]);
          setSelectedTamanos([]);
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    setSelectedSabores([]);
    setSelectedTamanos([]);
    onOpenChange(false);
  };

  const toggleSabor = (saborId: string) => {
    setSelectedSabores(prev => 
      prev.includes(saborId) 
        ? prev.filter(id => id !== saborId)
        : [...prev, saborId]
    );
  };

  const toggleTamano = (tamanoId: string) => {
    setSelectedTamanos(prev => 
      prev.includes(tamanoId) 
        ? prev.filter(id => id !== tamanoId)
        : [...prev, tamanoId]
    );
  };

  const removeSabor = (saborId: string) => {
    setSelectedSabores(prev => prev.filter(id => id !== saborId));
  };

  const removeTamano = (tamanoId: string) => {
    setSelectedTamanos(prev => prev.filter(id => id !== tamanoId));
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Editar Producto
          </DialogTitle>
          <DialogDescription>
            Modifica la información del producto "{product.nombre}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información del producto */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <p className="text-sm font-medium">Información actual:</p>
            <p className="text-xs text-muted-foreground">ID: {product.id}</p>
            <p className="text-xs text-muted-foreground">
              Creado: {new Date(product.fechaCreacion).toLocaleDateString()}
            </p>
            {product.fechaActualizacion && (
              <p className="text-xs text-muted-foreground">
                Última actualización: {new Date(product.fechaActualizacion).toLocaleDateString()}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={product.isOutOfStock ? 'destructive' : product.isLowStock ? 'secondary' : 'default'}>
                {product.isOutOfStock ? 'Sin Stock' : product.isLowStock ? 'Stock Bajo' : 'En Stock'}
              </Badge>
              <Badge variant={product.activo ? 'default' : 'secondary'}>
                {product.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Proteína Whey Premium 5lb"
                {...register('nombre')}
                className={errors.nombre ? 'border-destructive' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-destructive">{errors.nombre.message}</p>
              )}
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select 
                value={watch('categoriaId')}
                onValueChange={(value) => setValue('categoriaId', value)}
              >
                <SelectTrigger className={errors.categoriaId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias?.categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre} - {categoria.tipoProducto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoriaId && (
                <p className="text-sm text-destructive">{errors.categoriaId.message}</p>
              )}
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label>Estado del Producto</Label>
              <Select 
                value={watch('activo') ? 'true' : 'false'} 
                onValueChange={(value) => setValue('activo', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe las características y beneficios del producto..."
              rows={3}
              {...register('descripcion')}
              className={errors.descripcion ? 'border-destructive' : ''}
            />
            {errors.descripcion && (
              <p className="text-sm text-destructive">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Información de precio y stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Precio */}
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (S/) *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                placeholder="99.99"
                {...register('precio', { valueAsNumber: true })}
                className={errors.precio ? 'border-destructive' : ''}
              />
              {errors.precio && (
                <p className="text-sm text-destructive">{errors.precio.message}</p>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Actual *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="100"
                {...register('stock', { valueAsNumber: true })}
                className={errors.stock ? 'border-destructive' : ''}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Stock anterior: {product.stock}
              </p>
            </div>

            {/* Stock Mínimo */}
            <div className="space-y-2">
              <Label htmlFor="stockMinimo">Stock Mínimo *</Label>
              <Input
                id="stockMinimo"
                type="number"
                placeholder="5"
                {...register('stockMinimo', { valueAsNumber: true })}
                className={errors.stockMinimo ? 'border-destructive' : ''}
              />
              {errors.stockMinimo && (
                <p className="text-sm text-destructive">{errors.stockMinimo.message}</p>
              )}
            </div>
          </div>

          {/* Sabores */}
          <div className="space-y-3">
            <Label>Sabores Disponibles (opcional)</Label>
            {selectedSabores.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedSabores.map((saborId) => {
                  const sabor = sabores?.sabores.find(s => s.id === saborId);
                  return (
                    <Badge key={saborId} variant="secondary" className="flex items-center gap-1">
                      {sabor?.nombre}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeSabor(saborId)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
              {sabores?.sabores.map((sabor) => (
                <div key={sabor.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sabor-${sabor.id}`}
                    checked={selectedSabores.includes(sabor.id)}
                    onCheckedChange={() => toggleSabor(sabor.id)}
                  />
                  <Label 
                    htmlFor={`sabor-${sabor.id}`}
                    className="text-sm cursor-pointer truncate"
                  >
                    {sabor.nombre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tamaños */}
          <div className="space-y-3">
            <Label>Tamaños Disponibles (opcional)</Label>
            {selectedTamanos.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedTamanos.map((tamanoId) => {
                  const tamano = tamanos?.tamanos.find(t => t.id === tamanoId);
                  return (
                    <Badge key={tamanoId} variant="secondary" className="flex items-center gap-1">
                      {tamano?.nombre} ({tamano?.volumen} {tamano?.unidadMedida})
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeTamano(tamanoId)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
              {tamanos?.tamanos.map((tamano) => (
                <div key={tamano.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tamano-${tamano.id}`}
                    checked={selectedTamanos.includes(tamano.id)}
                    onCheckedChange={() => toggleTamano(tamano.id)}
                  />
                  <Label 
                    htmlFor={`tamano-${tamano.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {tamano.nombre} ({tamano.volumen} {tamano.unidadMedida})
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Actualizar Producto
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};