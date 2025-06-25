import multipartAxiosInstance from "@/lib/api/multipart-axios-instance";
import {apiClient} from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  UploadImageRequest,
  UploadImageResponse,
  DeleteImageRequest,
  DeleteImageResponse,
} from "@/lib/api/types/image.types";
import type { ApiResponse } from "@/lib/api/api.types";

/**
 * API Client para manejo de imágenes
 */
export const imageApi = {
  /**
   * Sube una imagen al servidor
   * @param data Datos de la imagen a subir (archivo y carpeta opcional)
   * @returns Información de la imagen subida (URL y publicId)
   */
  upload: async (data: UploadImageRequest): Promise<UploadImageResponse> => {
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append("file", data.file);

    // Si se especificó una carpeta, añadirla al FormData
    if (data.folder) {
      formData.append("folder", data.folder);
    }

    // Usar el axios con soporte para multipart/form-data
    const { data: response } = await multipartAxiosInstance.post<
      ApiResponse<UploadImageResponse>
    >(API_ENDPOINTS.STORAGE.UPLOAD_IMAGE, formData);

    if (!response.data || !response.data) {
      throw new Error(response.message || "Error al subir la imagen");
    }

    return response.data;
  },

  /**
   * Elimina una imagen del servidor usando su ID público
   * @param data Datos para eliminar la imagen (publicId)
   * @returns Resultado de la operación
   */
  delete: async (data: DeleteImageRequest): Promise<DeleteImageResponse> => {
    const { data: response } = await apiClient.delete<
      ApiResponse<DeleteImageResponse>
    >(API_ENDPOINTS.STORAGE.DELETE_IMAGE, { data });

    if (!response.data) {
      throw new Error(response.message || "Error al eliminar la imagen");
    }

    return response.data as DeleteImageResponse;
  },
};
