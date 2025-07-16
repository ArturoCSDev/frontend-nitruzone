// src/features/seguimiento-fisico/components/controls/ControlsFilters.tsx
import React, { useState } from 'react';
import { Filter, X, Search, Calendar, User, Activity } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Types
import { ListControlFisicoParams } from '../../types/seguimiento-fisico-api.types';

interface ControlsFiltersProps {
  filters: ListControlFisicoParams;
  onFiltersChange: (filters: ListControlFisicoParams) => void;
}

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  variant?: 'default' | 'secondary';
}

const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove, variant = 'default' }) => (
  <Badge variant={variant} className="gap-1 px-2 py-1">
    {label}
    <Button
      variant="ghost"
      size="sm"
      onClick={onRemove}
      className="h-3 w-3 p-0 hover:bg-transparent"
    >
      <X className="w-3 h-3" />
    </Button>
  </Badge>
);

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => (
  <div className="flex items-center gap-2">
    <div className="flex flex-col">
      <Label htmlFor="fechaInicio" className="text-xs text-muted-foreground mb-1">
        Desde
      </Label>
      <Input
        id="fechaInicio"
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="w-36"
      />
    </div>
    <div className="flex flex-col">
      <Label htmlFor="fechaFin" className="text-xs text-muted-foreground mb-1">
        Hasta
      </Label>
      <Input
        id="fechaFin"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="w-36"
      />
    </div>
  </div>
);

export const ControlsFilters: React.FC<ControlsFiltersProps> = ({ 
  filters, 
  onFiltersChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ListControlFisicoParams, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      onlyWithMetrics: false,
      onlyRecent: false,
      onlyWithSubjectiveEvaluation: false,
      realizadoPor: '',
      fechaInicio: '',
      fechaFin: '',
    });
  };

  const removeFilter = (key: keyof ListControlFisicoParams) => {
    handleFilterChange(key, key === 'realizadoPor' || key === 'fechaInicio' || key === 'fechaFin' ? '' : false);
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.onlyWithMetrics) count++;
    if (filters.onlyRecent) count++;
    if (filters.onlyWithSubjectiveEvaluation) count++;
    if (filters.realizadoPor) count++;
    if (filters.fechaInicio || filters.fechaFin) count++;
    return count;
  };

  const getActiveFiltersLabels = (): Array<{ key: keyof ListControlFisicoParams; label: string }> => {
    const labels: Array<{ key: keyof ListControlFisicoParams; label: string }> = [];
    
    if (filters.onlyWithMetrics) {
      labels.push({ key: 'onlyWithMetrics', label: 'Solo con métricas' });
    }
    if (filters.onlyRecent) {
      labels.push({ key: 'onlyRecent', label: 'Solo recientes' });
    }
    if (filters.onlyWithSubjectiveEvaluation) {
      labels.push({ key: 'onlyWithSubjectiveEvaluation', label: 'Con evaluación subjetiva' });
    }
    if (filters.realizadoPor) {
      labels.push({ key: 'realizadoPor', label: `Profesional: ${filters.realizadoPor}` });
    }
    if (filters.fechaInicio || filters.fechaFin) {
      const startDate = filters.fechaInicio ? new Date(filters.fechaInicio).toLocaleDateString('es-ES') : '';
      const endDate = filters.fechaFin ? new Date(filters.fechaFin).toLocaleDateString('es-ES') : '';
      const dateLabel = startDate && endDate ? `${startDate} - ${endDate}` : 
                       startDate ? `Desde ${startDate}` : 
                       endDate ? `Hasta ${endDate}` : '';
      labels.push({ key: 'fechaInicio', label: `Fecha: ${dateLabel}` });
    }
    
    return labels;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const activeFiltersLabels = getActiveFiltersLabels();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Limpiar filtros
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Contraer' : 'Expandir'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Filtros activos:</Label>
            <div className="flex flex-wrap gap-2">
              {activeFiltersLabels.map((filter) => (
                <FilterChip
                  key={filter.key}
                  label={filter.label}
                  onRemove={() => removeFilter(filter.key)}
                />
              ))}
            </div>
            <Separator />
          </div>
        )}

        {/* Quick Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Filtros rápidos</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="onlyWithMetrics"
                checked={filters.onlyWithMetrics || false}
                onCheckedChange={(checked) => 
                  handleFilterChange('onlyWithMetrics', checked)
                }
              />
              <Label htmlFor="onlyWithMetrics" className="flex items-center gap-2 cursor-pointer">
                <Activity className="w-4 h-4" />
                Solo con métricas
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="onlyRecent"
                checked={filters.onlyRecent || false}
                onCheckedChange={(checked) => 
                  handleFilterChange('onlyRecent', checked)
                }
              />
              <Label htmlFor="onlyRecent" className="flex items-center gap-2 cursor-pointer">
                <Calendar className="w-4 h-4" />
                Solo recientes
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="onlyWithSubjectiveEvaluation"
                checked={filters.onlyWithSubjectiveEvaluation || false}
                onCheckedChange={(checked) => 
                  handleFilterChange('onlyWithSubjectiveEvaluation', checked)
                }
              />
              <Label htmlFor="onlyWithSubjectiveEvaluation" className="flex items-center gap-2 cursor-pointer">
                <User className="w-4 h-4" />
                Con evaluación subjetiva
              </Label>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4">
            <Separator />
            <Label className="text-sm font-medium">Filtros avanzados</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Professional Filter */}
              <div className="space-y-2">
                <Label htmlFor="realizadoPor" className="text-sm">
                  Profesional
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="realizadoPor"
                    placeholder="Buscar por profesional..."
                    value={filters.realizadoPor || ''}
                    onChange={(e) => handleFilterChange('realizadoPor', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label className="text-sm">Rango de fechas</Label>
                <DateRangePicker
                  startDate={filters.fechaInicio || ''}
                  endDate={filters.fechaFin || ''}
                  onStartDateChange={(date) => handleFilterChange('fechaInicio', date)}
                  onEndDateChange={(date) => handleFilterChange('fechaFin', date)}
                />
              </div>
            </div>

            {/* Quick Date Presets */}
            <div className="space-y-2">
              <Label className="text-sm">Presets de fecha</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    handleFilterChange('fechaInicio', lastWeek.toISOString().split('T')[0]);
                    handleFilterChange('fechaFin', today.toISOString().split('T')[0]);
                  }}
                >
                  Última semana
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    handleFilterChange('fechaInicio', lastMonth.toISOString().split('T')[0]);
                    handleFilterChange('fechaFin', today.toISOString().split('T')[0]);
                  }}
                >
                  Último mes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastQuarter = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                    handleFilterChange('fechaInicio', lastQuarter.toISOString().split('T')[0]);
                    handleFilterChange('fechaFin', today.toISOString().split('T')[0]);
                  }}
                >
                  Últimos 3 meses
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};