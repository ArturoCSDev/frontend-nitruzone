// src/features/seguimiento-fisico/hooks/useCreateControlFisico.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { seguimientoFisicoApi } from '../api/seguimiento-fisico.api';
import { getErrorMessage } from '../../../lib/api/error-handlers';
import { CreateControlFisicoRequest } from '../types/seguimiento-fisico-api.types';

export const useCreateControlFisico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateControlFisicoRequest) => seguimientoFisicoApi.createControl(data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ 
        queryKey: ['seguimiento-fisico', 'controls'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['seguimiento-fisico', 'controls', data.controlFisico.clienteId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['seguimiento-fisico', 'recent-controls', data.controlFisico.clienteId] 
      });
      if (data.controlFisico.planId) {
        queryClient.invalidateQueries({ 
          queryKey: ['seguimiento-fisico', 'controls-by-plan', data.controlFisico.planId] 
        });
      }
      
      // Toast de éxito
      toast.success('Control físico registrado exitosamente', {
        description: `Control del ${new Date(data.controlFisico.fechaControl).toLocaleDateString('es-ES')} guardado correctamente.`,
        duration: 5000,
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al registrar el control físico', {
        description: message,
        duration: 5000,
      });
    },
  });
};