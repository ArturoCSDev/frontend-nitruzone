// src/features/seguimiento-fisico/hooks/useControlFisicoMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { seguimientoFisicoApi } from '../api/seguimiento-fisico.api';
import { getErrorMessage } from '../../../lib/api/error-handlers';
import { UpdateControlFisicoRequest } from '../types/seguimiento-fisico-api.types';

// =============================================
// ACTUALIZAR CONTROL FÍSICO
// =============================================

export const useUpdateControlFisico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ controlId, data }: { controlId: string; data: UpdateControlFisicoRequest }) => 
      seguimientoFisicoApi.updateControl(controlId, data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ 
        queryKey: ['seguimiento-fisico', 'controls'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['seguimiento-fisico', 'control', data.controlFisico.id] 
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
      toast.success('Control físico actualizado exitosamente', {
        description: `Los cambios han sido guardados correctamente.`,
        duration: 4000,
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al actualizar el control físico', {
        description: message,
        duration: 5000,
      });
    },
  });
};

// =============================================
// ELIMINAR CONTROL FÍSICO
// =============================================

export const useDeleteControlFisico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (controlId: string) => seguimientoFisicoApi.deleteControl(controlId),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ 
        queryKey: ['seguimiento-fisico', 'controls'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['seguimiento-fisico', 'controls', data.deletedControl.clienteId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['seguimiento-fisico', 'recent-controls', data.deletedControl.clienteId] 
      });
      
      // Toast de éxito
      toast.success('Control físico eliminado exitosamente', {
        description: `El control del ${new Date(data.deletedControl.fechaControl).toLocaleDateString('es-ES')} ha sido eliminado.`,
        duration: 4000,
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al eliminar el control físico', {
        description: message,
        duration: 5000,
      });
    },
  });
};

// =============================================
// HOOK PERSONALIZADO PARA ACTUALIZACIÓN RÁPIDA
// =============================================

export const useQuickUpdateControl = () => {
  const updateControl = useUpdateControlFisico();

  return {
    updatePeso: (controlId: string, peso: number) => {
      updateControl.mutate({
        controlId,
        data: { peso }
      });
    },
    
    updateGrasaCorporal: (controlId: string, grasaCorporal: number) => {
      updateControl.mutate({
        controlId,
        data: { grasaCorporal }
      });
    },
    
    updateMasaMuscular: (controlId: string, masaMuscular: number) => {
      updateControl.mutate({
        controlId,
        data: { masaMuscular }
      });
    },
    
    updateNivelEnergia: (controlId: string, nivelEnergia: number) => {
      updateControl.mutate({
        controlId,
        data: { nivelEnergia }
      });
    },
    
    updateEstadoAnimo: (controlId: string, estadoAnimo: number) => {
      updateControl.mutate({
        controlId,
        data: { estadoAnimo }
      });
    },
    
    updateNotas: (controlId: string, notas: string) => {
      updateControl.mutate({
        controlId,
        data: { notas }
      });
    },
    
    updateProximaCita: (controlId: string, proximaCita: string) => {
      updateControl.mutate({
        controlId,
        data: { proximaCita }
      });
    },
    
    // Estado de loading y error del mutation principal
    isLoading: updateControl.isPending,
    error: updateControl.error,
    isError: updateControl.isError,
    isSuccess: updateControl.isSuccess,
  };
};

// =============================================
// HOOK PARA ELIMINAR MÚLTIPLES CONTROLES
// =============================================

export const useDeleteMultipleControls = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (controlIds: string[]) => {
      const results = await Promise.allSettled(
        controlIds.map(id => seguimientoFisicoApi.deleteControl(id))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return {
        successful,
        failed,
        total: controlIds.length,
        results
      };
    },
    onSuccess: (data) => {
      // Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({ 
        queryKey: ['seguimiento-fisico'] 
      });
      
      // Toast de éxito
      if (data.failed === 0) {
        toast.success(`${data.successful} controles eliminados exitosamente`, {
          description: `Todos los controles seleccionados han sido eliminados.`,
          duration: 4000,
        });
      } else {
        toast.warning(`${data.successful} controles eliminados, ${data.failed} fallaron`, {
          description: `Algunos controles no pudieron ser eliminados.`,
          duration: 5000,
        });
      }
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error('Error al eliminar los controles físicos', {
        description: message,
        duration: 5000,
      });
    },
  });
};