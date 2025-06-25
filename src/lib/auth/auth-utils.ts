import { authSessionService } from "@/services/session/auth-session.service";

/**
 * Verifica el estado del token y devuelve información de diagnóstico
 */
export const checkAuthStatus = (): {
  isAuthenticated: boolean;
  tokenExists: boolean;
  userExists: boolean;
  tokenInfo?: {
    length: number;
    prefix: string;
    expiry?: Date;
  };
} => {
  const token = authSessionService.getToken();
  const user = authSessionService.getUser();

  const result: {
    isAuthenticated: boolean;
    tokenExists: boolean;
    userExists: boolean;
    tokenInfo?: {
      length: number;
      prefix: string;
      expiry?: Date;
    };
  } = {
    isAuthenticated: authSessionService.isAuthenticated(),
    tokenExists: !!token,
    userExists: !!user,
  };

  if (token) {
    // Añadir información del token (sin exponer datos sensibles)
    result.tokenInfo = {
      length: token.length,
      prefix: token.substring(0, 10) + "...",
    };

    // Intentar comprobar si es un JWT y extraer la fecha de expiración
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        // Parece ser un JWT, intentar decodificar la parte del payload
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          result.tokenInfo.expiry = expDate;
        }
      }
    } catch (e) {
      console.log("No se pudo determinar la fecha de expiración del token", e);
    }
  }

  return result;
};

/**
 * Función para refrescar el token si es necesario
 * Esto es solo un esqueleto - necesitarás implementar la lógica real
 */
export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  const token = authSessionService.getToken();

  if (!token) {
    console.warn("No hay token para refrescar");
    return false;
  }

  try {
    // Aquí implementarías la lógica para refrescar el token
    // Por ejemplo, llamar a un endpoint de refresh
    /*
    const response = await axios.post('/auth/refresh-token', { 
      refreshToken: getRefreshToken() 
    });
    
    if (response.data.accessToken) {
      authSessionService.setToken(response.data.accessToken);
      return true;
    }
    */

    console.log("Implementa la lógica de refresh token aquí");
    return false;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    return false;
  }
};
