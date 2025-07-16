// src/features/seguimiento-fisico/hooks/useControlFisicoDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { seguimientoFisicoApi } from '../api/seguimiento-fisico.api';

export const useControlFisicoDashboard = (
  controlId: string, 
  statisticsDays: number = 90
) => {
  console.log('🔍 DEBUG - Hook dashboard params:', { controlId, statisticsDays });
  
  return useQuery({
    queryKey: ['seguimiento-fisico', 'dashboard', controlId, statisticsDays],
    queryFn: async () => {
      console.log('🔍 DEBUG - Ejecutando queryFn dashboard');
      
      // Llamar directamente a getControlWithStatistics que ya funciona
      const result = await seguimientoFisicoApi.getControlWithStatistics(controlId, {
        includeStatistics: true,
        includeTrends: true,
        includeComparisons: true,
        statisticsDays
      });
      
      console.log('🔍 DEBUG - Dashboard API response:', result);
      console.log('🔍 DEBUG - Dashboard chartData exists:', !!result.chartData);
      
      return result;
    },
    enabled: !!controlId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 30000, // 30 segundos
    refetchOnWindowFocus: false,
  });
};