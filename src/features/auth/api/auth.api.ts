// src/features/auth/api/auth.api.ts (fragmento actualizado)
import { api } from '../../../lib/api/axios-instance';
import { AUTH_ENDPOINTS } from '../../../lib/api/endpoints/auth.endpoints';
import { 
  LoginRequest,
  LoginResponse,
  RegisterClientRequest,
  RegisterClientResponse,
  RegisterAdminRequest,
  RegisterAdminResponse,
  ListClientsParams,
  ListClientsResponse,
  ListAdminsParams,
  ListAdminsResponse
} from '../types/auth-api.types';

export const authApi = {
  // =============================================
  // AUTENTICACIÓN
  // =============================================
  
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data);
    return response.data.data!;
  },

  // =============================================
  // REGISTRO
  // =============================================

  async registerClient(data: RegisterClientRequest): Promise<RegisterClientResponse> {
    const response = await api.post<RegisterClientResponse>(
      AUTH_ENDPOINTS.REGISTER_CLIENT, 
      data
    );
    return response.data.data!;
  },

  async registerAdmin(data: RegisterAdminRequest): Promise<RegisterAdminResponse> {
    const response = await api.post<RegisterAdminResponse>(
      AUTH_ENDPOINTS.REGISTER_ADMIN, 
      data
    );
    return response.data.data!;
  },

  // =============================================
  // LISTAR USUARIOS
  // =============================================

  async listClients(params?: ListClientsParams): Promise<ListClientsResponse> {
    const response = await api.get<ListClientsResponse>(
      AUTH_ENDPOINTS.LIST_CLIENTS, 
      { params }
    );
    return response.data.data!;
  },

  async listAdmins(params?: ListAdminsParams): Promise<ListAdminsResponse> {
    const response = await api.get<ListAdminsResponse>(
      AUTH_ENDPOINTS.LIST_ADMINS, 
      { params }
    );
    return response.data.data!;
  },

  // =============================================
  // OBTENER CLIENTE ESPECÍFICO
  // =============================================

  async getClient(clientId: string): Promise<ListClientsResponse> {
    const response = await api.get<ListClientsResponse>(
      AUTH_ENDPOINTS.LIST_CLIENTS, 
      { clientId }
    );
    return response.data.data!;
  },
};