// src/features/nutrition-plans/api/nutrition-plans.api.ts
import { api } from '../../../lib/api/axios-instance';
import { NUTRITION_PLANS_ENDPOINTS } from '../../../lib/api/endpoints/nutrition-plans.endpoints';
import { 
  CreatePlanNutricionalRequest,
  CreatePlanNutricionalResponse,
  GetPlanNutricionalParams,
  GetPlansByClienteParams,
  GetPlanNutricionalResponse,
  CreateControlFisicoRequest,
  CreateControlFisicoResponse,
  ListControlFisicoParams,
  ListControlFisicoResponse
} from '../types/nutrition-plans-api.types';

export const nutritionPlansApi = {
  // =============================================
  // PLANES NUTRICIONALES
  // =============================================
  
  async createPlan(data: CreatePlanNutricionalRequest): Promise<CreatePlanNutricionalResponse> {
    const response = await api.post<CreatePlanNutricionalResponse>(
      NUTRITION_PLANS_ENDPOINTS.CREATE_PLAN, 
      data
    );
    return response.data.data!;
  },

  async getPlan(planId: string, params?: GetPlanNutricionalParams): Promise<GetPlanNutricionalResponse> {
    const response = await api.get<GetPlanNutricionalResponse>(
      NUTRITION_PLANS_ENDPOINTS.GET_PLAN(planId), 
      { params }
    );
    return response.data.data!;
  },

  async getPlansByCliente(clienteId: string, params?: GetPlansByClienteParams): Promise<GetPlanNutricionalResponse[]> {
    const response = await api.get<GetPlanNutricionalResponse[]>(
      NUTRITION_PLANS_ENDPOINTS.GET_PLANS_BY_CLIENTE(clienteId), 
      { params }
    );
    return response.data.data!;
  },

  async getActivePlan(clienteId: string, params?: GetPlanNutricionalParams): Promise<GetPlanNutricionalResponse[]> {
    const response = await api.get<GetPlanNutricionalResponse[]>(
      NUTRITION_PLANS_ENDPOINTS.GET_ACTIVE_PLAN(clienteId), 
      { params }
    );
    return response.data.data!;
  },

  // =============================================
  // CONTROLES FÍSICOS
  // =============================================

  async createControl(data: CreateControlFisicoRequest): Promise<CreateControlFisicoResponse> {
    const response = await api.post<CreateControlFisicoResponse>(
      NUTRITION_PLANS_ENDPOINTS.CREATE_CONTROL, 
      data
    );
    return response.data.data!;
  },

  async listControls(params?: ListControlFisicoParams): Promise<ListControlFisicoResponse> {
    const response = await api.get<ListControlFisicoResponse>(
      NUTRITION_PLANS_ENDPOINTS.LIST_CONTROLS, 
      { params }
    );
    return response.data.data!;
  },

  async getControl(controlId: string): Promise<CreateControlFisicoResponse> {
    const response = await api.get<CreateControlFisicoResponse>(
      NUTRITION_PLANS_ENDPOINTS.GET_CONTROL(controlId)
    );
    return response.data.data!;
  },

  async updateControl(controlId: string, data: Partial<CreateControlFisicoRequest>): Promise<CreateControlFisicoResponse> {
    const response = await api.put<CreateControlFisicoResponse>(
      NUTRITION_PLANS_ENDPOINTS.UPDATE_CONTROL(controlId), 
      data
    );
    return response.data.data!;
  },

  async deleteControl(controlId: string): Promise<{ deletedControl: CreateControlFisicoResponse['controlFisico'] }> {
    const response = await api.delete<{ deletedControl: CreateControlFisicoResponse['controlFisico'] }>(
      NUTRITION_PLANS_ENDPOINTS.DELETE_CONTROL(controlId)
    );
    return response.data.data!;
  },

  // =============================================
  // HEALTH CHECK
  // =============================================

  async healthCheck(): Promise<{ status: string; message: string; endpoints: Record<string, string> }> {
    const response = await api.get<{ status: string; message: string; endpoints: Record<string, string> }>(
      NUTRITION_PLANS_ENDPOINTS.HEALTH
    );
    return response.data.data!;
  },
};