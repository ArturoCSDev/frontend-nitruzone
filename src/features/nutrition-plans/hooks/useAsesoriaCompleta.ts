// src/features/nutrition-plans/hooks/useAsesoriaCompleta.ts
import { useQuery } from '@tanstack/react-query';
import { asesoriaCompletaApi } from '../api/asesoria-completa.api';
import { GetAsesoriaCompletaParams, GetEstadisticasParams } from '../types/asesoria-completa-api.types';

// =============================================
// ASESORÍA COMPLETA
// =============================================

export const useAsesoriaCompleta = (clienteId: string, params?: GetAsesoriaCompletaParams) => {
  return useQuery({
    queryKey: ['asesoria-completa', clienteId, params],
    queryFn: () => asesoriaCompletaApi.getAsesoriaCompleta(clienteId, params),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// RESUMEN ASESORÍA (versión ligera)
// =============================================

export const useResumenAsesoria = (clienteId: string) => {
  return useQuery({
    queryKey: ['resumen-asesoria', clienteId],
    queryFn: () => asesoriaCompletaApi.getResumenAsesoria(clienteId),
    enabled: !!clienteId,
    staleTime: 2 * 60 * 1000, // 2 minutos (más frecuente para resumen)
    refetchOnWindowFocus: true,
  });
};

// =============================================
// ALERTAS
// =============================================

export const useAlertas = (clienteId: string) => {
  return useQuery({
    queryKey: ['alertas-asesoria', clienteId],
    queryFn: () => asesoriaCompletaApi.getAlertas(clienteId),
    enabled: !!clienteId,
    staleTime: 1 * 60 * 1000, // 1 minuto (muy frecuente para alertas)
    refetchOnWindowFocus: true,
  });
};

// =============================================
// ESTADÍSTICAS
// =============================================

export const useEstadisticas = (clienteId: string, params?: GetEstadisticasParams) => {
  return useQuery({
    queryKey: ['estadisticas-asesoria', clienteId, params],
    queryFn: () => asesoriaCompletaApi.getEstadisticas(clienteId, params),
    enabled: !!clienteId,
    staleTime: 10 * 60 * 1000, // 10 minutos (menos frecuente para estadísticas)
    refetchOnWindowFocus: false,
  });
};

// =============================================
// HEALTH CHECKS
// =============================================

export const useHealthCheckAsesoria = () => {
  return useQuery({
    queryKey: ['health-check-asesoria'],
    queryFn: () => asesoriaCompletaApi.healthCheckAsesoria(),
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: false,
  });
};

export const useHealthCheckMCP = () => {
  return useQuery({
    queryKey: ['health-check-mcp'],
    queryFn: () => asesoriaCompletaApi.healthCheckMCP(),
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// HOOKS ESPECIALIZADOS
// =============================================

// Asesoría completa con todas las opciones habilitadas
export const useAsesoriaCompletaFull = (clienteId: string) => {
  return useAsesoriaCompleta(clienteId, {
    diasHistorial: 90,
    includeHistorialControles: true,
    includeRecomendacionesHistoricas: true,
    includeProductosDetalle: true,
    includeEstadisticas: true,
  });
};

// Asesoría ligera para dashboard
export const useAsesoriaLigera = (clienteId: string) => {
  return useAsesoriaCompleta(clienteId, {
    diasHistorial: 30,
    includeHistorialControles: false,
    includeRecomendacionesHistoricas: false,
    includeProductosDetalle: false,
    includeEstadisticas: false,
  });
};

// Solo datos actuales (sin historial)
export const useAsesoriaActual = (clienteId: string) => {
  return useAsesoriaCompleta(clienteId, {
    diasHistorial: 7,
    includeHistorialControles: false,
    includeRecomendacionesHistoricas: false,
    includeProductosDetalle: true,
    includeEstadisticas: false,
  });
};