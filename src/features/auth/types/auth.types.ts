export interface PrimitiveUser {
  id: string;
  email: string;
  isCustom: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isPhoneVerified: boolean;
  phoneVerificationCode: string | null;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  isActive: boolean;
  deactivatedAt: Date | null;
  lastPasswordChange: Date | null;
  requirePasswordChange: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  isBlocked: boolean;
  blockedAt: Date | null;
  blockReason: string | null;
}

export type User = Omit<PrimitiveUser, "password">;

export interface AuthResponse {
  token: string;
  user: User;
}

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;

// Tipos para Login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipos para Cambio de Contraseña
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Tipos para Solicitud de Reseteo de Contraseña
export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  success: boolean;
  message: string;
}

// Tipos para Reseteo de Contraseña
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
