// src/features/admin/pages/ListClients.tsx
import { useState } from 'react';
import { Search, Filter, Users, UserCheck, UserX, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

import { useListClients } from '@/features/auth/hooks/useListClients';
import { UserClientItem } from '@/features/auth/types/auth-api.types';

export default function ListClients() {
  const [search, setSearch] = useState('');
  const [onlyActive, setOnlyActive] = useState<boolean | undefined>(undefined);
  const [onlyCompleteProfiles, setOnlyCompleteProfiles] = useState<boolean | undefined>(undefined);

  const { data, isLoading, error } = useListClients({
    search: search || undefined,
    onlyActive,
    onlyCompleteProfiles,
  });

  const handleEdit = (client: UserClientItem) => {
    console.log('Editar cliente:', client);
    // TODO: Implementar navegación a edición
  };

  const handleDelete = (client: UserClientItem) => {
    console.log('Eliminar cliente:', client);
    // TODO: Implementar confirmación y eliminación
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getIMCStatus = (imc: number | null) => {
    if (!imc) return { label: 'N/A', variant: 'secondary' as const };
    if (imc < 18.5) return { label: 'Bajo peso', variant: 'destructive' as const };
    if (imc < 25) return { label: 'Normal', variant: 'default' as const };
    if (imc < 30) return { label: 'Sobrepeso', variant: 'secondary' as const };
    return { label: 'Obesidad', variant: 'destructive' as const };
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
          <p className="text-destructive">Error al cargar los clientes</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona y visualiza todos los clientes registrados
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary.totalActive || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary.totalInactive || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfiles Completos</CardTitle>
            <Filter className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary.totalCompleteProfiles || 0}</div>
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
                placeholder="Buscar por nombre, email o DNI..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={onlyActive === true ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlyActive(onlyActive === true ? undefined : true)}
              >
                Solo Activos
              </Button>
              <Button
                variant={onlyCompleteProfiles === true ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlyCompleteProfiles(onlyCompleteProfiles === true ? undefined : true)}
              >
                Perfil Completo
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
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Contacto</th>
                  <th className="text-left p-4 font-medium">Perfil</th>
                  <th className="text-left p-4 font-medium">IMC</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data?.users.map((client) => {
                  const imcStatus = getIMCStatus(client.cliente.imc);
                  return (
                    <tr key={client.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {getInitials(client.nombreCompleto)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.nombreCompleto}</p>
                            <p className="text-sm text-muted-foreground">DNI: {client.dni}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm">{client.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.cliente.telefono || 'Sin teléfono'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={client.cliente.hasCompleteProfile ? "default" : "secondary"}>
                          {client.cliente.hasCompleteProfile ? 'Completo' : 'Incompleto'}
                        </Badge>
                        {client.cliente.edad && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {client.cliente.edad} años • {client.cliente.genero || 'N/A'}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant={imcStatus.variant}>
                          {client.cliente.imc ? client.cliente.imc.toFixed(1) : 'N/A'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {imcStatus.label}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge variant={client.active ? "default" : "secondary"}>
                          {client.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(client.fechaCreacion).toLocaleDateString()}
                        </p>
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
                            <DropdownMenuItem onClick={() => handleEdit(client)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(client)}
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
          
          {(!data?.users || data.users.length === 0) && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay clientes</h3>
              <p className="text-muted-foreground">
                {search ? 'No se encontraron clientes con los filtros aplicados.' : 'Comienza registrando tu primer cliente.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}