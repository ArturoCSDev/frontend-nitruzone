import { useState } from "react";
import { imageApi } from "@/services/api/image.api";
import type { DeleteImageResponse } from "@/lib/api/types/image.types";
import { toast } from "sonner";

interface UseImageDeleteOptions {
  onSuccess?: (response: DeleteImageResponse) => void;
  onError?: (error: Error) => void;
  showToasts?: boolean;
}

/**
 * Hook para manejar la eliminación de imágenes
 */
export const useImageDelete = (options: UseImageDeleteOptions = {}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showToasts = true } = options;

  /**
   * Función para eliminar una imagen por su publicId
   */
  const deleteImage = async (
    publicId: string
  ): Promise<DeleteImageResponse | null> => {
    if (!publicId) {
      const error = new Error("El ID público de la imagen es requerido");
      setError(error);
      options.onError?.(error);
      if (showToasts) {
        toast.error("El ID público de la imagen es requerido", {
          description: "Proporciona un ID válido para continuar",
        });
      }
      return null;
    }

    try {
      setIsDeleting(true);
      setError(null);

      // Realizar la eliminación
      const response = await imageApi.delete({ publicId });

      // Llamar al callback de éxito si existe
      if (options.onSuccess) {
        options.onSuccess(response);
      }

      if (showToasts) {
        toast.success("Imagen eliminada", {
          description: "La imagen se ha eliminado correctamente",
        });
      }

      return response;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al eliminar la imagen");
      setError(error);

      // Llamar al callback de error si existe
      if (options.onError) {
        options.onError(error);
      }

      if (showToasts) {
        toast.error("Error", {
          description: error.message || "Error al eliminar la imagen",
        });
      }

      return null;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteImage,
    isDeleting,
    error,
  };
};