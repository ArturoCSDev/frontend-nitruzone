// src/features/products/types/product-api.types.ts

// =============================================
// TAMAÑOS
// =============================================
export interface TamanoItem {
    id: string;
    nombre: string;
    volumen: number;
    unidadMedida: string;
    descripcion?: string;
    activo: boolean;
    fechaCreacion: string;
  }
  
  export interface GetTamanoByIdResponse {
    tamano: TamanoItem;
  }
  
  export interface ListTamanosResponse {
    tamanos: TamanoItem[];
    total: number;
  }
  
  export interface ListTamanosByVolumeResponse {
    tamanos: TamanoItem[];
    total: number;
    volumeRange: {
      min: number;
      max: number;
    };
  }
  
  // =============================================
  // CATEGORÍAS
  // =============================================
  export interface CategoriaItem {
    id: string;
    nombre: string;
    tipoProducto: string;
    descripcion?: string;
    activo: boolean;
    fechaCreacion: string;
    productCount?: number;
  }
  
  export interface GetCategoriaByIdResponse {
    categoria: CategoriaItem;
  }
  
  export interface ListCategoriasResponse {
    categorias: CategoriaItem[];
    total: number;
  }
  
  export interface ListCategoriasByTypeResponse {
    categorias: CategoriaItem[];
    total: number;
    tipoProducto: string;
  }
  
  // =============================================
  // SABORES
  // =============================================
  export interface CreateSaborRequest {
    nombre: string;
    descripcion?: string;
    activo?: boolean;
  }
  
  export interface UpdateSaborRequest {
    nombre?: string;
    descripcion?: string;
    activo?: boolean;
  }
  
  export interface SaborItem {
    id: string;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion?: string;
    productCount?: number;
  }
  
  export interface CreateSaborResponse {
    sabor: SaborItem;
    message: string;
  }
  
  export interface UpdateSaborResponse {
    sabor: SaborItem;
    message: string;
  }
  
  export interface GetSaborByIdResponse {
    sabor: SaborItem;
  }
  
  export interface ListSaboresResponse {
    sabores: SaborItem[];
    total: number;
  }
  
  export interface DeleteSaborResponse {
    message: string;
    deletedId: string;
  }
  
  // =============================================
  // PRODUCTOS
  // =============================================
  export interface CreateProductoRequest {
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    stockMinimo?: number;
    categoriaId: string;
    saboreIds?: string[];
    tamanoIds?: string[];
    activo?: boolean;
    imagenes?: string[];
  }
  
  export interface UpdateProductoRequest {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    stock?: number;
    stockMinimo?: number;
    categoriaId?: string;
    saboreIds?: string[];
    tamanoIds?: string[];
    activo?: boolean;
    imagenes?: string[];
  }
  
  export interface ProductoItem {
    id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    stockMinimo: number;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion?: string;
    categoria: {
      id: string;
      nombre: string;
      tipoProducto: string;
    };
    sabores: Array<{
      id: string;
      nombre: string;
    }>;
    tamanos: Array<{
      id: string;
      nombre: string;
      volumen: number;
      unidadMedida: string;
    }>;
    imagenes: string[];
    isLowStock: boolean;
    isOutOfStock: boolean;
  }
  
  export interface CreateProductoResponse {
    producto: ProductoItem;
    message: string;
  }
  
  export interface UpdateProductoResponse {
    producto: ProductoItem;
    message: string;
  }
  
  export interface GetProductoByIdResponse {
    producto: ProductoItem;
  }
  
  export interface ListProductosResponse {
    productos: ProductoItem[];
    total: number;
  }
  
  export interface DeleteProductoResponse {
    message: string;
    deletedId: string;
  }