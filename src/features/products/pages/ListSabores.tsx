// src/features/products/pages/ListSabores.tsx
import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Palette } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

import { useListSabores } from '../hooks/useListSabores';
import { useDeleteSabor } from '../hooks/useDeleteSabor';
import { Sabor } from '../types/product-api.types';
import { CreateSaborModal } from '../components/sabores/CreateSaborModal';
import { EditSaborModal } from '../components/sabores/EditSaborModal';

export default function ListSabores() {
  const [search, setSearch] = useState('');
  const [conDescripcion, setConDescripcion] = useState<boolean | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSabor, setSelectedSabor] = useState<Sabor | null>(null);

  const { data: sabores, isLoading, error } = useListSabores({
    nombre: search || undefined,
    conDescripcion,
  });

  console.log(sabores);

  const deleteMutation = useDeleteSabor();

  // Ahora sabores ya es un array directo
  const saboresArray = sabores || [];

  const handleEdit = (sabor: Sabor) => {
    setSelectedSabor(sabor);
    setIsEditModalOpen(true);
  };

  const handleDelete = (sabor: Sabor) => {
    setSelectedSabor(sabor);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSabor) {
      deleteMutation.mutate(selectedSabor.id);
      setIsDeleteDialogOpen(false);
      setSelectedSabor(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
          <p className="text-destructive">Error al cargar los sabores</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Intentar nuevamente
          </Button>
        </div>
      </div>
    );
  }

  const activeSabores = saboresArray?.filter(s => s.activo) || [];
  const inactiveSabores = saboresArray?.filter(s => !s.activo) || [];
  const saboresConDescripcion = saboresArray?.filter(s => s.descripcion) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Sabores</h1>
          <p className="text-muted-foreground">
            Administra los sabores disponibles para los productos
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Nuevo Sabor
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sabores</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{saboresArray?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {activeSabores.length} activos, {inactiveSabores.length} inactivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sabores Activos</CardTitle>
            <Palette className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSabores.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Descripción</CardTitle>
            <Palette className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{saboresConDescripcion.length}</div>
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
                placeholder="Buscar sabores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={conDescripcion === true ? "default" : "outline"}
                size="sm"
                onClick={() => setConDescripcion(conDescripcion === true ? undefined : true)}
              >
                Con Descripción
              </Button>
              
              <Button
                variant={conDescripcion === false ? "default" : "outline"}
                size="sm"
                onClick={() => setConDescripcion(conDescripcion === false ? undefined : false)}
              >
                Sin Descripción
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
                  <th className="text-left p-4 font-medium">Sabor</th>
                  <th className="text-left p-4 font-medium">Descripción</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-left p-4 font-medium">Fecha Creación</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {saboresArray?.map((sabor) => (
                  <tr key={sabor.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                          <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{sabor.nombre}</p>
                          <p className="text-sm text-muted-foreground">ID: {sabor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm max-w-xs truncate">
                        {sabor.descripcion || (
                          <span className="text-muted-foreground italic">Sin descripción</span>
                        )}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant={sabor.activo ? "default" : "secondary"}>
                        {sabor.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm">
                          {new Date(sabor.fechaCreacion).toLocaleDateString()}
                        </p>
                        {sabor.fechaActualizacion && (
                          <p className="text-xs text-muted-foreground">
                            Actualizado: {new Date(sabor.fechaActualizacion).toLocaleDateString()}
                          </p>
                        )}
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
                          <DropdownMenuItem onClick={() => handleEdit(sabor)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(sabor)}
                            className="text-destructive focus:text-destructive"
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
          
          {(!saboresArray || saboresArray.length === 0) && (
            <div className="text-center py-12">
              <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay sabores</h3>
              <p className="text-muted-foreground">
                {search ? 'No se encontraron sabores con los filtros aplicados.' : 'Comienza creando tu primer sabor.'}
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Sabor
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <CreateSaborModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      
      <EditSaborModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        sabor={selectedSabor}
      />

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar sabor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El sabor "{selectedSabor?.nombre}" 
              será eliminado permanentemente.
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