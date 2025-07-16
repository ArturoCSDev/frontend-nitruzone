import { api } from '../../../lib/api/axios-instance';
import { ASESORIA_COMPLETA_ENDPOINTS, MCP_RECOMMENDATIONS_ENDPOINTS } from '../../../lib/api/endpoints/asesoria-completa.endpoints';
import {
  GetAsesoriaCompletaParams,
  GetEstadisticasParams,
  AsesoriaCompletaResponse,
  ResumenAsesoriaResponse,
  AlertasResponse,
  EstadisticasResponse,
  CreateRecommendationMCPRequest,
  CreateRecommendationMCPResponse,
  MCPHealthResponse
} from '../types/asesoria-completa-api.types';

export const asesoriaCompletaApi = {
  // =============================================
  // ASESORÍA COMPLETA
  // =============================================
  
  async getAsesoriaCompleta(clienteId: string, params?: GetAsesoriaCompletaParams): Promise<AsesoriaCompletaResponse> {
    const response = await api.get<AsesoriaCompletaResponse>(
      ASESORIA_COMPLETA_ENDPOINTS.GET_ASESORIA_COMPLETA(clienteId),
      { params }
    );
    return response.data.data!;
  },

  async getResumenAsesoria(clienteId: string): Promise<ResumenAsesoriaResponse> {
    const response = await api.get<ResumenAsesoriaResponse>(
      ASESORIA_COMPLETA_ENDPOINTS.GET_RESUMEN_ASESORIA(clienteId)
    );
    return response.data.data!;
  },

  async getAlertas(clienteId: string): Promise<AlertasResponse> {
    const response = await api.get<AlertasResponse>(
      ASESORIA_COMPLETA_ENDPOINTS.GET_ALERTAS(clienteId)
    );
    return response.data.data!;
  },

  async getEstadisticas(clienteId: string, params?: GetEstadisticasParams): Promise<EstadisticasResponse> {
    const response = await api.get<EstadisticasResponse>(
      ASESORIA_COMPLETA_ENDPOINTS.GET_ESTADISTICAS(clienteId),
      { params }
    );
    return response.data.data!;
  },

  async healthCheckAsesoria(): Promise<{ status: string; message: string }> {
    const response = await api.get<{ status: string; message: string }>(
      ASESORIA_COMPLETA_ENDPOINTS.HEALTH
    );
    return response.data.data!;
  },

  // =============================================
  // MCP RECOMMENDATIONS
  // =============================================

  async createRecommendationMCP(data: CreateRecommendationMCPRequest): Promise<CreateRecommendationMCPResponse> {
    const response = await api.post<CreateRecommendationMCPResponse>(
      MCP_RECOMMENDATIONS_ENDPOINTS.CREATE_RECOMMENDATION,
      data
    );
    return response.data.data!;
  },

  async healthCheckMCP(): Promise<MCPHealthResponse> {
    const response = await api.get<MCPHealthResponse>(
      MCP_RECOMMENDATIONS_ENDPOINTS.HEALTH
    );
    return response.data.data!;
  },
};