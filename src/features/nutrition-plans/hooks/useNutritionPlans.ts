// src/features/nutrition-plans/hooks/useNutritionPlans.ts
import { useQuery } from '@tanstack/react-query';
import { nutritionPlansApi } from '../api/nutrition-plans.api';
import { 
  GetPlanNutricionalParams, 
  GetPlansByClienteParams 
} from '../types/nutrition-plans-api.types';

// =============================================
// OBTENER PLAN ESPECÍFICO
// =============================================

export const usePlan = (planId: string, params?: GetPlanNutricionalParams) => {
  return useQuery({
    queryKey: ['nutrition-plans', 'plan', planId, params],
    queryFn: () => nutritionPlansApi.getPlan(planId, params),
    enabled: !!planId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// OBTENER PLANES POR CLIENTE
// =============================================

export const usePlansByCliente = (clienteId: string, params?: GetPlansByClienteParams) => {
  return useQuery({
    queryKey: ['nutrition-plans', 'plans', clienteId, params],
    queryFn: () => nutritionPlansApi.getPlansByCliente(clienteId, params),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// =============================================
// OBTENER PLAN ACTIVO
// =============================================

export const useActivePlan = (clienteId: string, params?: GetPlanNutricionalParams) => {
  return useQuery({
    queryKey: ['nutrition-plans', 'active-plan', clienteId, params],
    queryFn: () => nutritionPlansApi.getActivePlan(clienteId, params),
    enabled: !!clienteId,
    staleTime: 2 * 60 * 1000, // 2 minutos (más frecuente para plan activo)
    refetchOnWindowFocus: true,
    select: (data) => data[0] || null, // Retornar el primer plan (el activo) o null
  });
};

// =============================================
// OBTENER PLAN COMPLETO (con todo incluido)
// =============================================

export const usePlanCompleto = (planId: string) => {
  return usePlan(planId, {
    includeRecomendaciones: true,
    includeProductos: true,
    includeCliente: true,
  });
};

// =============================================
// OBTENER PLAN ACTIVO COMPLETO
// =============================================

export const useActivePlanCompleto = (clienteId: string) => {
  return useActivePlan(clienteId, {
    includeRecomendaciones: true,
    includeProductos: true,
    includeCliente: true,
  });
};

// =============================================
// OBTENER SOLO RECOMENDACIONES PENDIENTES
// =============================================

export const useRecomendacionesPendientes = (planId: string) => {
  return usePlan(planId, {
    includeRecomendaciones: true,
    includeProductos: true,
    onlyPendingRecomendaciones: true,
  });
};