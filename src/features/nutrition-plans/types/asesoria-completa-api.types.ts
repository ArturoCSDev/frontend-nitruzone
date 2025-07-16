// src/features/nutrition-plans/types/asesoria-completa-api.types.ts

// =============================================
// ASESORÍA COMPLETA - REQUEST & PARAMS
// =============================================

export interface GetAsesoriaCompletaParams {
    diasHistorial?: number; // 7-365, default: 90
    includeHistorialControles?: boolean; // default: true
    includeRecomendacionesHistoricas?: boolean; // default: false
    includeProductosDetalle?: boolean; // default: true
    includeEstadisticas?: boolean; // default: true
  }
  
  export interface GetEstadisticasParams {
    diasHistorial?: number;
  }
  
  // =============================================
  // ASESORÍA COMPLETA - RESPONSES
  // =============================================
  
  export interface AsesoriaCompletaResponse {
    cliente: ClienteCompletaInfo;
    planActivo: PlanActivoCompleto | null;
    recomendaciones: RecomendacionesCompletas;
    controlesFisicos: ControlesFisicosCompletos;
    estadisticas?: EstadisticasCliente;
    resumen: ResumenAsesoria;
    metadata: {
      fechaConsulta: string;
      diasHistorial: number;
      ultimaActualizacion: string;
      processingTime?: number;
    };
  }
  
  export interface ResumenAsesoriaResponse {
    cliente: {
      id: string;
      nombreCompleto: string;
      hasCompleteProfile: boolean;
      active: boolean;
    };
    estado: 'activo' | 'inactivo' | 'pausado';
    planActivo: boolean;
    recomendacionesPendientes: number;
    proximoControl: string | null;
    alertas: AlertaAsesoria[];
    ultimoControl: string | null;
    fechaConsulta: string;
  }
  
  export interface AlertasResponse {
    alertas: AlertaAsesoria[];
    notasImportantes: string[];
    siguientesPasos: string[];
    totalAlertas: number;
    alertasAlta: number;
  }
  
  export interface EstadisticasResponse {
    estadisticas: EstadisticasCliente;
    tendencias: TendenciasCompletas;
    resumenRecomendaciones: ResumenRecomendaciones;
    resumenControles: ResumenControlesFisicos;
  }
  
  // =============================================
  // MCP RECOMMENDATIONS - REQUEST & RESPONSE
  // =============================================
  
  export interface CreateRecommendationMCPRequest {
    clienteId: string;
    planId?: string;
    contexto?: string; // "pre_entreno", "post_entreno", "desayuno", etc.
    objetivoEspecifico?: string; // "necesito energía", "quiero proteína", etc.
    prioridadMinima?: 'ALTA' | 'MEDIA' | 'BAJA';
    soloFavoritos?: boolean;
    momentoDelDia?: string; // "MANANA", "PRE_ENTRENAMIENTO", etc.
  }
  
  export interface MCPHealthResponse {
    mcpServer: {
      status: 'healthy' | 'unhealthy';
      timestamp: string;
      version: string;
    };
    database: {
      status: 'connected' | 'disconnected';
      timestamp: string;
    };
  }
  
  // =============================================
  // SHARED INTERFACES
  // =============================================
  
  export interface ClienteCompletaInfo {
    // Datos básicos
    id: string;
    usuarioId: string;
    email: string;
    dni: string;
    nombreCompleto: string;
    edad: number | null;
    peso: number | null;
    altura: number | null;
    genero: string | null;
    telefono: string | null;
    nivelActividad: string | null;
    
    // Información física
    grasaCorporal: number | null;
    masaMuscular: number | null;
    metabolismoBasal: number | null;
    imc: number | null;
    
    // Estado del perfil
    hasCompleteProfile: boolean;
    active: boolean;
    
    // Preferencias
    preferencias: {
      id: string;
      productosFavoritos: string[];
      preferenciasDieteticas: string[];
      alergenos: string[];
      objetivosFitness: string[];
      diasEntrenamiento: string[];
      horariosEntrenamiento: string[];
      horaDespertar: string | null;
      horaDormir: string | null;
      hasCompleteSchedule: boolean;
    } | null;
    
    // Fechas
    fechaCreacion: string;
    fechaActualizacion: string;
  }
  
  export interface PlanActivoCompleto {
    id: string;
    nombre: string;
    descripcion: string;
    objetivo: string;
    estado: string;
    fechaInicio: string;
    fechaFin: string | null;
    duracion: number | null;
    
    // Objetivos nutricionales
    caloriasObjetivo: number | null;
    proteinaObjetivo: number | null;
    carbohidratosObjetivo: number | null;
    grasasObjetivo: number | null;
    
    // Datos iniciales
    pesoInicial: number | null;
    grasaInicial: number | null;
    muscularInicial: number | null;
    
    // Progreso
    diasRestantes: number | null;
    progreso: number; // 0-100
    estaActivo: boolean;
    puedeSerModificado: boolean;
    
    // Fechas
    fechaCreacion: string;
    fechaActualizacion: string;
  }
  
  export interface RecomendacionesCompletas {
    activas: RecomendacionDetallada[];
    historicas?: RecomendacionDetallada[];
    resumen: ResumenRecomendaciones;
    proximasRecomendaciones: RecomendacionDetallada[];
  }
  
  export interface RecomendacionDetallada {
    id: string;
    productoId: string;
    tamanoId: string | null;
    planId: string | null;
    tituloRecomendacion: string;
    iconoProducto: string;
    timingRecomendado: string;
    horarioEspecifico: string | null;
    timingAdicional: string | null;
    prioridad: string;
    razonamiento: string;
    dosis: string;
    frecuencia: string;
    respuestaUsuario: string;
    timingModificado: string | null;
    fechaCreacion: string;
    fechaRespuesta: string | null;
    
    // Estado
    esPendiente: boolean;
    esAceptada: boolean;
    esRechazada: boolean;
    haExpirado: boolean;
    
    // Producto (si se incluye)
    producto?: {
      id: string;
      nombre: string;
      descripcion: string | null;
      precio: number;
      proteina: number | null;
      calorias: number | null;
      categoria: string | null;
      sabor: string | null;
      urlImagen: string | null;
    };
  }
  
  export interface ResumenRecomendaciones {
    totalActivas: number;
    totalHistoricas: number;
    pendientes: number;
    aceptadas: number;
    rechazadas: number;
    modificadas: number;
    porPrioridad: {
      alta: number;
      media: number;
      baja: number;
    };
  }
  
  export interface ControlesFisicosCompletos {
    ultimo: ControlFisicoDetallado | null;
    historial: ControlFisicoDetallado[];
    resumen: ResumenControlesFisicos;
    tendencias: TendenciasCompletas;
  }
  
  export interface ControlFisicoDetallado {
    id: string;
    planId: string | null;
    fechaControl: string;
    
    // Métricas físicas
    peso: number | null;
    grasaCorporal: number | null;
    masaMuscular: number | null;
    medidasAdicionales: Record<string, unknown> | null;
    
    // Evaluación subjetiva
    nivelEnergia: number | null;
    estadoAnimo: number | null;
    notas: string | null;
    
    // Control administrativo
    realizadoPor: string | null;
    proximaCita: string | null;
    
    // Metadata
    hasCompleteMetrics: boolean;
    hasSubjectiveEvaluation: boolean;
    isRecentControl: boolean;
    diasDesdeControl: number;
    
    // Fechas
    fechaCreacion: string;
    fechaActualizacion: string;
  }
  
  export interface ResumenControlesFisicos {
    totalControles: number;
    controlesConMetricas: number;
    controlesConEvaluacion: number;
    frecuenciaPromedio: number | null;
    ultimoControl: string | null;
    proximoControl: string | null;
  }
  
  export interface TendenciasCompletas {
    peso: TendenciaMetrica | null;
    grasaCorporal: TendenciaMetrica | null;
    masaMuscular: TendenciaMetrica | null;
    nivelEnergia: TendenciaMetrica | null;
    estadoAnimo: TendenciaMetrica | null;
  }
  
  export interface TendenciaMetrica {
    actual: number | null;
    anterior: number | null;
    cambio: number | null;
    porcentajeCambio: number | null;
    tendencia: 'subiendo' | 'bajando' | 'estable' | 'sin_datos';
    puntos: Array<{
      fecha: string;
      valor: number;
    }>;
  }
  
  export interface EstadisticasCliente {
    // Tiempo como cliente
    diasComoCliente: number;
    planesCompletados: number;
    planesTotales: number;
    
    // Actividad
    recomendacionesRecibidas: number;
    recomendacionesAceptadas: number;
    tasaAceptacion: number; // 0-100
    
    // Controles físicos
    controlesRealizados: number;
    frecuenciaControles: number | null; // días promedio
    
    // Progreso físico (si hay datos)
    cambiosPeso: {
      inicial: number | null;
      actual: number | null;
      cambio: number | null;
    };
    cambiosComposicion: {
      grasaInicial: number | null;
      grasaActual: number | null;
      muscularInicial: number | null;
      muscularActual: number | null;
    };
    
    // Engagement
    ultimaActividad: string | null;
    nivelActividad: 'alto' | 'medio' | 'bajo';
  }
  
  export interface ResumenAsesoria {
    estado: 'activo' | 'inactivo' | 'pausado';
    planActivo: boolean;
    recomendacionesPendientes: number;
    proximoControl: string | null;
    alertas: AlertaAsesoria[];
    siguientesPasos: string[];
    notasImportantes: string[];
  }
  
  export interface AlertaAsesoria {
    tipo: 'info' | 'warning' | 'error';
    mensaje: string;
    prioridad: 'alta' | 'media' | 'baja';
  }
  
  export interface RecomendacionGenerada {
    id: string;
    productoId: string;
    tamanoId: string | null;
    planId: string | null;
    tituloRecomendacion: string;
    iconoProducto: string;
    timingRecomendado: string;
    horarioEspecifico: string | null;
    timingAdicional: string | null;
    prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
    razonamiento: string;
    dosis: string;
    frecuencia: string;
    respuestaUsuario: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'MODIFICADA';
    timingModificado: string | null;
    fechaCreacion: string;
    fechaRespuesta: string | null;
    
    // ✅ Nuevos campos mejorados del backend
    beneficiosEspecificos?: string[];
    contraindicaciones?: string;
    valorNutricional?: {
      proteinaPorPorcion: number;
      caloriasPorPorcion: number;
      costoPorPorcion: string;
      densidadProteica: number | string;
    };
    
    // ✅ Información completa del producto
    producto?: {
      id: string;
      nombre: string;
      descripcion: string | null;
      precio: number;
      proteina: number | null;
      calorias: number | null;
      carbohidratos: number | null;
      grasas: number | null;
      fibra: number | null;
      azucar: number | null;
      volumen: number | null;
      categoria: string | null;
      sabor: string | null;
      tamano: string | null;
      ingredientes: string[];
      etiquetas: string[];
      momentosRecomendados: string[];
      urlImagen: string | null;
      
      // ✅ Información calculada del backend
      valorNutricional?: {
        macronutrientes: {
          proteina: { valor: number; porcentaje: number; categoria: string };
          carbohidratos: { valor: number; porcentaje: number; categoria: string };
          grasas: { valor: number; porcentaje: number; categoria: string };
        };
        densidadProteica: number;
        caloriasPorGramo: number;
        puntuacionNutricional: {
          puntuacion: number;
          categoria: string;
          descripcion: string;
        };
        calidadProteica: string;
        perfilCalorico: string;
      };
      
      recomendadoPara?: Array<{
        momento: string;
        razon: string;
        horario: string;
        prioridad: string;
      }>;
      
      beneficios?: Array<{
        categoria: string;
        beneficio: string;
        evidencia: string;
        impacto: string;
      }>;
      
      fechaCreacion: string;
      fechaActualizacion: string;
    };
  }
  
  export interface CreateRecommendationMCPResponse {
    recomendaciones: RecomendacionGenerada[];
    razonamientoGeneral: string;
    
    // ✅ Campos adicionales del backend mejorado
    recomendacionesAdicionales?: string[];
    alertas?: string[];
    
    metadatos: {
      processingTime: number;
      totalProcessingTime?: number;
      usedMCP: boolean;
      fallback?: boolean;
      sistemaInteligente?: boolean;
      usedClaude?: boolean;
      
      // ✅ Metadatos adicionales
      recomendacionesOriginales?: number;
      recomendacionesValidas?: number;
      recomendacionesDescartadas?: number;
      productosValidados?: number;
      productosAnalizados?: number;
      contextoAnalizado?: string;
      clienteAnalizado?: boolean;
      productosDisponibles?: number;
      
      // ✅ Información del producto fallback si se usó
      productoFallback?: {
        id: string;
        nombre: string;
        razonSeleccion: string;
      };
    };
  }