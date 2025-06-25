export interface UploadImageRequest {
  file: File;
  folder?: string;
}

export interface UploadImageResponse {
  url: string;
  publicId: string;
}

// Interfaces para la eliminación de imágenes
export interface DeleteImageRequest {
  publicId: string;
}

export interface DeleteImageResponse {
  success: boolean;
  message: string;
}
