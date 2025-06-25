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
  
  // Tipos para listados
  export interface UserClientItem {
    id: string;
    email: string;
    dni: string;
    nombreCompleto: string;
    active: boolean;
    fechaCreacion: string;
    cliente: {
      id: string;
      edad: number | null;
      peso: number | null;
      altura: number | null;
      telefono: string | null;
      genero: string | null;
      hasCompleteProfile: boolean;
      imc: number | null;
    };
  }
  
  export interface UserAdminItem {
    id: string;
    email: string;
    dni: string;
    nombreCompleto: string;
    active: boolean;
    fechaCreacion: string;
    admin: {
      id: string;
      departamento: string | null;
      nivelAcceso: number;
      ultimoAcceso: string | null;
      hasHighAccess: boolean;
    };
  }
  
  export interface ListClientsResponse {
    users: UserClientItem[];
    total: number;
    summary: {
      totalActive: number;
      totalInactive: number;
      totalCompleteProfiles: number;
      totalIncompleteProfiles: number;
    };
  }
  
  export interface ListAdminsResponse {
    users: UserAdminItem[];
    total: number;
    summary: {
      totalActive: number;
      totalInactive: number;
      byAccessLevel: {
        level1: number;
        level2: number;
        level3: number;
        level4: number;
        level5: number;
      };
      byDepartment: Record<string, number>;
    };
  }