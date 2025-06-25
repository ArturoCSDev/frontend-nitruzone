import axios, { AxiosInstance } from "axios";
import { authSessionService } from "@/services/session/auth-session.service";

// Configuración base para multipart/form-data (para subida de archivos)
const multipartAxiosConfig = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 30000, // Timeout mayor para subidas de archivos
};

// Crear instancia para multipart
const multipartAxiosInstance: AxiosInstance =
  axios.create(multipartAxiosConfig);

// Configurar interceptores específicos para multipart
multipartAxiosInstance.interceptors.request.use(
  (config) => {
    const token = authSessionService.getToken();

    // Depuración para ver si el token existe
    console.log("Token disponible para autenticación (multipart):", !!token);

    if (token) {
      // Asegurarse de que las cabeceras existan
      config.headers = config.headers || {};
      // Añadir token a la cabecera de autorización
      config.headers.Authorization = `Bearer ${token}`;

      // Log para depuración
      console.log(
        "Cabecera de autorización añadida (multipart):",
        `Bearer ${token.substring(0, 10)}...`
      );
    } else {
      console.warn(
        "No hay token disponible para autenticar la solicitud multipart"
      );
    }

    return config;
  },
  (error) => {
    console.error("Error en interceptor de solicitud multipart:", error);
    return Promise.reject(error);
  }
);

multipartAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Comprobar si el error es de autenticación (401)
    if (error.response?.status === 401) {
      console.warn("Error 401 (multipart): Token inválido o sesión expirada");
      authSessionService.clearSession();
      // Opcional: Redireccionar a página de login
      // window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default multipartAxiosInstance;
