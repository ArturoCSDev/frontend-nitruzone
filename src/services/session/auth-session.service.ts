// src/services/session/auth-session.service.ts
import Cookies from 'js-cookie';

export interface UserData {
  id: string;
  email: string;
  dni: string;
  nombreCompleto: string;
  rol: 'ADMINISTRADOR' | 'CLIENTE';
  active: boolean;
}

export interface ProfileData {
  clienteId?: string;
  hasCompleteProfile?: boolean;
  adminId?: string;
  departamento?: string;
  nivelAcceso?: number;
}

class AuthSessionService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly PROFILE_KEY = 'auth_profile';

  private readonly cookieOptions = {
    expires: 7, // 7 días
    secure: import.meta.env.PROD,
    sameSite: 'strict' as const,
  };

  // =============================================
  // TOKEN METHODS
  // =============================================

  setToken(token: string): void {
    Cookies.set(this.TOKEN_KEY, token, this.cookieOptions);
  }

  getToken(): string | null {
    return Cookies.get(this.TOKEN_KEY) || null;
  }

  // =============================================
  // USER METHODS
  // =============================================

  setUser(user: UserData): void {
    Cookies.set(this.USER_KEY, JSON.stringify(user), this.cookieOptions);
  }

  getUser(): UserData | null {
    try {
      const userData = Cookies.get(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // =============================================
  // PROFILE METHODS
  // =============================================

  setProfile(profile: ProfileData): void {
    Cookies.set(this.PROFILE_KEY, JSON.stringify(profile), this.cookieOptions);
  }

  getProfile(): ProfileData | null {
    try {
      const profileData = Cookies.get(this.PROFILE_KEY);
      return profileData ? JSON.parse(profileData) : null;
    } catch {
      return null;
    }
  }

  // =============================================
  // SESSION METHODS
  // =============================================

  setSession(token: string, user: UserData, profile?: ProfileData): void {
    this.setToken(token);
    this.setUser(user);
    if (profile) {
      this.setProfile(profile);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  clearSession(): void {
    Cookies.remove(this.TOKEN_KEY);
    Cookies.remove(this.USER_KEY);
    Cookies.remove(this.PROFILE_KEY);
  }

  // =============================================
  // ROLE HELPERS
  // =============================================

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.rol === 'ADMINISTRADOR';
  }

  isClient(): boolean {
    const user = this.getUser();
    return user?.rol === 'CLIENTE';
  }

  hasCompleteProfile(): boolean {
    const profile = this.getProfile();
    return profile?.hasCompleteProfile ?? false;
  }
}

export const authSessionService = new AuthSessionService();