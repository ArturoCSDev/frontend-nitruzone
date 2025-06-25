// src/lib/api/axios-instance.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from './api.types';
import { authSessionService } from '../../services/session/auth-session.service';
import { handleApiError, handleNetworkError } from './error-handlers';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-nutrizone.vercel.app/api/v1';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // REQUEST INTERCEPTOR - Agregar token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authSessionService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (import.meta.env.DEV) {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error: unknown) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR - Manejar errores
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      if (import.meta.env.DEV) {
        console.log(`✅ ${response.status} ${response.config.url}`);
      }
      return response;
    },
    async (error: unknown) => {
      // Type guard para axios error
      if (axios.isAxiosError(error)) {
        if (import.meta.env.DEV) {
          console.error(`❌ ${error.response?.status} ${error.config?.url}`);
        }

        // Si es 401, limpiar sesión y redirigir
        if (error.response?.status === 401) {
          authSessionService.clearSession();
          window.location.href = '/login';
        }

        // Manejar errores de respuesta
        if (error.response?.data) {
          return Promise.reject(handleApiError(error.response.data));
        }
        
        // Manejar errores de red
        if (error.request) {
          return Promise.reject(handleNetworkError({ code: error.code }));
        }
      }

      // Error genérico
      return Promise.reject(new Error('Error inesperado'));
    }
  );

  return instance;
};

export const apiClient = createAxiosInstance();

// Helpers tipados
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) => 
    apiClient.get<ApiResponse<T>>(url, { params }),
  
  post: <T>(url: string, data?: Record<string, unknown>) => 
    apiClient.post<ApiResponse<T>>(url, data),
  
  put: <T>(url: string, data?: Record<string, unknown>) => 
    apiClient.put<ApiResponse<T>>(url, data),
  
  delete: <T>(url: string) => 
    apiClient.delete<ApiResponse<T>>(url),
};
