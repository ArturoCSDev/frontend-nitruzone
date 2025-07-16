// src/features/nutrition-plans/hooks/useCreateRecommendationMCP.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { asesoriaCompletaApi } from '../api/asesoria-completa.api';
import { getErrorMessage } from '../../../lib/api/error-handlers';
import { CreateRecommendationMCPRequest } from '../types/asesoria-completa-api.types';

export const useCreateRecommendationMCP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecommendationMCPRequest) => 
      asesoriaCompletaApi.createRecommendationMCP(data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas con el cliente
      queryClient.invalidateQueries({ 
        queryKey: ['asesoria-completa', variables.clienteId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['resumen-asesoria', variables.clienteId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['alertas-asesoria', variables.clienteId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['nutrition-plans', 'plans', variables.clienteId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['nutrition-plans', 'active-plan', variables.clienteId] 
      });
      
      // Toast de éxito
      toast.success('¡Recomendaciones generadas exitosamente!', {
        description: `Se han creado ${data.recomendaciones.length} recomendaciones personalizadas usando IA.`,
        duration: 5000,
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al generar recomendaciones', {
        description: message,
        duration: 5000,
      });
    },
  });
};
