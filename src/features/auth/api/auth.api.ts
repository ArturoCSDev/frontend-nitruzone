// src/features/auth/api/auth.api.ts
import { api } from '../../../lib/api/axios-instance';
import { AUTH_ENDPOINTS } from '../../../lib/api/endpoints/auth.endpoints';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterClientRequest, 
  RegisterClientResponse,
  RegisterAdminRequest,
  RegisterAdminResponse,
  ListClientsResponse,
  ListAdminsResponse
} from '../types/auth-api.types';

export const authApi = {
  // =============================================
  // AUTENTICACIÓN
  // =============================================
  
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data.data!;
  },

  // =============================================
  // REGISTRO
  // =============================================

  async registerClient(data: RegisterClientRequest): Promise<RegisterClientResponse> {
    const response = await api.post<RegisterClientResponse>(AUTH_ENDPOINTS.REGISTER_CLIENT, data);
    return response.data.data!;
  },

  async registerAdmin(data: RegisterAdminRequest): Promise<RegisterAdminResponse> {
    const response = await api.post<RegisterAdminResponse>(AUTH_ENDPOINTS.REGISTER_ADMIN, data);
    return response.data.data!;
  },

  // =============================================
  // LISTADOS (Para administradores)
  // =============================================

  async listClients(params?: { 
    search?: string; 
    onlyActive?: boolean;
    onlyCompleteProfiles?: boolean;
  }): Promise<ListClientsResponse> {
    const response = await api.get<ListClientsResponse>(AUTH_ENDPOINTS.LIST_CLIENTS, params);
    return response.data.data!;
  },

  async listAdmins(params?: { 
    search?: string; 
    onlyActive?: boolean;
    departamento?: string;
    minAccessLevel?: number;
  }): Promise<ListAdminsResponse> {
    const response = await api.get<ListAdminsResponse>(AUTH_ENDPOINTS.LIST_ADMINS, params);
    return response.data.data!;
  },
};
