// src/features/products/types/product-api.types.ts

// =============================================
// BASE ENTITY TYPES
// =============================================

export interface Tamano {
  id: string;
  nombre: string;
  volumen: number;
  proteina: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  tipoProducto: 'BATIDO' | 'REFRESCO' | 'WAFFLE';
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Sabor {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  proteina: number | null;
  calorias: number | null;
  volumen: number | null;
  carbohidratos: number | null;
  grasas: number | null;
  fibra: number | null;
  azucar: number | null;
  categoriaId: string | null;
  saborId: string | null;
  tamanoId: string | null;
  urlImagen: string | null;
  ingredientes: string[];
  etiquetas: string[];
  momentosRecomendados: ('MANANA' | 'PRE_ENTRENAMIENTO' | 'POST_ENTRENAMIENTO' | 'TARDE' | 'NOCHE' | 'ANTES_DORMIR')[];
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  categoria?: Categoria;
  sabor?: Sabor;
  tamano?: Tamano;
}

// =============================================
// REQUEST TYPES
// =============================================

// Sabores
export interface CreateSaborRequest {
  nombre: string;
  descripcion?: string | null;
}

export interface UpdateSaborRequest {
  nombre?: string;
  descripcion?: string | null;
}

// Productos
export interface CreateProductoRequest {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  proteina?: number | null;
  calorias?: number | null;
  volumen?: number | null;
  carbohidratos?: number | null;
  grasas?: number | null;
  fibra?: number | null;
  azucar?: number | null;
  categoriaId?: string | null;
  saborId?: string | null;
  tamanoId?: string | null;
  urlImagen?: string | null;
  ingredientes?: string[];
  etiquetas?: string[];
  momentosRecomendados?: ('MANANA' | 'PRE_ENTRENAMIENTO' | 'POST_ENTRENAMIENTO' | 'TARDE' | 'NOCHE' | 'ANTES_DORMIR')[];
}

export interface UpdateProductoRequest {
  nombre?: string;
  descripcion?: string | null;
  precio?: number;
  proteina?: number | null;
  calorias?: number | null;
  volumen?: number | null;
  carbohidratos?: number | null;
  grasas?: number | null;
  fibra?: number | null;
  azucar?: number | null;
  categoriaId?: string | null;
  saborId?: string | null;
  tamanoId?: string | null;
  urlImagen?: string | null;
  ingredientes?: string[];
  etiquetas?: string[];
  momentosRecomendados?: ('MANANA' | 'PRE_ENTRENAMIENTO' | 'POST_ENTRENAMIENTO' | 'TARDE' | 'NOCHE' | 'ANTES_DORMIR')[];
}

// Query Parameters
export interface ListTamanosParams {
  nombre?: string;
  volumenMinimo?: number;
  volumenMaximo?: number;
  proteinaMinima?: number;
}

export interface ListCategoriasParams {
  tipoProducto?: 'BATIDO' | 'REFRESCO' | 'WAFFLE';
  nombre?: string;
}

export interface ListSaboresParams {
  nombre?: string;
  conDescripcion?: boolean;
}

export interface ListProductosParams {
  nombre?: string;
  categoriaId?: string;
  saborId?: string;
  tamanoId?: string;
  precioMinimo?: number;
  precioMaximo?: number;
  momentoDelDia?: 'MANANA' | 'PRE_ENTRENAMIENTO' | 'POST_ENTRENAMIENTO' | 'TARDE' | 'NOCHE' | 'ANTES_DORMIR';
  etiqueta?: string;
}

// =============================================
// RESPONSE TYPES
// =============================================

export interface ListSaboresResponse {               // ✅ Objeto con estructura
  sabores: Sabor[];
  total: number;
}
export interface ListProductosResponse {             // ✅ Objeto con estructura
  productos: Producto[];
  total: number;
}
export interface ListCategoriasResponse {            // ✅ Objeto con estructura
  categorias: Categoria[];
  total: number;
}
export interface ListCategoriasByTypeResponse {      // ✅ Objeto con estructura
  categorias: Categoria[];
}
export interface ListTamanosResponse {               // ✅ Objeto con estructura
  tamanos: Tamano[];
  total: number;
}

export interface ListTamanosByVolumeResponse {       // ✅ Objeto con estructura
  tamanos: Tamano[];
}

// Tamaños
export type GetTamanoByIdResponse = Tamano;

// Categorías
export type GetCategoriaByIdResponse = Categoria;

// Sabores
export type CreateSaborResponse = Sabor;
export type UpdateSaborResponse = Sabor;
export type GetSaborByIdResponse = Sabor;
export type DeleteSaborResponse = { message: string };

// Productos
export type CreateProductoResponse = Producto;
export type UpdateProductoResponse = Producto;
export type GetProductoByIdResponse = Producto;
export type DeleteProductoResponse = { message: string };