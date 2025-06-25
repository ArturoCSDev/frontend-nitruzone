// src/lib/types/session.types.ts

/**
 * Interfaz base para cualquier usuario autenticado
 * Puedes extender esta interfaz en tus features específicas
 */
export interface BaseUser {
  id: string | number;
  // Campos comunes que cualquier usuario tendría
  email?: string;
  name?: string;
  // Permite campos adicionales de cualquier tipo primitivo o complejo
  [key: string]: unknown;
}

/**
 * Estructura base para respuestas de autenticación
 */
export interface AuthResponse<U = BaseUser> {
  token: string;
  user: U;
}

/**
 * Estructura base para solicitudes de inicio de sesión
 */
export interface LoginRequest {
  email: string;
  password: string;
  // Campos adicionales opcionales
  [key: string]: unknown | string;
}

/**
 * Estructura base para solicitudes de registro
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  // Campos adicionales opcionales
  [key: string]: unknown | string;
}
