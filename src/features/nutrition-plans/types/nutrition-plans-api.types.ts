// src/features/nutrition-plans/types/nutrition-plans-api.types.ts

// =============================================
// CREAR PLAN NUTRICIONAL
// =============================================

export interface CreatePlanNutricionalRequest {
    clienteId: string;
    objetivo: 'PERDIDA_PESO' | 'GANANCIA_MUSCULAR' | 'MANTENIMIENTO' | 'DEFINICION' | 'VOLUMEN' | 'RECUPERACION';
    duracionDias?: number;
    fechaInicio?: string;
    productosFavoritos?: string[];
    preferenciasDieteticas?: string[];
    alergenos?: string[];
    diasEntrenamiento?: string[];
    horariosEntrenamiento?: string[];
    horaDespertar?: string;
    horaDormir?: string;
    pesoInicial?: number;
    grasaInicial?: number;
    muscularInicial?: number;
  }
  
  export interface CreatePlanNutricionalResponse {
    id: string;
    clienteId: string;
    nombre: string;
    descripcion: string;
    objetivo: string;
    duracionDias: number;
    fechaInicio: string;
    fechaFin: string | null;
    caloriasObjetivo: number;
    proteinaObjetivo: number;
    carbohidratosObjetivo: number;
    grasasObjetivo: number;
    instruccionesGenerales: string;
    recomendaciones: RecomendacionResponse[];
    fechaCreacion: string;
  }
  
  export interface RecomendacionResponse {
    id: string;
    productoId: string;
    tamanoId: string | null;
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
    fechaCreacion: string;
  }
  
  // =============================================
  // OBTENER PLAN NUTRICIONAL
  // =============================================
  
  export interface GetPlanNutricionalParams {
    includeRecomendaciones?: boolean;
    includeProductos?: boolean;
    includeCliente?: boolean;
    onlyPendingRecomendaciones?: boolean;
  }
  
  export interface GetPlansByClienteParams {
    onlyActive?: boolean;
    includeRecomendaciones?: boolean;
    includeProductos?: boolean;
  }
  
  export interface GetPlanNutricionalResponse {
    id: string;
    clienteId: string;
    nombre: string;
    descripcion: string;
    objetivo: string;
    estado: 'ACTIVO' | 'COMPLETADO' | 'PAUSADO' | 'CANCELADO';
    fechaInicio: string;
    fechaFin: string | null;
    duracion: number | null;
    caloriasObjetivo: number | null;
    proteinaObjetivo: number | null;
    carbohidratosObjetivo: number | null;
    grasasObjetivo: number | null;
    pesoInicial: number | null;
    grasaInicial: number | null;
    muscularInicial: number | null;
    fechaCreacion: string;
    fechaActualizacion: string;
    
    // Información calculada
    diasRestantes: number | null;
    progreso: number;
    estaActivo: boolean;
    puedeSerModificado: boolean;
    
    // Relaciones opcionales
    cliente?: ClienteInfoResponse;
    recomendaciones?: RecomendacionDetalladaResponse[];
    resumenRecomendaciones?: ResumenRecomendacionesResponse;
  }
  
  export interface ClienteInfoResponse {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombreCompleto: string;
    edad: number | null;
    peso: number | null;
    altura: number | null;
    nivelActividad: string | null;
    genero: string | null;
  }
  
  export interface RecomendacionDetalladaResponse {
    id: string;
    productoId: string;
    tamanoId: string | null;
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
    
    // Información adicional
    esPendiente: boolean;
    esAceptada: boolean;
    esRechazada: boolean;
    haExpirado: boolean;
    
    // Información del producto
    producto?: ProductoInfoResponse;
  }
  
  export interface ProductoInfoResponse {
    id: string;
    nombre: string;
    descripcion: string | null;
    precio: number;
    proteina: number | null;
    calorias: number | null;
    carbohidratos: number | null;
    grasas: number | null;
    categoria?: string;
    sabor?: string;
    tamano?: string;
    urlImagen: string | null;
  }
  
  export interface ResumenRecomendacionesResponse {
    total: number;
    pendientes: number;
    aceptadas: number;
    rechazadas: number;
    modificadas: number;
    porPrioridad: {
      alta: number;
      media: number;
      baja: number;
    };
    proximasRecomendaciones: RecomendacionDetalladaResponse[];
  }
  
  // =============================================
  // CONTROLES FÍSICOS
  // =============================================
  
  export interface CreateControlFisicoRequest {
    clienteId: string;
    planId?: string;
    fechaControl: string;
    peso?: number;
    grasaCorporal?: number;
    masaMuscular?: number;
    medidasAdicionales?: Record<string, unknown>;
    nivelEnergia?: number;
    estadoAnimo?: number;
    notas?: string;
    realizadoPor?: string;
    proximaCita?: string;
  }
  
  export interface CreateControlFisicoResponse {
    controlFisico: {
      id: string;
      clienteId: string;
      planId: string | null;
      fechaControl: string;
      peso: number | null;
      grasaCorporal: number | null;
      masaMuscular: number | null;
      medidasAdicionales: Record<string, unknown> | null;
      nivelEnergia: number | null;
      estadoAnimo: number | null;
      notas: string | null;
      realizadoPor: string | null;
      proximaCita: string | null;
      fechaCreacion: string;
      fechaActualizacion: string;
    };
  }
  
  export interface ListControlFisicoParams {
    clienteId?: string;
    planId?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    page?: number;
    limit?: number;
    sortBy?: 'fechaControl' | 'peso' | 'grasaCorporal' | 'masaMuscular';
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface ListControlFisicoResponse {
    controles: CreateControlFisicoResponse['controlFisico'][];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    summary: {
      totalWithMetrics: number;
      totalWithoutMetrics: number;
      averageWeight: number | null;
      averageBodyFat: number | null;
      averageMuscle: number | null;
      lastControl: CreateControlFisicoResponse['controlFisico'] | null;
    };
  }
  
  // =============================================
  // TIPOS AUXILIARES
  // =============================================
  
  export type ObjetivoNutricional = 'PERDIDA_PESO' | 'GANANCIA_MUSCULAR' | 'MANTENIMIENTO' | 'DEFINICION' | 'VOLUMEN' | 'RECUPERACION';
  export type EstadoPlan = 'ACTIVO' | 'COMPLETADO' | 'PAUSADO' | 'CANCELADO';
  export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';
  export type RespuestaUsuario = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'MODIFICADA';