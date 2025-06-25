// src/lib/api/error-handlers.ts
import { ApiError } from './api.types';

// Error personalizado simple
export class ApiException extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string = 'API_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class NetworkException extends Error {
  public readonly code: string = 'NETWORK_ERROR';

  constructor(message: string = 'Error de conexión') {
    super(message);
    this.name = 'NetworkException';
  }
}

// Manejadores principales
export const handleApiError = (errorData: ApiError): ApiException => {
  const { message, code = 'API_ERROR' } = errorData;
  
  let statusCode = 500;
  switch (code) {
    case 'UNAUTHORIZED':
    case 'TOKEN_EXPIRED':
      statusCode = 401;
      break;
    case 'VALIDATION_ERROR':
      statusCode = 400;
      break;
    case 'NOT_FOUND':
      statusCode = 404;
      break;
    case 'DUPLICATE_RECORD':
      statusCode = 409;
      break;
  }

  return new ApiException(message, code, statusCode);
};

export const handleNetworkError = (error: { code?: string }): NetworkException => {
  if (error.code === 'ECONNABORTED') {
    return new NetworkException('Tiempo de espera agotado');
  }
  
  if (error.code === 'ERR_NETWORK') {
    return new NetworkException('Error de red - verifica tu conexión');
  }
  
  return new NetworkException('Error de conexión');
};

// Helper simple para obtener mensaje de error
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiException || error instanceof NetworkException) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ocurrió un error inesperado';
};