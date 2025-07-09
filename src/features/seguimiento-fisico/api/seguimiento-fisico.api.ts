// src/features/seguimiento-fisico/api/seguimiento-fisico.api.ts
import { api } from '../../../lib/api/axios-instance';
import { SEGUIMIENTO_FISICO_ENDPOINTS } from '../../../lib/api/endpoints/seguimiento-fisico.endpoints';
import { 
  CreateControlFisicoRequest,
  CreateControlFisicoResponse,
  ListControlFisicoParams,
  ListControlFisicoResponse,
  GetControlFisicoResponse,
  UpdateControlFisicoRequest,
  UpdateControlFisicoResponse,
  DeleteControlFisicoResponse
} from '../types/seguimiento-fisico-api.types';

export const seguimientoFisicoApi = {
  // =============================================
  // CONTROLES FÍSICOS - CRUD
  // =============================================
  
  async createControl(data: CreateControlFisicoRequest): Promise<CreateControlFisicoResponse> {
    const response = await api.post<CreateControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.CREATE_CONTROL, 
      data
    );
    return response.data.data!;
  },

  async listControls(params?: ListControlFisicoParams): Promise<ListControlFisicoResponse> {
    const response = await api.get<ListControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.LIST_CONTROLS, 
      params
    );
    return response.data.data!;
  },

  async getControl(controlId: string): Promise<GetControlFisicoResponse> {
    const response = await api.get<GetControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.GET_CONTROL(controlId)
    );
    return response.data.data!;
  },

  async updateControl(controlId: string, data: UpdateControlFisicoRequest): Promise<UpdateControlFisicoResponse> {
    const response = await api.put<UpdateControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.UPDATE_CONTROL(controlId), 
      data
    );
    return response.data.data!;
  },

  async deleteControl(controlId: string): Promise<DeleteControlFisicoResponse> {
    const response = await api.delete<DeleteControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.DELETE_CONTROL(controlId)
    );
    return response.data.data!;
  },

  // =============================================
  // CONSULTAS ESPECIALIZADAS
  // =============================================

  async getControlsByCliente(clienteId: string, params?: Omit<ListControlFisicoParams, 'clienteId'>): Promise<ListControlFisicoResponse> {
    const response = await api.get<ListControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.LIST_CONTROLS, 
      { ...params, clienteId }
    );
    return response.data.data!;
  },

  async getControlsByPlan(planId: string, params?: Omit<ListControlFisicoParams, 'planId'>): Promise<ListControlFisicoResponse> {
    const response = await api.get<ListControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.LIST_CONTROLS, 
      { ...params, planId }
    );
    return response.data.data!;
  },

  async getRecentControls(clienteId: string, params?: ListControlFisicoParams): Promise<ListControlFisicoResponse> {
    const response = await api.get<ListControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.LIST_CONTROLS, 
      { ...params, clienteId, onlyRecent: true }
    );
    return response.data.data!;
  },

  async getControlsInRange(
    clienteId: string, 
    fechaInicio: string, 
    fechaFin: string, 
    params?: Omit<ListControlFisicoParams, 'clienteId' | 'fechaInicio' | 'fechaFin'>
  ): Promise<ListControlFisicoResponse> {
    const response = await api.get<ListControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.LIST_CONTROLS, 
      { ...params, clienteId, fechaInicio, fechaFin }
    );
    return response.data.data!;
  },

  async getControlsWithMetrics(clienteId: string): Promise<ListControlFisicoResponse> {
    const response = await api.get<ListControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.LIST_CONTROLS, 
      { clienteId, onlyWithMetrics: true }
    );
    return response.data.data!;
  },

  async getControlsWithSubjectiveEvaluation(clienteId: string): Promise<ListControlFisicoResponse> {
    const response = await api.get<ListControlFisicoResponse>(
      SEGUIMIENTO_FISICO_ENDPOINTS.LIST_CONTROLS, 
      { clienteId, onlyWithSubjectiveEvaluation: true }
    );
    return response.data.data!;
  },

  // =============================================
  // HEALTH CHECK
  // =============================================

  async healthCheck(): Promise<{ status: string; message: string; endpoints: Record<string, string> }> {
    const response = await api.get<{ status: string; message: string; endpoints: Record<string, string> }>(
      SEGUIMIENTO_FISICO_ENDPOINTS.HEALTH
    );
    return response.data.data!;
  },
};