// src/features/seguimiento-fisico/components/controls/ControlsTable.tsx
import React from 'react';
import { Eye, Edit, Trash2, Download } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatMetric = (value: number | null, unit: string) => {
    return value ? `${value}${unit}` : '-';
  };

  const getStatusBadge = (control: ControlFisicoItem) => {
    if (control.hasCompleteMetrics) return <Badge variant="default">Completo</Badge>;
    if (control.hasSubjectiveEvaluation) return <Badge variant="secondary">Subjetivo</Badge>;
    return <Badge variant="outline">Parcial</Badge>;
  };

  const getEnergyBadge = (nivel: number | null) => {
    if (!nivel) return <Badge variant="outline">-</Badge>;
    if (nivel >= 4) return <Badge variant="default">Alto</Badge>;
    if (nivel >= 3) return <Badge variant="secondary">Medio</Badge>;
    return <Badge variant="destructive">Bajo</Badge>;
  };

  const LoadingSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Controles Físicos</CardTitle>
          <div className="flex gap-2">
            {selectedControls.length > 0 && (
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar ({selectedControls.length})
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error al cargar los controles</p>
          </div>
        ) : controles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay controles físicos registrados</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedControls.length === controles.length && controles.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Grasa</TableHead>
                <TableHead>Músculo</TableHead>
                <TableHead>Energía</TableHead>
                <TableHead>Ánimo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Realizado por</TableHead>
                <TableHead className="w-32">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controles.map((control) => (
                <TableRow key={control.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedControls.includes(control.id)}
                      onCheckedChange={(checked) => onSelectControl(control.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDate(control.fechaControl)}
                  </TableCell>
                  <TableCell>{formatMetric(control.peso, 'kg')}</TableCell>
                  <TableCell>{formatMetric(control.grasaCorporal, '%')}</TableCell>
                  <TableCell>{formatMetric(control.masaMuscular, 'kg')}</TableCell>
                  <TableCell>{getEnergyBadge(control.nivelEnergia)}</TableCell>
                  <TableCell>{getEnergyBadge(control.estadoAnimo)}</TableCell>
                  <TableCell>{getStatusBadge(control)}</TableCell>
                  <TableCell>{control.realizadoPor || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenDialog('view', control.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenDialog('edit', control.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenDialog('delete', control.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};