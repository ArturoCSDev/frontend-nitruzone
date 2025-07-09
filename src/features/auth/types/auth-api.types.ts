// src/features/auth/types/auth.types.ts
export interface LoginRequest {
    dni: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: {
      id: string;
      email: string;
      dni: string;
      nombreCompleto: string;
      rol: 'ADMINISTRADOR' | 'CLIENTE';
      active: boolean;
    };
    profile?: {
      clienteId?: string;
      hasCompleteProfile?: boolean;
      adminId?: string;
      departamento?: string;
      nivelAcceso?: number;
    };
    token: string;
  }
  
  export interface RegisterClientRequest {
    email: string;
    dni: string;
    password: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    edad?: number;
    peso?: number;
    altura?: number;
    telefono?: string;
    genero?: string;
  }
  
  export interface RegisterClientResponse {
    user: {
      id: string;
      email: string;
      nombreCompleto: string;
      rol: string;
    };
    cliente: {
      id: string;
      hasCompleteProfile: boolean;
    };
    token: string;
    message: string;
  }
  
  // ← Agregando RegisterAdmin que faltaba
  export interface RegisterAdminRequest {
    email: string;
    dni: string;
    password: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    departamento?: string;
    nivelAcceso?: number;
  }
  
  export interface RegisterAdminResponse {
    user: {
      id: string;
      email: string;
      nombreCompleto: string;
      rol: string;
    };
    admin: {
      id: string;
      departamento: string | null;
      nivelAcceso: number;
    };
    message: string;
  }
  
// =============================================
// LISTAR CLIENTES
// =============================================

export interface ListClientsParams {
  search?: string;
  onlyActive?: boolean;
  onlyCompleteProfiles?: boolean;
  clientId?: string; // Nuevo parámetro para obtener cliente específico por ID de cliente
}

export interface ListClientsResponse {
  users: UserClientItem[];
  total: number;
  summary: ClientsSummary;
}

export interface UserClientItem {
  id: string; // ID del usuario
  email: string;
  dni: string;
  nombreCompleto: string;
  active: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  cliente: ClienteInfo;
}

export interface ClienteInfo {
  id: string; // ID de la tabla cliente (este es el que necesitamos para seguimiento)
  edad: number | null;
  peso: number | null;
  altura: number | null;
  genero: string | null;
  telefono: string | null;
  imc: number | null;
  hasCompleteProfile: boolean;
}

export interface ClientsSummary {
  totalActive: number;
  totalInactive: number;
  totalCompleteProfiles: number;
  totalIncompleteProfiles: number;
  averageAge: number | null;
  genderDistribution: {
    masculino: number;
    femenino: number;
    otro: number;
    sinEspecificar: number;
  };
}

// =============================================
// LISTAR ADMINISTRADORES
// =============================================

export interface ListAdminsParams {
  search?: string;
  onlyActive?: boolean;
  departamento?: string;
  minAccessLevel?: number;
}

export interface ListAdminsResponse {
  users: UserAdminItem[];
  total: number;
  summary: AdminsSummary;
}

export interface UserAdminItem {
  id: string;
  email: string;
  dni: string;
  nombreCompleto: string;
  active: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  admin: AdminInfo;
}

export interface AdminInfo {
  departamento: string | null;
  nivelAcceso: number;
  ultimoAcceso: string | null;
}

export interface AdminsSummary {
  totalActive: number;
  totalInactive: number;
  byDepartment: {
    nutricion: number;
    administracion: number;
    sistemas: number;
    recursosHumanos: number;
    finanzas: number;
    sinAsignar: number;
  };
  byAccessLevel: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  };
}