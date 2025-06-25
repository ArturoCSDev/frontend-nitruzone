import { useState } from "react";
import { imageApi } from "@/services/api/image.api";
import type {
  UploadImageRequest,
  UploadImageResponse,
} from "@/lib/api/types/image.types";
import { toast } from "sonner";

interface UseImageUploadOptions {
  folder?: string;
  onSuccess?: (response: UploadImageResponse) => void;
  onError?: (error: Error) => void;
  showToasts?: boolean;
}

/**
 * Hook para manejar la subida de imágenes
 */
export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { showToasts = true } = options;

  /**
   * Función para subir una imagen
   */
  const uploadImage = async (
    file: File
  ): Promise<UploadImageResponse | null> => {
    if (!file) {
      const error = new Error("No se ha seleccionado ningún archivo");
      setError(error);
      options.onError?.(error);
      
      if (showToasts) {
        toast.error("Error", {
          description: "No se ha seleccionado ningún archivo",
        });
      }
      return null;
    }

    let toastId: string | number | undefined;
    
    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      // Mostrar toast con progreso
      if (showToasts) {
        toastId = toast.loading("Subiendo imagen...", {
          description: "Preparando archivo",
        });
      }

      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          
          // Actualizar descripción del toast con el progreso
          if (showToasts && toastId !== undefined) {
            toast.loading("Subiendo imagen...", {
              id: toastId,
              description: `Progreso: ${Math.min(newProgress, 90)}%`,
            });
          }
          
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 200);

      // Preparar datos para la subida
      const uploadData: UploadImageRequest = {
        file,
        folder: options.folder,
      };

      // Realizar la subida
      const response = await imageApi.upload(uploadData);

      // Completar progreso y limpiar
      clearInterval(progressInterval);
      setProgress(100);

      // Llamar al callback de éxito si existe
      if (options.onSuccess) {
        options.onSuccess(response);
      }

      if (showToasts && toastId !== undefined) {
        toast.success("Imagen subida", {
          id: toastId,
          description: "La imagen se ha subido correctamente",
        });
      }

      return response;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al subir la imagen");
      setError(error);

      // Llamar al callback de error si existe
      if (options.onError) {
        options.onError(error);
      }

      if (showToasts && toastId !== undefined) {
        toast.error("Error", {
          id: toastId,
          description: error.message || "Error al subir la imagen",
        });
      }

      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    progress,
    error,
  };
};