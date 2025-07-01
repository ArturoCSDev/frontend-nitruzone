// src/features/products/pages/ListProducts.tsx
import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useListProducts } from '../hooks/useListProducts';
import { useListCategorias } from '../hooks/useListCategorias';
import { useDeleteProducts } from '../hooks/useDeleteProducts';
import { ProductoItem } from '../types/product-api.types';
import { CreateProductModal } from '../components/products/CreateProductModal';
import { EditProductModal } from '../components/products/EditProductModal';

export default function ListProducts() {
  const [search, setSearch] = useState('');
  const [categoriaId, setCategoriaId] = useState<string | undefined>(undefined);
  const [onlyActive, setOnlyActive] = useState<boolean | undefined>(undefined);
  const [onlyInStock, setOnlyInStock] = useState<boolean | undefined>(undefined);
  const [onlyLowStock, setOnlyLowStock] = useState<boolean | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoItem | null>(null);

  const { data, isLoading, error } = useListProducts({
    search: search || undefined,
    categoriaId,
    onlyActive,
    onlyInStock,
    onlyLowStock,
  });

  const { data: categorias } = useListCategorias();
  const deleteMutation = useDeleteProducts();

  const handleEdit = (product: ProductoItem) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: ProductoItem) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const getStockBadge = (product: ProductoItem) => {
    if (product.isOutOfStock) {
      return { label: 'Sin Stock', variant: 'destructive' as const };
    }
    if (product.isLowStock) {
      return { label: 'Stock Bajo', variant: 'secondary' as const };
    }
    return { label: 'En Stock', variant: 'default' as const };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar los productos</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Intentar nuevamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
          <p className="text-muted-foreground">
            Administra el inventario de productos disponibles
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoriaId || "all"} onValueChange={(value) => setCategoriaId(value === "all" ? undefined : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categorias?.categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant={onlyActive === true ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlyActive(onlyActive === true ? undefined : true)}
              >
                Solo Activos
              </Button>
              
              <Button
                variant={onlyInStock === true ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlyInStock(onlyInStock === true ? undefined : true)}
              >
                En Stock
              </Button>
              
              <Button
                variant={onlyLowStock === true ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlyLowStock(onlyLowStock === true ? undefined : true)}
              >
                Stock Bajo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Producto</th>
                  <th className="text-left p-4 font-medium">Categoría</th>
                  <th className="text-left p-4 font-medium">Precio</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Sabores</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data?.productos.map((product) => {
                  const stockBadge = getStockBadge(product);
                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{product.nombre}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.descripcion || 'Sin descripción'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium">{product.categoria.nombre}</p>
                          <p className="text-xs text-muted-foreground">{product.categoria.tipoProducto}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">S/ {product.precio.toFixed(2)}</p>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge variant={stockBadge.variant}>
                            {stockBadge.label}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {product.stock} / min: {product.stockMinimo}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {product.sabores.slice(0, 2).map((sabor) => (
                            <Badge key={sabor.id} variant="outline" className="text-xs">
                              {sabor.nombre}
                            </Badge>
                          ))}
                          {product.sabores.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.sabores.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge variant={product.activo ? "default" : "secondary"}>
                            {product.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(product.fechaCreacion).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(product)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {(!data?.productos || data.productos.length === 0) && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay productos</h3>
              <p className="text-muted-foreground">
                {search ? 'No se encontraron productos con los filtros aplicados.' : 'Comienza creando tu primer producto.'}
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Producto
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <CreateProductModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      
      <EditProductModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={selectedProduct}
      />

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto "{selectedProduct?.nombre}" 
              será eliminado permanentemente del inventario.
              {selectedProduct?.stock && selectedProduct.stock > 0 && (
                <span className="block mt-2 text-orange-600 font-medium">
                  ⚠️ Este producto tiene {selectedProduct.stock} unidades en stock.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}