// src/lib/api/axios-instance.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from './api.types';
import { authSessionService } from '../../services/session/auth-session.service';
import { handleApiError, handleNetworkError } from './error-handlers';

// const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-nutrizone-ashy.vercel.app/api/v1';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 90000,
    withCredentials: true, // ✅ Importante para CORS con cookies/auth
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

      // ✅ Asegurar headers CORS
      if (!config.headers['X-Requested-With']) {
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
      }

      if (import.meta.env.DEV) {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        console.log('Headers:', config.headers);
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
          console.error('Error details:', error.message);
          console.error('Response data:', error.response?.data);
        }

        // ✅ Manejar errores CORS específicamente
        if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
          console.error('🚫 CORS Error detected');
          return Promise.reject(new Error('Error de conexión: Verificar configuración CORS'));
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

// Helpers tipados - CORREGIDOS para aceptar cualquier tipo de data
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) => 
    apiClient.get<ApiResponse<T>>(url, { params }),
  
  post: <T>(url: string, data?: unknown) => 
    apiClient.post<ApiResponse<T>>(url, data),
  
  put: <T>(url: string, data?: unknown) => 
    apiClient.put<ApiResponse<T>>(url, data),
  
  delete: <T>(url: string) => 
    apiClient.delete<ApiResponse<T>>(url),
};
