// src/lib/api/endpoints/asesoria-completa.endpoints.ts
export const ASESORIA_COMPLETA_ENDPOINTS = {
    // Asesoría completa
    GET_ASESORIA_COMPLETA: (clienteId: string) => `/nutrition-plans/asesoria/${clienteId}`,
    
    // Resumen de asesoría (versión ligera)
    GET_RESUMEN_ASESORIA: (clienteId: string) => `/nutrition-plans/asesoria/${clienteId}/resumen`,
    
    // Solo alertas
    GET_ALERTAS: (clienteId: string) => `/nutrition-plans/asesoria/${clienteId}/alertas`,
    
    // Solo estadísticas
    GET_ESTADISTICAS: (clienteId: string) => `/nutrition-plans/asesoria/${clienteId}/estadisticas`,
    
    // Health check
    HEALTH: '/nutrition-plans/asesoria/health',
  } as const;
  
  // src/lib/api/endpoints/mcp-recommendations.endpoints.ts
  export const MCP_RECOMMENDATIONS_ENDPOINTS = {
    // Crear recomendación con MCP
    CREATE_RECOMMENDATION: '/mcp/recommendations',
    
    // Health check MCP
    HEALTH: '/mcp/health',
  } as const;