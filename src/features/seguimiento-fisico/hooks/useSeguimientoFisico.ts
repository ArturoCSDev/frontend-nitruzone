// src/features/seguimiento-fisico/hooks/useSeguimientoFisico.ts - SOLO actualización del hook useControlFisico

import { useQuery } from '@tanstack/react-query';
import { seguimientoFisicoApi } from '../api/seguimiento-fisico.api';
import { ListControlFisicoParams } from '../types/seguimiento-fisico-api.types';

// =============================================
// TIPOS ADICIONALES PARA EL HOOK ACTUALIZADO
// =============================================

export interface GetControlFisicoParams {
  includeStatistics?: boolean;
  includeTrends?: boolean;
  includeComparisons?: boolean;
  statisticsDays?: number;
}

export interface ControlFisicoQueryConfig {
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
}

// =============================================
// HOOK ACTUALIZADO useControlFisico
// =============================================

export const useControlFisico = (
  controlId: string, 
  params?: GetControlFisicoParams,
  config?: ControlFisicoQueryConfig
) => {
  const {
    staleTime = 10 * 60 * 1000, // 10 minutos
    refetchInterval,
    enabled = true
  } = config || {};

  return useQuery({
    queryKey: ['seguimiento-fisico', 'control', controlId, params],
    queryFn: () => {
      // Si no hay parámetros, usar la función original
      if (!params) {
        return seguimientoFisicoApi.getControl(controlId);
      }
      
      // Si hay parámetros, usar la función con query parameters
      return seguimientoFisicoApi.getControlWithParams(controlId, params);
    },
    enabled: !!controlId && enabled,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus: false,
  });
};

// =============================================
// HOOKS ESPECIALIZADOS PARA DIFERENTES CASOS DE USO
// =============================================
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

// Hook para obtener control con estadísticas completas (dashboard)
export const useControlFisicoDashboard = (
  controlId: string, 
  statisticsDays: number = 90
) => {
  return useControlFisico(controlId, {
    includeStatistics: true,
    includeTrends: true,
    includeComparisons: true,
    statisticsDays
  }, {
    staleTime: 5 * 60 * 1000, // 5 minutos (más frecuente para dashboard)
    refetchInterval: 30000, // 30 segundos para datos en tiempo real
  });
};

// Hook para obtener solo tendencias
export const useControlFisicoTrends = (
  controlId: string, 
  statisticsDays: number = 90
) => {
  return useControlFisico(controlId, {
    includeStatistics: false,
    includeTrends: true,
    includeComparisons: false,
    statisticsDays
  });
};

// Hook para obtener datos para gráficos
export const useControlFisicoCharts = (
  controlId: string, 
  statisticsDays: number = 90
) => {
  return useControlFisico(controlId, {
    includeStatistics: false,
    includeTrends: false,
    includeComparisons: true,
    statisticsDays
  });
};

// Hook para obtener control básico (sin estadísticas)
export const useControlFisicoBasic = (controlId: string) => {
  return useControlFisico(controlId, {
    includeStatistics: false,
    includeTrends: false,
    includeComparisons: false
  });
};

// =============================================
// HOOKS EXISTENTES (NO MODIFICADOS)
// =============================================

// ... el resto de hooks permanecen igual
export const useListControlsFisicos = (params?: ListControlFisicoParams) => {
  return useQuery({
    queryKey: ['seguimiento-fisico', 'controls', params],
    queryFn: () => seguimientoFisicoApi.listControls(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// ... etc (resto de hooks sin cambios)