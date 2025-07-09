// src/features/nutrition-plans/hooks/useGetPlanByCliente.ts
import { useQuery } from '@tanstack/react-query';
import { nutritionPlansApi } from '../api/nutrition-plans.api';
import { GetPlansByClienteParams } from '../types/nutrition-plans-api.types';

// =============================================
// OBTENER PLAN ACTIVO DE UN CLIENTE
// =============================================

export const useGetActivePlanByCliente = (clienteId: string) => {
  return useQuery({
    queryKey: ['nutrition-plans', 'active-plan-by-cliente', clienteId],
    queryFn: async () => {
      if (!clienteId) return null;
      
      const params: GetPlansByClienteParams = {
        onlyActive: true,
        includeRecomendaciones: true,
        includeProductos: true
      };
      
      const plans = await nutritionPlansApi.getPlansByCliente(clienteId, params);
      return plans[0] || null; // Retornar el primer plan activo o null
    },
    enabled: !!clienteId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true,
  });
};

// =============================================
// OBTENER TODOS LOS PLANES DE UN CLIENTE
// =============================================

export const useGetPlansByCliente = (clienteId: string, params?: GetPlansByClienteParams) => {
  return useQuery({
    queryKey: ['nutrition-plans', 'plans-by-cliente', clienteId, params],
    queryFn: () => nutritionPlansApi.getPlansByCliente(clienteId, params),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};