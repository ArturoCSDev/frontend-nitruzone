// src/features/seguimiento-fisico/components/controls/ControlsStats.tsx
import React from 'react';
import { Activity, TrendingUp, Users, Calendar } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Types
import { ControlFisicoItem, ControlFisicoSummary } from '../../types/seguimiento-fisico-api.types';

interface ControlsStatsProps {
  controles: ControlFisicoItem[];
  summary?: ControlFisicoSummary;
  isLoading: boolean;
}

export const ControlsStats: React.FC<ControlsStatsProps> = ({ 
  controles, 
  summary, 
  isLoading 
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Controles</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{controles.length}</div>
          <p className="text-xs text-muted-foreground">
            {summary.totalRecent} recientes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Con Métricas</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalWithMetrics}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(summary.totalWithMetrics, controles.length)}% del total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Evaluación Subjetiva</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalWithSubjectiveEvaluation}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(summary.totalWithSubjectiveEvaluation, controles.length)}% del total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Último Control</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDate(summary.latestControl)}
          </div>
          <p className="text-xs text-muted-foreground">
            Promedio: {summary.averageDaysBetweenControls || 0} días
          </p>
        </CardContent>
      </Card>
    </div>
  );
};