// src/features/seguimiento-fisico/components/charts/ControlFisicoCharts.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Scale, Heart } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import { ChartData, TrendsAnalysis, ControlFisicoStatistics } from '../../types/seguimiento-fisico-api.types';

interface ControlFisicoChartsProps {
  chartData: ChartData;
  trends?: TrendsAnalysis;
  statistics?: ControlFisicoStatistics;
  isLoading?: boolean;
}

const formatTooltipDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{formatTooltipDate(label)}</p>
          {payload.map((entry: any, index: number) => (
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
  const formatDate = (dateString: string) => {
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

  const weightChartData = chartData.weightChart.map(item => ({
    ...item,
    fecha: formatDate(item.fecha)
  }));

  const bodyCompositionData = chartData.bodyCompositionChart.map(item => ({
    ...item,
    fecha: formatDate(item.fecha)
  }));

  const wellnessData = chartData.wellnessChart.map(item => ({
    ...item,
    fecha: formatDate(item.fecha)
  }));

  const progressData = chartData.progressChart.map(item => ({
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
          <WeightChart data={weightChartData} statistics={statistics?.peso} />
        </TabsContent>

        <TabsContent value="composition" className="space-y-4">
          <BodyCompositionChart data={bodyCompositionData} statistics={statistics} />
        </TabsContent>

        <TabsContent value="wellness" className="space-y-4">
          <WellnessChart data={wellnessData} statistics={statistics} />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <ProgressChart data={progressData} statistics={statistics} />
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
  data: any[];
  statistics?: any;
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
          <span>Cambio: {statistics.change > 0 ? '+' : ''}{statistics.change}kg</span>
          <Badge variant={statistics.hasImprovement ? "default" : "secondary"}>
            {statistics.hasImprovement ? 'Mejorando' : 'Estable'}
          </Badge>
        </div>
      )}
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#1d4ed8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// =============================================
// COMPONENTE DE COMPOSICIÓN CORPORAL
// =============================================

interface BodyCompositionChartProps {
  data: any[];
  statistics?: any;
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
        </div>
      )}
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="peso"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Peso (kg)"
          />
          <Line
            type="monotone"
            dataKey="grasaCorporal"
            stroke="#ef4444"
            strokeWidth={2}
            name="Grasa Corporal (%)"
          />
          <Line
            type="monotone"
            dataKey="masaMuscular"
            stroke="#10b981"
            strokeWidth={2}
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
  data: any[];
  statistics?: any;
}

const WellnessChart: React.FC<WellnessChartProps> = ({ data, statistics }) => (
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis domain={[0, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="nivelEnergia"
            stroke="#eab308"
            strokeWidth={3}
            name="Nivel de Energía"
          />
          <Line
            type="monotone"
            dataKey="estadoAnimo"
            stroke="#ec4899"
            strokeWidth={3}
            name="Estado de Ánimo"
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// =============================================
// COMPONENTE DE PROGRESO GENERAL
// =============================================

interface ProgressChartProps {
  data: any[];
  statistics?: any;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, statistics }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Progreso General
      </CardTitle>
      {statistics && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>IMC: {statistics.imc?.current?.toFixed(1) || 'N/A'}</span>
        </div>
      )}
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="imc"
            stroke="#8b5cf6"
            strokeWidth={3}
            name="IMC"
          />
          <Line
            type="monotone"
            dataKey="grasaCorporal"
            stroke="#ef4444"
            strokeWidth={2}
            name="Grasa Corporal (%)"
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
  data: any[];
}

const MonthlyAveragesChart: React.FC<MonthlyAveragesChartProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Promedios Mensuales</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="pesoPromedio" fill="#3b82f6" name="Peso Promedio" />
          <Bar dataKey="grasaPromedio" fill="#ef4444" name="Grasa Promedio" />
          <Bar dataKey="energiaPromedio" fill="#eab308" name="Energía Promedio" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default ControlFisicoCharts;