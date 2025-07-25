// src/features/products/api/product.api.ts
import { api } from '../../../lib/api/axios-instance';
import { INVENTORY_ENDPOINTS } from '@/lib/api/endpoints/products.endpoints';
import { 
  // Tamaños
  GetTamanoByIdResponse,
  ListTamanosResponse,
  ListTamanosByVolumeResponse,
  ListTamanosParams,
  // Categorías
  GetCategoriaByIdResponse,
  ListCategoriasResponse,
  ListCategoriasByTypeResponse,
  ListCategoriasParams,
  // Sabores
  CreateSaborRequest,
  UpdateSaborRequest,
  CreateSaborResponse,
  UpdateSaborResponse,
  GetSaborByIdResponse,
  ListSaboresResponse,
  DeleteSaborResponse,
  ListSaboresParams,
  // Productos
  CreateProductoRequest,
  UpdateProductoRequest,
  CreateProductoResponse,
  UpdateProductoResponse,
  GetProductoByIdResponse,
  ListProductosResponse,
  DeleteProductoResponse,
  ListProductosParams,
  Producto,
  Tamano,
  Categoria,
  Sabor
} from '../types/product-api.types';

export const productApi = {
  // =============================================
  // TAMAÑOS
  // =============================================
  
  async getTamanoById(id: string): Promise<GetTamanoByIdResponse> {
    const response = await api.get<GetTamanoByIdResponse>(
      INVENTORY_ENDPOINTS.TAMANOS.ID.replace(':id', id)
    );
    return response.data.data!;
  },

  async listTamanos(params?: ListTamanosParams): Promise<Tamano[]> {
    const response = await api.get<ListTamanosResponse>(
      INVENTORY_ENDPOINTS.TAMANOS.GET_ALL, 
      {params}
    );
    return response.data.data!.tamanos;
  },

  async getTamanosByVolume(min: number, max: number): Promise<Tamano[]> {
    const response = await api.get<ListTamanosByVolumeResponse>(
      INVENTORY_ENDPOINTS.TAMANOS.GET_BY_VOLUME
        .replace(':min', min.toString())
        .replace(':max', max.toString())
    );
    return response.data.data!.tamanos;
  },

  // =============================================
  // CATEGORÍAS
  // =============================================

  async getCategoriaById(id: string): Promise<GetCategoriaByIdResponse> {
    const response = await api.get<GetCategoriaByIdResponse>(
      INVENTORY_ENDPOINTS.CATEGORIAS.ID.replace(':id', id)
    );
    return response.data.data!;
  },

  async listCategorias(params?: ListCategoriasParams): Promise<Categoria[]> {
    const response = await api.get<ListCategoriasResponse>(
      INVENTORY_ENDPOINTS.CATEGORIAS.GET_ALL,
      {params}
    );
    return response.data.data!.categorias;
  },

  async getCategoriasByType(tipoProducto: string): Promise<Categoria[]> {
    const response = await api.get<ListCategoriasByTypeResponse>(
      INVENTORY_ENDPOINTS.CATEGORIAS.GET_BY_TYPE.replace(':tipoProducto', tipoProducto)
    );
    return response.data.data!.categorias;
  },

  // =============================================
  // SABORES
  // =============================================

  async createSabor(data: CreateSaborRequest): Promise<CreateSaborResponse> {
    const response = await api.post<CreateSaborResponse>(
      INVENTORY_ENDPOINTS.SABORES.POST, 
      data
    );
    return response.data.data!;
  },

  async updateSabor(id: string, data: UpdateSaborRequest): Promise<UpdateSaborResponse> {
    const response = await api.put<UpdateSaborResponse>(
      INVENTORY_ENDPOINTS.SABORES.PUT.replace(':id', id),
      data
    );
    return response.data.data!;
  },

  async getSaborById(id: string): Promise<GetSaborByIdResponse> {
    const response = await api.get<GetSaborByIdResponse>(
      INVENTORY_ENDPOINTS.SABORES.ID.replace(':id', id)
    );
    return response.data.data!; 
  },

  async listSabores(params?: ListSaboresParams): Promise<Sabor[]> {
    const response = await api.get<ListSaboresResponse>(
      INVENTORY_ENDPOINTS.SABORES.GET_ALL,
      {params}
    );
    return response.data.data!.sabores;
  },

  async deleteSabor(id: string): Promise<DeleteSaborResponse> {
    const response = await api.delete<DeleteSaborResponse>(
      INVENTORY_ENDPOINTS.SABORES.DELETE.replace(':id', id)
    );
    return response.data.data!;
  },

  // =============================================
  // PRODUCTOS
  // =============================================

  async createProducto(data: CreateProductoRequest): Promise<CreateProductoResponse> {
    const response = await api.post<CreateProductoResponse>(
      INVENTORY_ENDPOINTS.PRODUCTOS.POST, 
      data
    );
    return response.data.data!;
  },

  async updateProducto(id: string, data: UpdateProductoRequest): Promise<UpdateProductoResponse> {
    const response = await api.put<UpdateProductoResponse>(
      INVENTORY_ENDPOINTS.PRODUCTOS.PUT.replace(':id', id),
      data
    );
    return response.data.data!;
  },

  async getProductoById(id: string): Promise<GetProductoByIdResponse> {
    const response = await api.get<GetProductoByIdResponse>(
      INVENTORY_ENDPOINTS.PRODUCTOS.ID.replace(':id', id)
    );
    return response.data.data!;
  },

  async listProductos(params?: ListProductosParams): Promise<Producto[]> {
    const response = await api.get<ListProductosResponse>(
      INVENTORY_ENDPOINTS.PRODUCTOS.GET_ALL,
      {params}
    );
    return response.data.data!.productos;
  },

  async deleteProducto(id: string): Promise<DeleteProductoResponse> {
    const response = await api.delete<DeleteProductoResponse>(
      INVENTORY_ENDPOINTS.PRODUCTOS.DELETE.replace(':id', id)
    );
    return response.data.data!;
  },
};
