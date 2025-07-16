// src/features/seguimiento-fisico/components/statistics/ControlStatisticsPanel.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Target, Award, AlertCircle, Calendar } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import { 
  ControlFisicoStatistics, 
  TrendsAnalysis, 
  PhysicalProgressSummary, 
  InsightsData,
  CorrelationAnalysis 
} from '../../types/seguimiento-fisico-api.types';

interface ControlStatisticsPanelProps {
  statistics: ControlFisicoStatistics;
  trends?: TrendsAnalysis;
  progressSummary?: PhysicalProgressSummary;
  insights?: InsightsData;
  correlations?: CorrelationAnalysis;
  isLoading?: boolean;
}

const ControlStatisticsPanel: React.FC<ControlStatisticsPanelProps> = ({
  statistics,
  trends,
  progressSummary,
  insights,
  correlations,
  isLoading
}) => {
  const MetricCard = ({ title, current, change, changePercent, trend, unit, icon: Icon, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold">{current || 'N/A'}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {change !== null && (
          <div className="flex items-center space-x-2 mt-1">
            <div className={`flex items-center space-x-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs font-medium">
                {change > 0 ? '+' : ''}{change} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{trend.description}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
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
          <Badge variant="outline">
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Peso</CardTitle>
        <TrendingUp className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{statistics.peso.current || 'N/A'} kg</div>
        <div className="flex items-center space-x-2 mt-1">
          <Badge variant={statistics.peso.hasImprovement ? "default" : "secondary"}>
            {statistics.peso.hasImprovement ? 'Mejorando' : 'Estable'}
          </Badge>
          {statistics.peso.change !== null && (
            <span className="text-sm text-muted-foreground">
              {statistics.peso.change > 0 ? '+' : ''}{statistics.peso.change} kg
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {statistics.peso.improvementMessage}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Grasa Corporal</CardTitle>
        <TrendingDown className="h-4 w-4 text-red-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{statistics.grasaCorporal.current || 'N/A'}%</div>
        <div className="flex items-center space-x-2 mt-1">
          <Badge variant={statistics.grasaCorporal.hasImprovement ? "default" : "secondary"}>
            {statistics.grasaCorporal.hasImprovement ? 'Mejorando' : 'Estable'}
          </Badge>
          {statistics.grasaCorporal.change !== null && (
            <span className="text-sm text-muted-foreground">
              {statistics.grasaCorporal.change > 0 ? '+' : ''}{statistics.grasaCorporal.change}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {statistics.grasaCorporal.improvementMessage}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Masa Muscular</CardTitle>
        <TrendingUp className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{statistics.masaMuscular.current || 'N/A'}%</div>
        <div className="flex items-center space-x-2 mt-1">
          <Badge variant={statistics.masaMuscular.hasImprovement ? "default" : "secondary"}>
            {statistics.masaMuscular.hasImprovement ? 'Mejorando' : 'Estable'}
          </Badge>
          {statistics.masaMuscular.change !== null && (
            <span className="text-sm text-muted-foreground">
              {statistics.masaMuscular.change > 0 ? '+' : ''}{statistics.masaMuscular.change}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {statistics.masaMuscular.improvementMessage}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Nivel de Energía</CardTitle>
        <TrendingUp className="h-4 w-4 text-yellow-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{statistics.nivelEnergia.current || 'N/A'}/5</div>
        <Progress value={(statistics.nivelEnergia.current || 0) * 20} className="mt-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {statistics.nivelEnergia.improvementMessage}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Estado de Ánimo</CardTitle>
        <TrendingUp className="h-4 w-4 text-pink-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{statistics.estadoAnimo.current || 'N/A'}/5</div>
        <Progress value={(statistics.estadoAnimo.current || 0) * 20} className="mt-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {statistics.estadoAnimo.improvementMessage}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">IMC</CardTitle>
        <Target className="h-4 w-4 text-purple-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{statistics.imc.current?.toFixed(1) || 'N/A'}</div>
        <div className="flex items-center space-x-2 mt-1">
          <Badge variant={statistics.imc.hasImprovement ? "default" : "secondary"}>
            {statistics.imc.hasImprovement ? 'Mejorando' : 'Estable'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {statistics.imc.improvementMessage}
        </p>
      </CardContent>
    </Card>
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
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No hay datos suficientes para mostrar tendencias</p>
        </CardContent>
      </Card>
    );
  }

  const TrendCard = ({ title, trend, icon: Icon }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Badge variant={trend.isPositive ? "default" : "secondary"}>
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {trend.trend}
          </Badge>
          <span className="text-sm font-medium">{trend.percentage.toFixed(1)}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{trend.description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TrendCard title="Pérdida de Peso" trend={trends.weightLoss} icon={TrendingDown} />
      <TrendCard title="Ganancia Muscular" trend={trends.muscleGain} icon={TrendingUp} />
      <TrendCard title="Pérdida de Grasa" trend={trends.fatLoss} icon={TrendingDown} />
      <TrendCard title="Mejora de Energía" trend={trends.energyImprovement} icon={TrendingUp} />
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
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No hay insights disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Logros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-800">{achievement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                <span className="text-sm text-blue-800">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {insights.concerns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Áreas de Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.concerns.map((concern, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                  <span className="text-sm text-red-800">{concern}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Próximos Pasos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-purple-50 rounded">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-purple-600 text-xs font-medium">{index + 1}</span>
                </div>
                <span className="text-sm text-purple-800">{step}</span>
              </div>
            ))}
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
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No hay datos suficientes para mostrar correlaciones</p>
        </CardContent>
      </Card>
    );
  }

  const getCorrelationColor = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 0.7) return 'text-green-600';
    if (abs >= 0.5) return 'text-yellow-600';
    if (abs >= 0.3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCorrelationLabel = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 0.7) return 'Fuerte';
    if (abs >= 0.5) return 'Moderada';
    if (abs >= 0.3) return 'Débil';
    return 'Muy débil';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Correlaciones entre Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Peso vs Grasa Corporal</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getCorrelationColor(correlations.pesoVsGrasa)}`}>
                    {correlations.pesoVsGrasa.toFixed(2)}
                  </span>
                  <Badge variant="outline">
                    {getCorrelationLabel(correlations.pesoVsGrasa)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Peso vs Masa Muscular</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getCorrelationColor(correlations.pesoVsMusculo)}`}>
                    {correlations.pesoVsMusculo.toFixed(2)}
                  </span>
                  <Badge variant="outline">
                    {getCorrelationLabel(correlations.pesoVsMusculo)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Energía vs Estado de Ánimo</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getCorrelationColor(correlations.energiaVsAnimo)}`}>
                    {correlations.energiaVsAnimo.toFixed(2)}
                  </span>
                  <Badge variant="outline">
                    {getCorrelationLabel(correlations.energiaVsAnimo)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Grasa vs Masa Muscular</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getCorrelationColor(correlations.grasaVsMusculo)}`}>
                    {correlations.grasaVsMusculo.toFixed(2)}
                  </span>
                  <Badge variant="outline">
                    {getCorrelationLabel(correlations.grasaVsMusculo)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Correlaciones Significativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {correlations.interpretations.strongCorrelations.map((correlation, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-800">{correlation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Insights de Correlación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {correlations.interpretations.insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                <span className="text-sm text-green-800">{insight}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlStatisticsPanel;