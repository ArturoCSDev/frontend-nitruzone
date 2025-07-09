// src/features/seguimiento-fisico/types/seguimiento-fisico-api.types.ts

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
  
  export interface GetControlFisicoResponse {
    controlFisico: ControlFisicoDetallado;
    cliente: ClienteControlInfo | null;
  }
  
  export interface ControlFisicoDetallado {
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
    
    // Metadata calculada
    hasCompleteMetrics: boolean;
    hasSubjectiveEvaluation: boolean;
    tieneMetricasFisicas: boolean;
    tieneEvaluacionSubjetiva: boolean;
    isRecentControl: boolean;
    diasDesdeControl: number;
    needsFollowUp: boolean;
    
    // Validaciones
    isValidNivelEnergia: boolean;
    isValidEstadoAnimo: boolean;
    
    // Timestamps
    fechaCreacion: string;
    fechaActualizacion: string;
  }
  
  export interface ClienteControlInfo {
    id: string;
    nombre: string;
    edad: number | null;
    peso: number | null;
    altura: number | null;
    genero: string | null;
    hasCompleteProfile: boolean;
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