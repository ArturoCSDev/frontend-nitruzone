// src/features/seguimiento-fisico/components/charts/ControlFisicoCharts.tsx
import React from 'react';
import { Activity, TrendingUp, TrendingDown, Scale, Heart, Target, Calendar } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Recharts
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  ComposedChart,
  Area,
  AreaChart,
  TooltipProps
} from 'recharts';

// Types
import { 
  ChartData, 
  TrendsAnalysis, 
  ControlFisicoStatistics,
  MetricPoint 
} from '../../types/seguimiento-fisico-api.types';

interface ControlFisicoChartsProps {
  chartData: ChartData;
  trends?: TrendsAnalysis;
  statistics?: ControlFisicoStatistics;
  isLoading?: boolean;
}

interface ChartTooltipPayload {
  value: number;
  dataKey: string;
  name: string;
  color: string;
  unit?: string;
}

interface ChartTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
}

const formatTooltipDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const CustomTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{formatTooltipDate(label)}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.unit || ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ControlFisicoCharts: React.FC<ControlFisicoChartsProps> = ({
  chartData,
  trends,
  statistics,
  isLoading
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  const processedWeightData = chartData.weightChart.map(item => ({
    ...item,
    fecha: formatDate(item.fecha)
  }));

  const processedBodyCompositionData = chartData.bodyCompositionChart.map(item => ({
    ...item,
    fecha: formatDate(item.fecha)
  }));

  const processedWellnessData = chartData.wellnessChart.map(item => ({
    ...item,
    fecha: formatDate(item.fecha)
  }));

  const processedProgressData = chartData.progressChart.map(item => ({
    ...item,
    fecha: formatDate(item.fecha)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Análisis y Gráficas</h2>
        {trends && (
          <div className="flex items-center gap-2">
            <Badge variant={trends.overallProgress.isPositive ? "default" : "secondary"}>
              {trends.overallProgress.isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {trends.overallProgress.description}
            </Badge>
          </div>
        )}
      </div>

      <Tabs defaultValue="weight" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weight">Peso</TabsTrigger>
          <TabsTrigger value="composition">Composición</TabsTrigger>
          <TabsTrigger value="wellness">Bienestar</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-4">
          <WeightChart data={processedWeightData} statistics={statistics?.peso} />
        </TabsContent>

        <TabsContent value="composition" className="space-y-4">
          <BodyCompositionChart data={processedBodyCompositionData} statistics={statistics} />
        </TabsContent>

        <TabsContent value="wellness" className="space-y-4">
          <WellnessChart data={processedWellnessData} statistics={statistics} />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <ProgressChart data={processedProgressData} statistics={statistics} />
          <MonthlyAveragesChart data={chartData.monthlyAverages} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// =============================================
// COMPONENTE DE GRÁFICA DE PESO
// =============================================

interface WeightChartProps {
  data: (MetricPoint & { fecha: string })[];
  statistics?: ControlFisicoStatistics['peso'];
}

const WeightChart: React.FC<WeightChartProps> = ({ data, statistics }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Scale className="w-5 h-5" />
        Evolución del Peso
      </CardTitle>
      {statistics && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Actual: {statistics.current}kg</span>
          <span>Cambio: {statistics.change && statistics.change > 0 ? '+' : ''}{statistics.change}kg</span>
          <Badge variant={statistics.hasImprovement ? "default" : "secondary"}>
            {statistics.hasImprovement ? 'Mejorando' : 'Estable'}
          </Badge>
          <div className="flex items-center gap-1">
            {statistics.trend.isPositive ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span className="text-xs">{statistics.trend.percentage.toFixed(1)}%</span>
          </div>
        </div>
      )}
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="fecha" 
            className="text-muted-foreground"
            fontSize={12}
          />
          <YAxis 
            className="text-muted-foreground"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="valor"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#weightGradient)"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#1d4ed8' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// =============================================
// COMPONENTE DE COMPOSICIÓN CORPORAL
// =============================================

interface BodyCompositionChartProps {
  data: ChartData['bodyCompositionChart'];
  statistics?: ControlFisicoStatistics;
}

const BodyCompositionChart: React.FC<BodyCompositionChartProps> = ({ data, statistics }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Composición Corporal
      </CardTitle>
      {statistics && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Grasa: {statistics.grasaCorporal?.current}%</span>
          <span>Músculo: {statistics.masaMuscular?.current}%</span>
          <div className="flex items-center gap-2">
            <Badge variant={statistics.grasaCorporal?.hasImprovement ? "default" : "secondary"}>
              Grasa {statistics.grasaCorporal?.hasImprovement ? 'Mejorando' : 'Estable'}
            </Badge>
            <Badge variant={statistics.masaMuscular?.hasImprovement ? "default" : "secondary"}>
              Músculo {statistics.masaMuscular?.hasImprovement ? 'Mejorando' : 'Estable'}
            </Badge>
          </div>
        </div>
      )}
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="muscleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="fatGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="fecha" 
            className="text-muted-foreground"
            fontSize={12}
          />
          <YAxis 
            className="text-muted-foreground"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="peso"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Peso (kg)"
            dot={{ r: 3 }}
          />
          <Area
            type="monotone"
            dataKey="grasaCorporal"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#fatGradient)"
            name="Grasa Corporal (%)"
          />
          <Area
            type="monotone"
            dataKey="masaMuscular"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#muscleGradient)"
            name="Masa Muscular (%)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// =============================================
// COMPONENTE DE BIENESTAR
// =============================================

interface WellnessChartProps {
  data: ChartData['wellnessChart'];
  statistics?: ControlFisicoStatistics;
}

const WellnessChart: React.FC<WellnessChartProps> = ({ data, statistics }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Bienestar General
        </CardTitle>
        {statistics && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Energía: {statistics.nivelEnergia?.current}/5</span>
            <span>Ánimo: {statistics.estadoAnimo?.current}/5</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="fecha" 
              className="text-muted-foreground"
              fontSize={12}
            />
            <YAxis 
              domain={[0, 5]} 
              className="text-muted-foreground"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="nivelEnergia"
              stroke="#eab308"
              strokeWidth={3}
              name="Nivel de Energía"
              dot={{ fill: '#eab308', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="estadoAnimo"
              stroke="#ec4899"
              strokeWidth={3}
              name="Estado de Ánimo"
              dot={{ fill: '#ec4899', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* Wellness Progress Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Nivel de Energía</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">
                {statistics?.nivelEnergia?.current || 0}/5
              </span>
              <Badge variant={
                (statistics?.nivelEnergia?.current || 0) >= 4 ? "default" : 
                (statistics?.nivelEnergia?.current || 0) >= 3 ? "secondary" : "destructive"
              }>
                {(statistics?.nivelEnergia?.current || 0) >= 4 ? 'Alto' : 
                 (statistics?.nivelEnergia?.current || 0) >= 3 ? 'Moderado' : 'Bajo'}
              </Badge>
            </div>
            <Progress value={(statistics?.nivelEnergia?.current || 0) * 20} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {statistics?.nivelEnergia?.improvementMessage || 'Sin datos suficientes'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Estado de Ánimo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">
                {statistics?.estadoAnimo?.current || 0}/5
              </span>
              <Badge variant={
                (statistics?.estadoAnimo?.current || 0) >= 4 ? "default" : 
                (statistics?.estadoAnimo?.current || 0) >= 3 ? "secondary" : "destructive"
              }>
                {(statistics?.estadoAnimo?.current || 0) >= 4 ? 'Excelente' : 
                 (statistics?.estadoAnimo?.current || 0) >= 3 ? 'Bueno' : 'Regular'}
              </Badge>
            </div>
            <Progress value={(statistics?.estadoAnimo?.current || 0) * 20} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {statistics?.estadoAnimo?.improvementMessage || 'Sin datos suficientes'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// =============================================
// COMPONENTE DE PROGRESO GENERAL
// =============================================

interface ProgressChartProps {
  data: ChartData['progressChart'];
  statistics?: ControlFisicoStatistics;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, statistics }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="w-5 h-5" />
        Progreso General
      </CardTitle>
      {statistics && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>IMC: {statistics.imc?.current?.toFixed(1) || 'N/A'}</span>
          <Badge variant={statistics.imc?.hasImprovement ? "default" : "secondary"}>
            {statistics.imc?.hasImprovement ? 'Mejorando' : 'Estable'}
          </Badge>
        </div>
      )}
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="fecha" 
            className="text-muted-foreground"
            fontSize={12}
          />
          <YAxis 
            className="text-muted-foreground"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="imc"
            stroke="#8b5cf6"
            strokeWidth={3}
            name="IMC"
            dot={{ fill: '#8b5cf6', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="grasaCorporal"
            stroke="#ef4444"
            strokeWidth={2}
            name="Grasa Corporal (%)"
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// =============================================
// COMPONENTE DE PROMEDIOS MENSUALES
// =============================================

interface MonthlyAveragesChartProps {
  data: ChartData['monthlyAverages'];
}

const MonthlyAveragesChart: React.FC<MonthlyAveragesChartProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Promedios Mensuales
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="mes" 
            className="text-muted-foreground"
            fontSize={12}
          />
          <YAxis 
            className="text-muted-foreground"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="pesoPromedio" 
            fill="#3b82f6" 
            name="Peso Promedio"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="grasaPromedio" 
            fill="#ef4444" 
            name="Grasa Promedio"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="energiaPromedio" 
            fill="#eab308" 
            name="Energía Promedio"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default ControlFisicoCharts;