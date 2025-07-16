// src/features/seguimiento-fisico/components/statistics/ControlStatisticsPanel.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Target, Award, AlertCircle, Calendar, Activity, Heart, Scale, Brain } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types
import { 
  ControlFisicoStatistics, 
  TrendsAnalysis, 
  PhysicalProgressSummary, 
  InsightsData,
  CorrelationAnalysis,
  MetricStatistics,
  TrendAnalysis
} from '../../types/seguimiento-fisico-api.types';

interface ControlStatisticsPanelProps {
  statistics: ControlFisicoStatistics;
  trends?: TrendsAnalysis;
  progressSummary?: PhysicalProgressSummary;
  insights?: InsightsData;
  correlations?: CorrelationAnalysis;
  isLoading?: boolean;
}

interface MetricCardProps {
  title: string;
  metric: MetricStatistics;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  showProgress?: boolean;
  maxValue?: number;
}

interface TrendCardProps {
  title: string;
  trend: TrendAnalysis;
  icon: React.ComponentType<{ className?: string }>;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  metric, 
  unit, 
  icon: Icon, 
  color, 
  showProgress = false,
  maxValue = 100
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold">{metric.current || 'N/A'}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      
      {showProgress && metric.current && (
        <Progress 
          value={(metric.current / maxValue) * 100} 
          className="h-2"
        />
      )}
      
      {metric.change !== null && (
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-1 ${
            metric.trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {metric.trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="text-xs font-medium">
              {metric.change > 0 ? '+' : ''}{metric.change}
            </span>
          </div>
          <Badge variant={metric.hasImprovement ? "default" : "secondary"} className="text-xs">
            {metric.hasImprovement ? 'Mejorando' : 'Estable'}
          </Badge>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground leading-relaxed">
        {metric.improvementMessage}
      </p>
    </CardContent>
  </Card>
);

const TrendCard: React.FC<TrendCardProps> = ({ title, trend, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-2">
        <Badge variant={trend.isPositive ? "default" : "secondary"} className="gap-1">
          {trend.isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trend.trend}
        </Badge>
        <span className="text-sm font-medium">{trend.percentage.toFixed(1)}%</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
        {trend.description}
      </p>
    </CardContent>
  </Card>
);

const ControlStatisticsPanel: React.FC<ControlStatisticsPanelProps> = ({
  statistics,
  trends,
  progressSummary,
  insights,
  correlations,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Estadísticas y Análisis</h2>
        {progressSummary && (
          <Badge variant="outline" className="gap-2">
            <Calendar className="w-3 h-3" />
            {progressSummary.totalControls} controles en {progressSummary.daysTracked} días
          </Badge>
        )}
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="correlations">Correlaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <MetricsOverview statistics={statistics} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <TrendsOverview trends={trends} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <InsightsOverview insights={insights} />
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <CorrelationsOverview correlations={correlations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// =============================================
// COMPONENTE DE MÉTRICAS
// =============================================

interface MetricsOverviewProps {
  statistics: ControlFisicoStatistics;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ statistics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <MetricCard
      title="Peso Corporal"
      metric={statistics.peso}
      unit="kg"
      icon={Scale}
      color="text-blue-600"
    />
    
    <MetricCard
      title="Grasa Corporal"
      metric={statistics.grasaCorporal}
      unit="%"
      icon={Activity}
      color="text-red-600"
      showProgress
      maxValue={50}
    />
    
    <MetricCard
      title="Masa Muscular"
      metric={statistics.masaMuscular}
      unit="%"
      icon={Activity}
      color="text-green-600"
      showProgress
      maxValue={60}
    />
    
    <MetricCard
      title="Nivel de Energía"
      metric={statistics.nivelEnergia}
      unit="/5"
      icon={Heart}
      color="text-yellow-600"
      showProgress
      maxValue={5}
    />
    
    <MetricCard
      title="Estado de Ánimo"
      metric={statistics.estadoAnimo}
      unit="/5"
      icon={Brain}
      color="text-pink-600"
      showProgress
      maxValue={5}
    />
    
    <MetricCard
      title="Índice de Masa Corporal"
      metric={statistics.imc}
      unit=""
      icon={Target}
      color="text-purple-600"
    />
  </div>
);

// =============================================
// COMPONENTE DE TENDENCIAS
// =============================================

interface TrendsOverviewProps {
  trends?: TrendsAnalysis;
}

const TrendsOverview: React.FC<TrendsOverviewProps> = ({ trends }) => {
  if (!trends) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No hay datos suficientes para mostrar tendencias. Se necesitan al menos 2 controles para generar análisis de tendencias.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrendCard 
          title="Pérdida de Peso" 
          trend={trends.weightLoss} 
          icon={Scale} 
        />
        <TrendCard 
          title="Ganancia Muscular" 
          trend={trends.muscleGain} 
          icon={Activity} 
        />
        <TrendCard 
          title="Pérdida de Grasa" 
          trend={trends.fatLoss} 
          icon={TrendingDown} 
        />
        <TrendCard 
          title="Mejora de Energía" 
          trend={trends.energyImprovement} 
          icon={Heart} 
        />
      </div>
      
      {/* Progreso General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Progreso General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {trends.overallProgress.isPositive ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
              <div>
                <h3 className="font-semibold">
                  {trends.overallProgress.isPositive ? 'Progreso Positivo' : 'Área de Mejora'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {trends.overallProgress.description}
                </p>
              </div>
            </div>
            <Badge 
              variant={trends.overallProgress.isPositive ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {trends.overallProgress.percentage.toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// =============================================
// COMPONENTE DE INSIGHTS
// =============================================

interface InsightsOverviewProps {
  insights?: InsightsData;
}

const InsightsOverview: React.FC<InsightsOverviewProps> = ({ insights }) => {
  if (!insights) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No hay insights disponibles. Los insights se generan automáticamente basándose en el historial de controles.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Logros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Logros Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.achievements.length > 0 ? (
              insights.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-green-800 leading-relaxed">{achievement}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay logros registrados aún
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.length > 0 ? (
              insights.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-blue-800 leading-relaxed">{recommendation}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay recomendaciones disponibles
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Áreas de Atención */}
      {insights.concerns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Áreas de Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.concerns.map((concern, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-red-800 leading-relaxed">{concern}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Próximos Pasos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Próximos Pasos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.nextSteps.length > 0 ? (
              insights.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-xs font-medium">{index + 1}</span>
                  </div>
                  <span className="text-sm text-purple-800 leading-relaxed">{step}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay próximos pasos definidos
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// =============================================
// COMPONENTE DE CORRELACIONES
// =============================================

interface CorrelationsOverviewProps {
  correlations?: CorrelationAnalysis;
}

const CorrelationsOverview: React.FC<CorrelationsOverviewProps> = ({ correlations }) => {
  if (!correlations) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No hay datos suficientes para mostrar correlaciones. Se necesitan al menos 5 controles con métricas para generar análisis de correlación.
        </AlertDescription>
      </Alert>
    );
  }

  const getCorrelationColor = (value: number): string => {
    const abs = Math.abs(value);
    if (abs >= 0.7) return 'text-green-600';
    if (abs >= 0.5) return 'text-yellow-600';
    if (abs >= 0.3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCorrelationBadgeVariant = (value: number): "default" | "secondary" | "destructive" => {
    const abs = Math.abs(value);
    if (abs >= 0.7) return 'default';
    if (abs >= 0.5) return 'secondary';
    return 'destructive';
  };

  const getCorrelationLabel = (value: number): string => {
    const abs = Math.abs(value);
    if (abs >= 0.7) return 'Fuerte';
    if (abs >= 0.5) return 'Moderada';
    if (abs >= 0.3) return 'Débil';
    return 'Muy débil';
  };

  const getCorrelationDirection = (value: number): string => {
    if (value > 0) return 'Positiva';
    if (value < 0) return 'Negativa';
    return 'Neutral';
  };

  interface CorrelationItemProps {
    title: string;
    value: number;
    description: string;
  }

  const CorrelationItem: React.FC<CorrelationItemProps> = ({ title, value, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-lg font-bold ${getCorrelationColor(value)}`}>
          {value.toFixed(2)}
        </span>
        <div className="flex flex-col items-end space-y-1">
          <Badge variant={getCorrelationBadgeVariant(value)} className="text-xs">
            {getCorrelationLabel(value)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {getCorrelationDirection(value)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Matriz de Correlaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Correlaciones entre Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <CorrelationItem
              title="Peso vs Grasa Corporal"
              value={correlations.pesoVsGrasa}
              description="Relación entre el peso corporal y el porcentaje de grasa"
            />
            <CorrelationItem
              title="Peso vs Masa Muscular"
              value={correlations.pesoVsMusculo}
              description="Relación entre el peso corporal y la masa muscular"
            />
            <CorrelationItem
              title="Energía vs Estado de Ánimo"
              value={correlations.energiaVsAnimo}
              description="Relación entre el nivel de energía y el estado de ánimo"
            />
            <CorrelationItem
              title="Grasa vs Masa Muscular"
              value={correlations.grasaVsMusculo}
              description="Relación entre grasa corporal y masa muscular"
            />
          </div>
        </CardContent>
      </Card>

      {/* Correlaciones Significativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Correlaciones Significativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {correlations.interpretations.strongCorrelations.length > 0 ? (
              correlations.interpretations.strongCorrelations.map((correlation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-blue-800 leading-relaxed">{correlation}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No se encontraron correlaciones significativas
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insights de Correlación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-green-600" />
            Insights de Correlación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {correlations.interpretations.insights.length > 0 ? (
              correlations.interpretations.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-green-800 leading-relaxed">{insight}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay insights de correlación disponibles
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Explicación de Correlaciones */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Las correlaciones muestran qué tan relacionadas están las métricas entre sí. 
          Los valores van de -1 a 1, donde 1 indica correlación perfecta positiva, 
          -1 indica correlación perfecta negativa, y 0 indica ninguna correlación.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ControlStatisticsPanel;