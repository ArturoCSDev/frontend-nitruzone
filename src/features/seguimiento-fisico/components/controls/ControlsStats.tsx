// src/features/seguimiento-fisico/components/controls/ControlsStats.tsx
import React from 'react';
import { Activity, TrendingUp, Users, Calendar, Clock, Target, AlertCircle } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types
import { ControlFisicoItem, ControlFisicoSummary } from '../../types/seguimiento-fisico-api.types';

interface ControlsStatsProps {
  controles: ControlFisicoItem[];
  summary?: ControlFisicoSummary;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  progress?: {
    value: number;
    max: number;
    label: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = 'text-muted-foreground',
  trend,
  progress
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="text-2xl font-bold">{value}</div>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
      
      {trend && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
            <span className="text-xs font-medium">
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{trend.label}</span>
        </div>
      )}
      
      {progress && (
        <div className="space-y-1">
          <Progress value={(progress.value / progress.max) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress.label}</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export const ControlsStats: React.FC<ControlsStatsProps> = ({ 
  controles, 
  summary, 
  isLoading 
}) => {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const getConsistencyLevel = (averageDays: number | null): { level: string; color: string } => {
    if (!averageDays) return { level: 'Sin datos', color: 'text-gray-500' };
    if (averageDays <= 7) return { level: 'Excelente', color: 'text-green-600' };
    if (averageDays <= 14) return { level: 'Buena', color: 'text-blue-600' };
    if (averageDays <= 30) return { level: 'Regular', color: 'text-yellow-600' };
    return { level: 'Necesita mejorar', color: 'text-red-600' };
  };

  const getRecentControlsHealth = (): { status: string; color: string; message: string } => {
    if (!summary) return { status: 'Sin datos', color: 'text-gray-500', message: 'No hay datos disponibles' };
    
    const recentPercentage = calculatePercentage(summary.totalRecent, controles.length);
    
    if (recentPercentage >= 80) {
      return { 
        status: 'Excelente', 
        color: 'text-green-600', 
        message: 'Mayoría de controles recientes' 
      };
    }
    if (recentPercentage >= 60) {
      return { 
        status: 'Buena', 
        color: 'text-blue-600', 
        message: 'Buen seguimiento reciente' 
      };
    }
    if (recentPercentage >= 40) {
      return { 
        status: 'Regular', 
        color: 'text-yellow-600', 
        message: 'Seguimiento moderado' 
      };
    }
    return { 
      status: 'Necesita atención', 
      color: 'text-red-600', 
      message: 'Pocos controles recientes' 
    };
  };

  const LoadingSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!summary) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No se pudo cargar el resumen de estadísticas. Inténtalo de nuevo.
        </AlertDescription>
      </Alert>
    );
  }

  const consistencyLevel = getConsistencyLevel(summary.averageDaysBetweenControls);
  const recentHealth = getRecentControlsHealth();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Controles"
          value={controles.length}
          subtitle={`${summary.totalRecent} controles recientes`}
          icon={Activity}
          iconColor="text-blue-600"
          progress={{
            value: summary.totalRecent,
            max: controles.length,
            label: `${calculatePercentage(summary.totalRecent, controles.length)}% recientes`
          }}
        />

        <StatCard
          title="Con Métricas Físicas"
          value={summary.totalWithMetrics}
          subtitle={`${calculatePercentage(summary.totalWithMetrics, controles.length)}% del total`}
          icon={TrendingUp}
          iconColor="text-green-600"
          progress={{
            value: summary.totalWithMetrics,
            max: controles.length,
            label: `${summary.totalWithoutMetrics} sin métricas`
          }}
        />

        <StatCard
          title="Evaluación Subjetiva"
          value={summary.totalWithSubjectiveEvaluation}
          subtitle={`${calculatePercentage(summary.totalWithSubjectiveEvaluation, controles.length)}% evaluadas`}
          icon={Users}
          iconColor="text-purple-600"
          progress={{
            value: summary.totalWithSubjectiveEvaluation,
            max: controles.length,
            label: `${summary.totalWithoutSubjectiveEvaluation} sin evaluación`
          }}
        />

        <StatCard
          title="Última Medición"
          value={formatDate(summary.latestControl)}
          subtitle={`Frecuencia: ${summary.averageDaysBetweenControls || 0} días`}
          icon={Calendar}
          iconColor="text-orange-600"
        />
      </div>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Consistencia del Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">
                {summary.averageDaysBetweenControls || 0}
              </span>
              <Badge variant="outline" className={consistencyLevel.color}>
                {consistencyLevel.level}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              días promedio entre controles
            </p>
            <div className="mt-2">
              <Progress 
                value={Math.max(0, 100 - (summary.averageDaysBetweenControls || 0) * 2)} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              Calidad de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Métricas completas</span>
                <Badge variant="default">
                  {calculatePercentage(summary.totalWithMetrics, controles.length)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Evaluación subjetiva</span>
                <Badge variant="secondary">
                  {calculatePercentage(summary.totalWithSubjectiveEvaluation, controles.length)}%
                </Badge>
              </div>
              <Progress 
                value={
                  (summary.totalWithMetrics + summary.totalWithSubjectiveEvaluation) / 
                  (controles.length * 2) * 100
                } 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              Estado del Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">
                {recentHealth.status}
              </span>
              <Badge variant="outline" className={recentHealth.color}>
                {summary.totalRecent}/{controles.length}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {recentHealth.message}
            </p>
            <div className="text-xs text-muted-foreground">
              Período: {formatDate(summary.oldestControl)} - {formatDate(summary.latestControl)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};