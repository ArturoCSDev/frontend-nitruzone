// src/features/seguimiento-fisico/types/seguimiento-fisico-api.types.ts

import { ControlFisicoDetallado } from "@/features/nutrition-plans/types/asesoria-completa-api.types";

// =============================================
// CREAR CONTROL FÍSICO
// =============================================

export interface CreateControlFisicoRequest {
    clienteId: string;
    planId?: string;
    fechaControl: string; // ISO date string
    peso?: number;
    grasaCorporal?: number;
    masaMuscular?: number;
    medidasAdicionales?: Record<string, unknown>;
    nivelEnergia?: number; // 1-5
    estadoAnimo?: number; // 1-5
    notas?: string;
    realizadoPor?: string;
    proximaCita?: string; // ISO date string
  }
  
  export interface CreateControlFisicoResponse {
    controlFisico: ControlFisicoInfo;
    message: string;
  }
  
  export interface ControlFisicoInfo {
    id: string;
    clienteId: string;
    planId: string | null;
    fechaControl: string;
    peso: number | null;
    grasaCorporal: number | null;
    masaMuscular: number | null;
    medidasAdicionales: Record<string, unknown> | null;
    nivelEnergia: number | null;
    estadoAnimo: number | null;
    notas: string | null;
    realizadoPor: string | null;
    proximaCita: string | null;
    hasCompleteMetrics: boolean;
    hasSubjectiveEvaluation: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
  }
  
  // =============================================
  // LISTAR CONTROLES FÍSICOS
  // =============================================
  
  export interface ListControlFisicoParams {
    clienteId?: string;
    planId?: string;
    fechaInicio?: string; // ISO date string
    fechaFin?: string; // ISO date string
    onlyWithMetrics?: boolean;
    onlyWithSubjectiveEvaluation?: boolean;
    onlyRecent?: boolean;
    realizadoPor?: string;
  }
  
  export interface ListControlFisicoResponse {
    controles: ControlFisicoItem[];
    total: number;
    summary: ControlFisicoSummary;
  }
  
  export interface ControlFisicoItem {
    id: string;
    clienteId: string;
    planId: string | null;
    fechaControl: string;
    peso: number | null;
    grasaCorporal: number | null;
    masaMuscular: number | null;
    medidasAdicionales: Record<string, unknown> | null;
    nivelEnergia: number | null;
    estadoAnimo: number | null;
    notas: string | null;
    realizadoPor: string | null;
    proximaCita: string | null;
    hasCompleteMetrics: boolean;
    hasSubjectiveEvaluation: boolean;
    isRecentControl: boolean;
    diasDesdeControl: number;
    fechaCreacion: string;
    fechaActualizacion: string;
  }
  
  export interface ControlFisicoSummary {
    totalWithMetrics: number;
    totalWithoutMetrics: number;
    totalWithSubjectiveEvaluation: number;
    totalWithoutSubjectiveEvaluation: number;
    totalRecent: number;
    averageDaysBetweenControls: number | null;
    latestControl: string | null;
    oldestControl: string | null;
  }
  
  // =============================================
  // OBTENER CONTROL FÍSICO ESPECÍFICO
  // =============================================
  
  export interface GetControlFisicoParams {
    includeStatistics?: boolean;
    includeTrends?: boolean;
    includeComparisons?: boolean;
    statisticsDays?: number;
  }
  
  export interface GetControlFisicoResponse {
    controlFisico: ControlFisicoDetallado;
    cliente: ClienteControlInfo | null;
    
    // Nuevos campos opcionales para estadísticas
    statistics?: ControlFisicoStatistics;
    progressSummary?: PhysicalProgressSummary;
    trends?: TrendsAnalysis;
    goals?: GoalProgress[];
    correlations?: CorrelationAnalysis;
    chartData?: ChartData;
    insights?: InsightsData;
  }
  
  // =============================================
  // NUEVOS TIPOS PARA ESTADÍSTICAS
  // =============================================
  
  export interface MetricPoint {
    fecha: string;
    valor: number;
    isCurrentControl?: boolean;
  }
  
  export interface TrendAnalysis {
    trend: 'ASCENDING' | 'DESCENDING' | 'STABLE';
    percentage: number;
    description: string;
    isPositive: boolean;
  }
  
  export interface MetricStatistics {
    current: number | null;
    previous: number | null;
    change: number | null;
    changePercent: number | null;
    min: number;
    max: number;
    average: number;
    median: number;
    standardDeviation: number;
    dataPoints: MetricPoint[];
    trend: TrendAnalysis;
    hasImprovement: boolean;
    improvementMessage: string;
  }
  
  export interface ControlFisicoStatistics {
    peso: MetricStatistics;
    grasaCorporal: MetricStatistics;
    masaMuscular: MetricStatistics;
    nivelEnergia: MetricStatistics;
    estadoAnimo: MetricStatistics;
    imc: MetricStatistics;
  }
  
  export interface PhysicalProgressSummary {
    totalControls: number;
    daysTracked: number;
    firstControlDate: string | null;
    lastControlDate: string | null;
    consistencyRate: number;
    mostActiveMonth: string | null;
    averageTimeBetweenControls: number;
  }
  
  export interface TrendsAnalysis {
    weightLoss: TrendAnalysis;
    muscleGain: TrendAnalysis;
    fatLoss: TrendAnalysis;
    energyImprovement: TrendAnalysis;
    overallProgress: TrendAnalysis;
  }
  
  export interface GoalProgress {
    metricName: string;
    targetValue: number | null;
    currentValue: number | null;
    initialValue: number | null;
    progressPercent: number;
    isOnTrack: boolean;
    estimatedCompletionDate: string | null;
    daysToGoal: number | null;
  }
  
  export interface CorrelationAnalysis {
    pesoVsGrasa: number;
    pesoVsMusculo: number;
    energiaVsAnimo: number;
    grasaVsMusculo: number;
    interpretations: {
      strongCorrelations: string[];
      insights: string[];
    };
  }
  
  export interface ChartData {
    weightChart: MetricPoint[];
    bodyCompositionChart: {
      fecha: string;
      grasaCorporal: number | null;
      masaMuscular: number | null;
      peso: number | null;
    }[];
    wellnessChart: {
      fecha: string;
      nivelEnergia: number | null;
      estadoAnimo: number | null;
    }[];
    progressChart: {
      fecha: string;
      imc: number | null;
      peso: number | null;
      grasaCorporal: number | null;
    }[];
    monthlyAverages: {
      mes: string;
      pesoPromedio: number | null;
      grasaPromedio: number | null;
      musculoPromedio: number | null;
      energiaPromedio: number | null;
    }[];
  }
  
  export interface InsightsData {
    achievements: string[];
    concerns: string[];
    recommendations: string[];
    nextSteps: string[];
  }
  
  // =============================================
  // ACTUALIZAR ClienteControlInfo PARA INCLUIR IMC
  // =============================================
  
  export interface ClienteControlInfo {
    id: string;
    nombre: string;
    edad: number | null;
    peso: number | null;
    altura: number | null;
    genero: string | null;
    hasCompleteProfile: boolean;
    imc: number | null; // ← AGREGADO
  }
  
  // =============================================
  // ACTUALIZAR CONTROL FÍSICO
  // =============================================
  
  export interface UpdateControlFisicoRequest {
    planId?: string;
    fechaControl?: string;
    peso?: number;
    grasaCorporal?: number;
    masaMuscular?: number;
    medidasAdicionales?: Record<string, unknown>;
    nivelEnergia?: number;
    estadoAnimo?: number;
    notas?: string;
    realizadoPor?: string;
    proximaCita?: string;
  }
  
  export interface UpdateControlFisicoResponse {
    controlFisico: ControlFisicoInfo;
    message: string;
  }
  
  // =============================================
  // ELIMINAR CONTROL FÍSICO
  // =============================================
  
  export interface DeleteControlFisicoResponse {
    message: string;
    deletedControl: {
      id: string;
      clienteId: string;
      fechaControl: string;
      fechaCreacion: string;
    };
  }
  
  // =============================================
  // TIPOS AUXILIARES
  // =============================================
  
  export type NivelEnergia = 1 | 2 | 3 | 4 | 5;
  export type EstadoAnimo = 1 | 2 | 3 | 4 | 5;
  
  export interface MedidasAdicionales {
    [key: string]: string | number;
  }
  
  // Tipos para análisis y estadísticas
  export interface ControlFisicoStats {
    totalControles: number;
    promediosPorMes: {
      mes: string;
      peso: number | null;
      grasaCorporal: number | null;
      masaMuscular: number | null;
      nivelEnergia: number | null;
      estadoAnimo: number | null;
    }[];
    tendencias: {
      peso: 'subiendo' | 'bajando' | 'estable';
      grasaCorporal: 'subiendo' | 'bajando' | 'estable';
      masaMuscular: 'subiendo' | 'bajando' | 'estable';
    };
    ultimoControl: ControlFisicoItem | null;
    proximoControl: string | null;
  }