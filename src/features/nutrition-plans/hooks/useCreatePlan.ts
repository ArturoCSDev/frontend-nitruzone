// src/features/nutrition-plans/hooks/useCreatePlan.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { nutritionPlansApi } from '../api/nutrition-plans.api';
import { getErrorMessage } from '../../../lib/api/error-handlers';
import { CreatePlanNutricionalRequest } from '../types/nutrition-plans-api.types';

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanNutricionalRequest) => nutritionPlansApi.createPlan(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ 
        queryKey: ['nutrition-plans', 'plans', data.clienteId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['nutrition-plans', 'active-plan', data.clienteId] 
      });
      
      // Toast de éxito
      toast.success('¡Plan nutricional creado exitosamente!', {
        description: `Se ha creado el plan "${data.nombre}" con ${data.recomendaciones.length} recomendaciones personalizadas.`,
        duration: 5000,
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al crear el plan nutricional', {
        description: message,
        duration: 5000,
      });
    },
  });
};