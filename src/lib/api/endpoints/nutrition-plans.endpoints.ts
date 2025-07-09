// src/lib/api/endpoints/nutrition-plans.endpoints.ts
export const NUTRITION_PLANS_ENDPOINTS = {
    // =============================================
    // PLANES NUTRICIONALES
    // =============================================
    CREATE_PLAN: '/nutrition-plans/plan',
    GET_PLAN: (planId: string) => `/nutrition-plans/plan/${planId}`,
    GET_PLANS_BY_CLIENTE: (clienteId: string) => `/nutrition-plans/cliente/${clienteId}/planes`,
    GET_ACTIVE_PLAN: (clienteId: string) => `/nutrition-plans/cliente/${clienteId}/plan-activo`,
    
    // =============================================
    // CONTROLES FÍSICOS
    // =============================================
    CREATE_CONTROL: '/nutrition-plans/control-fisico',
    LIST_CONTROLS: '/nutrition-plans/control-fisico',
    GET_CONTROL: (controlId: string) => `/nutrition-plans/control-fisico/${controlId}`,
    UPDATE_CONTROL: (controlId: string) => `/nutrition-plans/control-fisico/${controlId}`,
    DELETE_CONTROL: (controlId: string) => `/nutrition-plans/control-fisico/${controlId}`,
    
    // =============================================
    // HEALTH CHECK
    // =============================================
    HEALTH: '/nutrition-plans/health',
  } as const;