// src/features/products/pages/ListProductos.tsx
import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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

import { useListProductos } from '../hooks/useListProducts';
import { useDeleteProducto } from '../hooks/useDeleteProducto';
import { Producto } from '../types/product-api.types';
import { CreateProductoModal } from '../components/products/CreateProductModal';
import { EditProductoModal } from '../components/products/EditProductModal';

export default function ListProductos() {
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  const { data: productos, isLoading, error } = useListProductos({
    nombre: search || undefined,
  });

  const deleteMutation = useDeleteProducto();
  const productosArray = productos || [];

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsEditModalOpen(true);
  };

  const handleDelete = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProducto) {
      deleteMutation.mutate(selectedProducto.id);
      setIsDeleteDialogOpen(false);
      setSelectedProducto(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error al cargar los productos</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra el catálogo de productos</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla NUEVA */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Producto</th>
                  <th className="text-left p-4 font-medium">Precio</th>
                  <th className="text-left p-4 font-medium">Información Nutricional</th>
                  <th className="text-left p-4 font-medium">Ingredientes & Etiquetas</th>
                  <th className="text-left p-4 font-medium">Momentos Recomendados</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosArray.map((producto) => (
                  <tr key={producto.id} className="border-b hover:bg-muted/50">
                    {/* COLUMNA 1: PRODUCTO */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {producto.urlImagen ? (
                          <img 
                            src={producto.urlImagen!} 
                            alt={producto.nombre}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{producto.nombre}</p>
                          {producto.descripcion && (
                            <p className="text-sm text-muted-foreground max-w-xs line-clamp-2">
                              {producto.descripcion}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(producto.fechaCreacion).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* COLUMNA 2: PRECIO */}
                    <td className="p-4 text-center">
                      <div>
                        <p className="font-bold text-xl text-green-600">
                          {`S/ ${producto.precio.toFixed(2)}`}
                        </p>
                      </div>
                    </td>

                    {/* COLUMNA 3: INFO NUTRICIONAL */}
                    <td className="p-4">
                      {producto.proteina && (
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {producto.proteina && (
                            <div className="bg-blue-50 px-2 py-1 rounded flex justify-between">
                              <span className="text-blue-700">Proteína</span>
                              <span className="font-bold text-blue-900">{producto.proteina}g</span>
                            </div>
                          )}
                          {producto.calorias && (
                            <div className="bg-orange-50 px-2 py-1 rounded flex justify-between">
                              <span className="text-orange-700">Calorías</span>
                              <span className="font-bold text-orange-900">{producto.calorias}</span>
                            </div>
                          )}
                          {producto.carbohidratos && (
                            <div className="bg-green-50 px-2 py-1 rounded flex justify-between">
                              <span className="text-green-700">Carbos</span>
                              <span className="font-bold text-green-900">{producto.carbohidratos}g</span>
                            </div>
                          )}
                          {producto.grasas && (
                            <div className="bg-yellow-50 px-2 py-1 rounded flex justify-between">
                              <span className="text-yellow-700">Grasas</span>
                              <span className="font-bold text-yellow-900">{producto.grasas}g</span>
                            </div>
                          )}
                          {producto.fibra && (
                            <div className="bg-purple-50 px-2 py-1 rounded flex justify-between">
                              <span className="text-purple-700">Fibra</span>
                              <span className="font-bold text-purple-900">{producto.fibra}g</span>
                            </div>
                          )}
                          {producto.azucar && (
                            <div className="bg-pink-50 px-2 py-1 rounded flex justify-between">
                              <span className="text-pink-700">Azúcar</span>
                              <span className="font-bold text-pink-900">{producto.azucar}g</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* COLUMNA 4: INGREDIENTES & ETIQUETAS */}
                    <td className="p-4">
                      <div className="space-y-2">
                        {/* Ingredientes */}
                        {producto.ingredientes && (
                          <div>
                            <p className="text-xs font-bold text-gray-700 mb-1">
                              🥄 Ingredientes ({producto.ingredientes.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {producto.ingredientes.slice(0, 2).map((ingrediente, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                                  {ingrediente}
                                </span>
                              ))}
                              {producto.ingredientes.length > 2 && (
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                  +{producto.ingredientes.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Etiquetas */}
                        {producto.etiquetas && (
                          <div>
                            <p className="text-xs font-bold text-blue-700 mb-1">
                              🏷️ Etiquetas ({producto.etiquetas.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {producto.etiquetas.slice(0, 2).map((etiqueta, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-200">
                                  {etiqueta}
                                </span>
                              ))}
                              {producto.etiquetas.length > 2 && (
                                <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                                  +{producto.etiquetas.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* COLUMNA 5: MOMENTOS RECOMENDADOS */}
                    <td className="p-4">
                      {producto.momentosRecomendados ? (
                        <div>
                          <p className="text-xs font-bold text-purple-700 mb-2">
                            ⏰ Momentos ({producto.momentosRecomendados.length})
                          </p>
                          <div className="space-y-1">
                            {producto.momentosRecomendados.map((momento) => {
                              const momentoConfig: Record<string, { emoji: string; label: string; bg: string }> = {
                                'MANANA': { emoji: '🌅', label: 'Mañana', bg: 'bg-yellow-100 text-yellow-800' },
                                'PRE_ENTRENAMIENTO': { emoji: '💪', label: 'Pre-entreno', bg: 'bg-red-100 text-red-800' },
                                'POST_ENTRENAMIENTO': { emoji: '🏋️', label: 'Post-entreno', bg: 'bg-green-100 text-green-800' },
                                'TARDE': { emoji: '🌇', label: 'Tarde', bg: 'bg-orange-100 text-orange-800' },
                                'NOCHE': { emoji: '🌙', label: 'Noche', bg: 'bg-indigo-100 text-indigo-800' },
                                'ANTES_DORMIR': { emoji: '😴', label: 'Antes dormir', bg: 'bg-purple-100 text-purple-800' }
                              };
                              const config = momentoConfig[momento] || { emoji: '⭐', label: momento, bg: 'bg-gray-100 text-gray-800' };
                              return (
                                <div key={momento} className={`text-xs px-2 py-1 rounded ${config.bg} flex items-center gap-1`}>
                                  <span>{config.emoji}</span>
                                  <span className="font-medium">{config.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">Sin momentos</span>
                      )}
                    </td>

                    {/* COLUMNA 6: ACCIONES */}
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
                          <DropdownMenuItem onClick={() => handleEdit(producto)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(producto)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {productosArray.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay productos</h3>
              <p className="text-muted-foreground">
                {search ? 'No se encontraron productos.' : 'Comienza creando tu primer producto.'}
              </p>
              <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Producto
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <CreateProductoModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      
      <EditProductoModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        producto={selectedProducto}
      />

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              El producto "{selectedProducto?.nombre}" será eliminado permanentemente.
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