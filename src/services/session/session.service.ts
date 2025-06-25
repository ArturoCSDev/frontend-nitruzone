import Cookies from "js-cookie";

// Opciones predeterminadas para las cookies
const COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// Tipo genérico para cualquier tipo de usuario
export type GenericUser = Record<string, unknown>;

export class SessionService<UserType = GenericUser> {
  // Claves configurables para tokens y datos de usuario
  private tokenKey: string;
  private userKey: string;
  private cookieOptions: Cookies.CookieAttributes;

  constructor(
    config: {
      tokenKey?: string;
      userKey?: string;
      cookieOptions?: Partial<Cookies.CookieAttributes>;
    } = {}
  ) {
    // Valores predeterminados que se pueden sobrescribir
    this.tokenKey = config.tokenKey || "app_token";
    this.userKey = config.userKey || "app_user";
    this.cookieOptions = {
      ...COOKIE_OPTIONS,
      ...config.cookieOptions,
    };
  }

  /**
   * Guarda el token de autenticación
   */
  setToken(token: string): void {
    try {
      console.log("Guardando token:", token.substring(0, 10) + "...");
      Cookies.set(this.tokenKey, token, this.cookieOptions);
    } catch (error) {
      console.error("Error al guardar el token:", error);
    }
  }

  /**
   * Guarda la información del usuario
   */
  setUser(user: UserType): void {
    try {
      const userStr = JSON.stringify(user);
      Cookies.set(this.userKey, userStr, this.cookieOptions);
      console.log("Usuario guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  }

  /**
   * Recupera el token de autenticación
   */
  getToken(): string | undefined {
    const token = Cookies.get(this.tokenKey);
    if (token) {
      console.log("Token obtenido:", token.substring(0, 10) + "...");
    } else {
      console.warn("No se encontró token en las cookies");
    }
    return token;
  }

  /**
   * Recupera la información del usuario
   */
  getUser(): UserType | null {
    try {
      const userStr = Cookies.get(this.userKey);
      if (!userStr) {
        console.warn("No se encontró información de usuario en las cookies");
        return null;
      }
      return JSON.parse(userStr) as UserType;
    } catch (error) {
      console.error("Error al recuperar el usuario:", error);
      return null;
    }
  }

  /**
   * Elimina la sesión (token y usuario)
   */
  clearSession(): void {
    console.log("Limpiando sesión...");
    Cookies.remove(this.tokenKey, { path: "/" });
    Cookies.remove(this.userKey, { path: "/" });
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    const isAuth = !!token && !!user;
    console.log("¿Usuario autenticado?", isAuth);
    return isAuth;
  }
}

// Exportamos una instancia predeterminada para uso rápido
export const sessionService = new SessionService();
