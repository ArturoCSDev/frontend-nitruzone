// src/lib/api/endpoints/seguimiento-fisico.endpoints.ts
export const SEGUIMIENTO_FISICO_ENDPOINTS = {
    // =============================================
    // CONTROLES FÍSICOS
    // =============================================
    CREATE_CONTROL: '/nutrition-plans/control-fisico',
    LIST_CONTROLS: '/nutrition-plans/control-fisico',
    GET_CONTROL: (controlId: string) => `/nutrition-plans/control-fisico/${controlId}`,
    UPDATE_CONTROL: (controlId: string) => `/nutrition-plans/control-fisico/${controlId}`,
    DELETE_CONTROL: (controlId: string) => `/nutrition-plans/control-fisico/${controlId}`,
    
    // =============================================
    // ENDPOINTS ESPECIALIZADOS
    // =============================================
    CONTROLS_BY_CLIENTE: '/nutrition-plans/control-fisico?clienteId=',
    CONTROLS_BY_PLAN: '/nutrition-plans/control-fisico?planId=',
    RECENT_CONTROLS: '/nutrition-plans/control-fisico?onlyRecent=true',
    
    // =============================================
    // HEALTH CHECK
    // =============================================
    HEALTH: '/nutrition-plans/health',
  } as const;