// src/features/admin/pages/ListAdmins.tsx
import { useState } from 'react';
import { Search, Filter, Shield, UserCheck, UserX, Plus, MoreHorizontal, Edit, Trash2, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

import { useListAdmins } from '@/features/auth/hooks/useListAdmins';
import { UserAdminItem } from '@/features/auth/types/auth-api.types';

const DEPARTAMENTOS = [
  'Nutrición',
  'Administración', 
  'Sistemas',
  'Recursos Humanos',
  'Finanzas'
];

export default function ListAdmins() {
  const [search, setSearch] = useState('');
  const [onlyActive, setOnlyActive] = useState<boolean | undefined>(undefined);
  const [departamento, setDepartamento] = useState<string | undefined>(undefined);
  const [minAccessLevel, setMinAccessLevel] = useState<number | undefined>(undefined);

  const { data, isLoading, error } = useListAdmins({
    search: search || undefined,
    onlyActive,
    departamento,
    minAccessLevel,
  });

  const handleEdit = (admin: UserAdminItem) => {
    console.log('Editar administrador:', admin);
    // TODO: Implementar navegación a edición
  };

  const handleDelete = (admin: UserAdminItem) => {
    console.log('Eliminar administrador:', admin);
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

  const getAccessLevelBadge = (level: number) => {
    if (level <= 2) return { label: `Nivel ${level} - Básico`, variant: 'secondary' as const };
    if (level === 3) return { label: `Nivel ${level} - Estándar`, variant: 'default' as const };
    return { label: `Nivel ${level} - Avanzado`, variant: 'destructive' as const };
  };

  const getDepartmentIcon = (dept: string | null) => {
    console.log(dept);
    return <Building2 className="h-3 w-3" />;
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
          <p className="text-destructive">Error al cargar los administradores</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Administradores</h1>
          <p className="text-muted-foreground">
            Gestiona y visualiza todos los administradores del sistema
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Administrador
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Alto Acceso</CardTitle>
            <Filter className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data?.summary.byAccessLevel.level4 || 0) + (data?.summary.byAccessLevel.level5 || 0)}
            </div>
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
              <Select value={departamento || "all"} onValueChange={(value) => setDepartamento(value === "all" ? undefined : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {DEPARTAMENTOS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={minAccessLevel?.toString() || "all"} onValueChange={(value) => setMinAccessLevel(value === "all" ? undefined : parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Nivel 1+</SelectItem>
                  <SelectItem value="2">Nivel 2+</SelectItem>
                  <SelectItem value="3">Nivel 3+</SelectItem>
                  <SelectItem value="4">Nivel 4+</SelectItem>
                  <SelectItem value="5">Nivel 5</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={onlyActive === true ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlyActive(onlyActive === true ? undefined : true)}
              >
                Solo Activos
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
                  <th className="text-left p-4 font-medium">Administrador</th>
                  <th className="text-left p-4 font-medium">Contacto</th>
                  <th className="text-left p-4 font-medium">Departamento</th>
                  <th className="text-left p-4 font-medium">Nivel de Acceso</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data?.users.map((admin) => {
                  const accessBadge = getAccessLevelBadge(admin.admin.nivelAcceso);
                  return (
                    <tr key={admin.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {getInitials(admin.nombreCompleto)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{admin.nombreCompleto}</p>
                            <p className="text-sm text-muted-foreground">DNI: {admin.dni}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm">{admin.email}</p>
                          {admin.admin.ultimoAcceso && (
                            <p className="text-sm text-muted-foreground">
                              Último acceso: {new Date(admin.admin.ultimoAcceso).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getDepartmentIcon(admin.admin.departamento)}
                          <span className="text-sm">
                            {admin.admin.departamento || 'Sin asignar'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={accessBadge.variant}>
                          {admin.admin.nivelAcceso}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {accessBadge.label.split(' - ')[1]}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge variant={admin.active ? "default" : "secondary"}>
                          {admin.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(admin.fechaCreacion).toLocaleDateString()}
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
                            <DropdownMenuItem onClick={() => handleEdit(admin)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(admin)}
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
              <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay administradores</h3>
              <p className="text-muted-foreground">
                {search ? 'No se encontraron administradores con los filtros aplicados.' : 'Comienza registrando tu primer administrador.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}