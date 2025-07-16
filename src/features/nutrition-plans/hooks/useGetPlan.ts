import { useQuery } from '@tanstack/react-query';
import { nutritionPlansApi } from '../api/nutrition-plans.api';
import { 
  GetPlanNutricionalParams, 
  GetPlansByClienteParams 
} from '../types/nutrition-plans-api.types';

// Hook principal para obtener un plan específico
export const useGetPlan = (planId: string, params?: GetPlanNutricionalParams) => {
  return useQuery({
    queryKey: ['nutrition-plans', 'plan', planId, params],
    queryFn: () => nutritionPlansApi.getPlan(planId, params),
    enabled: !!planId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener planes por cliente
export const useGetPlansByCliente = (clienteId: string, params?: GetPlansByClienteParams) => {
  return useQuery({
    queryKey: ['nutrition-plans', 'cliente', clienteId, params],
    queryFn: () => nutritionPlansApi.getPlansByCliente(clienteId, params),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};