// src/features/auth/stores/auth.store.ts
import { create } from 'zustand';
import { authSessionService, UserData, ProfileData } from '../../../services/session/auth-session.service';

interface AuthState {
  user: UserData | null;
  profile: ProfileData | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: UserData, profile?: ProfileData) => void;
  clearAuth: () => void;
  initAuth: () => void;
  
  // Getters
  isAdmin: () => boolean;
  isClient: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,

  // =============================================
  // ACTIONS
  // =============================================

  setAuth: (user: UserData, profile?: ProfileData) => {
    set({
      user,
      profile,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    authSessionService.clearSession();
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
    });
  },

  // Inicializar desde cookies al cargar la app
  initAuth: () => {
    const user = authSessionService.getUser();
    const profile = authSessionService.getProfile();
    const isAuthenticated = authSessionService.isAuthenticated();

    set({
      user,
      profile,
      isAuthenticated,
    });
  },

  // =============================================
  // GETTERS
  // =============================================

  isAdmin: () => {
    const { user } = get();
    return user?.rol === 'ADMINISTRADOR';
  },

  isClient: () => {
    const { user } = get();
    return user?.rol === 'CLIENTE';
  },
}));