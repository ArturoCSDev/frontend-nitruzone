// src/features/seguimiento-fisico/hooks/useSeguimientoFisico.ts
import { useQuery } from '@tanstack/react-query';
import { seguimientoFisicoApi } from '../api/seguimiento-fisico.api';
import { ListControlFisicoParams } from '../types/seguimiento-fisico-api.types';

// =============================================
// OBTENER CONTROL FÍSICO ESPECÍFICO
// =============================================

export const useControlFisico = (controlId: string) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'control', controlId],
    queryFn: () => seguimientoFisicoApi.getControl(controlId),
    enabled: !!controlId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// LISTAR CONTROLES FÍSICOS
// =============================================

export const useListControlsFisicos = (params?: ListControlFisicoParams) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'controls', params],
    queryFn: () => seguimientoFisicoApi.listControls(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// OBTENER CONTROLES POR CLIENTE
// =============================================

export const useControlsByCliente = (clienteId: string, params?: Omit<ListControlFisicoParams, 'clienteId'>) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'controls', clienteId, params],
    queryFn: () => seguimientoFisicoApi.getControlsByCliente(clienteId, params),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// OBTENER CONTROLES POR PLAN
// =============================================

export const useControlsByPlan = (planId: string, params?: Omit<ListControlFisicoParams, 'planId'>) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'controls-by-plan', planId, params],
    queryFn: () => seguimientoFisicoApi.getControlsByPlan(planId, params),
    enabled: !!planId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// OBTENER CONTROLES RECIENTES
// =============================================

export const useRecentControls = (clienteId: string, params?: ListControlFisicoParams) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'recent-controls', clienteId, params],
    queryFn: () => seguimientoFisicoApi.getRecentControls(clienteId, params),
    enabled: !!clienteId,
    staleTime: 2 * 60 * 1000, // 2 minutos (más frecuente para controles recientes)
    refetchOnWindowFocus: true,
  });
};

// =============================================
// OBTENER CONTROLES EN RANGO DE FECHAS
// =============================================

export const useControlsInRange = (
  clienteId: string, 
  fechaInicio: string, 
  fechaFin: string,
  params?: Omit<ListControlFisicoParams, 'clienteId' | 'fechaInicio' | 'fechaFin'>
) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'controls-range', clienteId, fechaInicio, fechaFin, params],
    queryFn: () => seguimientoFisicoApi.getControlsInRange(clienteId, fechaInicio, fechaFin, params),
    enabled: !!clienteId && !!fechaInicio && !!fechaFin,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// OBTENER CONTROLES CON MÉTRICAS
// =============================================

export const useControlsWithMetrics = (clienteId: string) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'controls-with-metrics', clienteId],
    queryFn: () => seguimientoFisicoApi.getControlsWithMetrics(clienteId),
    enabled: !!clienteId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// OBTENER CONTROLES CON EVALUACIÓN SUBJETIVA
// =============================================

export const useControlsWithSubjectiveEvaluation = (clienteId: string) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'controls-with-subjective', clienteId],
    queryFn: () => seguimientoFisicoApi.getControlsWithSubjectiveEvaluation(clienteId),
    enabled: !!clienteId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// HOOKS ESPECIALIZADOS PARA ANÁLISIS
// =============================================

// Obtener todos los controles de un cliente para análisis
export const useControlsForAnalysis = (clienteId: string) => {
  return useControlsByCliente(clienteId, {
    onlyWithMetrics: true
  });
};

// Obtener controles de los últimos 30 días
export const useControlsLast30Days = (clienteId: string) => {
  const fechaFin = new Date().toISOString().split('T')[0];
  const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return useControlsInRange(clienteId, fechaInicio, fechaFin);
};

// Obtener controles de los últimos 3 meses
export const useControlsLast3Months = (clienteId: string) => {
  const fechaFin = new Date().toISOString().split('T')[0];
  const fechaInicio = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return useControlsInRange(clienteId, fechaInicio, fechaFin);
};

// Obtener el último control de un cliente
export const useLastControl = (clienteId: string) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'last-control', clienteId],
    queryFn: async () => {
      const response = await seguimientoFisicoApi.getControlsByCliente(clienteId);
      return response.controles[0] || null;
    },
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};