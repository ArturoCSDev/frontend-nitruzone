// src/features/seguimiento-fisico/components/controls/ControlsTable.tsx
import React from 'react';
import { Eye, Edit, Trash2, Download, AlertCircle, Calendar, User, Activity } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Types
import { ControlFisicoItem } from '../../types/seguimiento-fisico-api.types';

interface ControlsTableProps {
  controles: ControlFisicoItem[];
  selectedControls: string[];
  onSelectControl: (controlId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onOpenDialog: (type: 'view' | 'edit' | 'delete', controlId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export const ControlsTable: React.FC<ControlsTableProps> = ({
  controles,
  selectedControls,
  onSelectControl,
  onSelectAll,
  onOpenDialog,
  isLoading,
  error
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatMetric = (value: number | null, unit: string): string => {
    return value !== null ? `${value}${unit}` : '-';
  };

  const getStatusBadge = (control: ControlFisicoItem): React.ReactElement => {
    if (control.hasCompleteMetrics) {
      return <Badge variant="default" className="gap-1">
        <Activity className="w-3 h-3" />
        Completo
      </Badge>;
    }
    if (control.hasSubjectiveEvaluation) {
      return <Badge variant="secondary" className="gap-1">
        <User className="w-3 h-3" />
        Subjetivo
      </Badge>;
    }
    return <Badge variant="outline" className="gap-1">
      <AlertCircle className="w-3 h-3" />
      Parcial
    </Badge>;
  };

  const getEnergyBadge = (nivel: number | null): React.ReactElement => {
    if (nivel === null) {
      return <Badge variant="outline">-</Badge>;
    }
    
    if (nivel >= 4) {
      return <Badge variant="default">Alto</Badge>;
    }
    if (nivel >= 3) {
      return <Badge variant="secondary">Medio</Badge>;
    }
    return <Badge variant="destructive">Bajo</Badge>;
  };

  const getMoodBadge = (nivel: number | null): React.ReactElement => {
    if (nivel === null) {
      return <Badge variant="outline">-</Badge>;
    }
    
    if (nivel >= 4) {
      return <Badge variant="default">Excelente</Badge>;
    }
    if (nivel >= 3) {
      return <Badge variant="secondary">Bueno</Badge>;
    }
    return <Badge variant="destructive">Regular</Badge>;
  };

  const getTimeAgo = (diasDesdeControl: number): string => {
    if (diasDesdeControl === 0) return 'Hoy';
    if (diasDesdeControl === 1) return 'Ayer';
    if (diasDesdeControl < 7) return `${diasDesdeControl} días`;
    if (diasDesdeControl < 30) return `${Math.floor(diasDesdeControl / 7)} semanas`;
    return `${Math.floor(diasDesdeControl / 30)} meses`;
  };

  const getInitials = (name: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const LoadingSkeleton: React.FC = () => (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );

  const EmptyState: React.FC = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Activity className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay controles físicos</h3>
      <p className="text-gray-500 mb-6">
        Comienza registrando el primer control físico para este cliente
      </p>
      <Button variant="outline" size="sm">
        <Calendar className="w-4 h-4 mr-2" />
        Crear primer control
      </Button>
    </div>
  );

  const ErrorState: React.FC = () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Error al cargar los controles físicos. Por favor, inténtalo de nuevo.
      </AlertDescription>
    </Alert>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Controles Físicos
          </CardTitle>
          <div className="flex gap-2">
            {selectedControls.length > 0 && (
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Eliminar ({selectedControls.length})
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState />
        ) : controles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedControls.length === controles.length && controles.length > 0}
                      onCheckedChange={onSelectAll}
                      aria-label="Seleccionar todos"
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Peso</TableHead>
                  <TableHead className="font-semibold">Grasa</TableHead>
                  <TableHead className="font-semibold">Músculo</TableHead>
                  <TableHead className="font-semibold">Energía</TableHead>
                  <TableHead className="font-semibold">Ánimo</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Profesional</TableHead>
                  <TableHead className="font-semibold w-32">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controles.map((control) => (
                  <TableRow 
                    key={control.id} 
                    className={`hover:bg-gray-50/50 ${
                      selectedControls.includes(control.id) ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedControls.includes(control.id)}
                        onCheckedChange={(checked) => onSelectControl(control.id, checked as boolean)}
                        aria-label={`Seleccionar control del ${formatDate(control.fechaControl)}`}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatDate(control.fechaControl)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{getTimeAgo(control.diasDesdeControl)}</span>
                          {control.isRecentControl && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              Reciente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatMetric(control.peso, 'kg')}
                        </span>
                        {control.peso && (
                          <span className="text-xs text-muted-foreground">
                            {control.peso < 70 ? 'Bajo' : control.peso > 90 ? 'Alto' : 'Normal'}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatMetric(control.grasaCorporal, '%')}
                        </span>
                        {control.grasaCorporal && (
                          <span className="text-xs text-muted-foreground">
                            {control.grasaCorporal < 15 ? 'Bajo' : control.grasaCorporal > 25 ? 'Alto' : 'Normal'}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatMetric(control.masaMuscular, 'kg')}
                        </span>
                        {control.masaMuscular && (
                          <span className="text-xs text-muted-foreground">
                            {control.masaMuscular > 35 ? 'Alto' : 'Normal'}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        {getEnergyBadge(control.nivelEnergia)}
                        {control.nivelEnergia && (
                          <span className="text-xs text-muted-foreground">
                            {control.nivelEnergia}/5
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        {getMoodBadge(control.estadoAnimo)}
                        {control.estadoAnimo && (
                          <span className="text-xs text-muted-foreground">
                            {control.estadoAnimo}/5
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        {getStatusBadge(control)}
                        <span className="text-xs text-muted-foreground">
                          {control.hasCompleteMetrics ? 'Métricas completas' : 
                           control.hasSubjectiveEvaluation ? 'Solo evaluación' : 'Datos parciales'}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {control.realizadoPor ? (
                          <>
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(control.realizadoPor)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {control.realizadoPor}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Profesional
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onOpenDialog('view', control.id)}
                          className="h-8 w-8 p-0"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onOpenDialog('edit', control.id)}
                          className="h-8 w-8 p-0"
                          title="Editar control"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onOpenDialog('delete', control.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          title="Eliminar control"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};