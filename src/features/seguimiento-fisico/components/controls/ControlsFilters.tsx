// src/features/seguimiento-fisico/components/controls/ControlsFilters.tsx
import React from 'react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Types
import { ListControlFisicoParams } from '../../types/seguimiento-fisico-api.types';

interface ControlsFiltersProps {
  filters: ListControlFisicoParams;
  onFiltersChange: (filters: ListControlFisicoParams) => void;
}

export const ControlsFilters: React.FC<ControlsFiltersProps> = ({ 
  filters, 
  onFiltersChange 
}) => {
  const handleFilterChange = (key: keyof ListControlFisicoParams, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="onlyWithMetrics"
              checked={filters.onlyWithMetrics || false}
              onCheckedChange={(checked) => 
                handleFilterChange('onlyWithMetrics', checked)
              }
            />
            <Label htmlFor="onlyWithMetrics">Solo con métricas</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="onlyRecent"
              checked={filters.onlyRecent || false}
              onCheckedChange={(checked) => 
                handleFilterChange('onlyRecent', checked)
              }
            />
            <Label htmlFor="onlyRecent">Solo recientes</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="onlyWithSubjectiveEvaluation"
              checked={filters.onlyWithSubjectiveEvaluation || false}
              onCheckedChange={(checked) => 
                handleFilterChange('onlyWithSubjectiveEvaluation', checked)
              }
            />
            <Label htmlFor="onlyWithSubjectiveEvaluation">Solo con evaluación subjetiva</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="realizadoPor">Realizado por:</Label>
            <Input
              id="realizadoPor"
              placeholder="Buscar por profesional..."
              value={filters.realizadoPor || ''}
              onChange={(e) => handleFilterChange('realizadoPor', e.target.value)}
              className="w-48"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="fechaInicio">Desde:</Label>
            <Input
              id="fechaInicio"
              type="date"
              value={filters.fechaInicio || ''}
              onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
              className="w-40"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="fechaFin">Hasta:</Label>
            <Input
              id="fechaFin"
              type="date"
              value={filters.fechaFin || ''}
              onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};