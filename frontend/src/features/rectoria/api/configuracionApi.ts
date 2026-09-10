import { apiClient } from '../../../core/api/apiClient';
import {
  CatalogoFaltaItem,
  CatalogoFaltaRequest,
  DocenteItem,
  DocenteRequest,
  LugarItem,
  LugarRequest,
  PaginaRespuesta,
  UsuarioItem,
  UsuarioRequest,
} from '../types/configuracion.types';

export const configuracionApi = {
  // Catalogo de Faltas
  listarCatalogoFaltas: async (params?: { page?: number; size?: number }): Promise<PaginaRespuesta<CatalogoFaltaItem>> => {
    const response = await apiClient.get<PaginaRespuesta<CatalogoFaltaItem>>('/configuracion/catalogo-faltas', { params });
    return response.data;
  },

  crearCatalogoFalta: async (data: CatalogoFaltaRequest): Promise<CatalogoFaltaItem> => {
    const response = await apiClient.post<CatalogoFaltaItem>('/configuracion/catalogo-faltas', data);
    return response.data;
  },

  actualizarCatalogoFalta: async (id: number, data: CatalogoFaltaRequest): Promise<CatalogoFaltaItem> => {
    const response = await apiClient.put<CatalogoFaltaItem>(`/configuracion/catalogo-faltas/${id}`, data);
    return response.data;
  },

  toggleActivoCatalogoFalta: async (id: number): Promise<CatalogoFaltaItem> => {
    const response = await apiClient.patch<CatalogoFaltaItem>(`/configuracion/catalogo-faltas/${id}/toggle-activo`);
    return response.data;
  },

  // Docentes
  listarDocentes: async (params?: { page?: number; size?: number; q?: string }): Promise<PaginaRespuesta<DocenteItem>> => {
    const response = await apiClient.get<PaginaRespuesta<DocenteItem>>('/configuracion/docentes', { params });
    return response.data;
  },

  crearDocente: async (data: DocenteRequest): Promise<DocenteItem> => {
    const response = await apiClient.post<DocenteItem>('/configuracion/docentes', data);
    return response.data;
  },

  actualizarDocente: async (id: number, data: DocenteRequest): Promise<DocenteItem> => {
    const response = await apiClient.put<DocenteItem>(`/configuracion/docentes/${id}`, data);
    return response.data;
  },

  toggleActivoDocente: async (id: number): Promise<DocenteItem> => {
    const response = await apiClient.patch<DocenteItem>(`/configuracion/docentes/${id}/toggle-activo`);
    return response.data;
  },

  // Lugares
  listarLugares: async (params?: { page?: number; size?: number; q?: string }): Promise<PaginaRespuesta<LugarItem>> => {
    const response = await apiClient.get<PaginaRespuesta<LugarItem>>('/configuracion/lugares', { params });
    return response.data;
  },

  crearLugar: async (data: LugarRequest): Promise<LugarItem> => {
    const response = await apiClient.post<LugarItem>('/configuracion/lugares', data);
    return response.data;
  },

  actualizarLugar: async (id: number, data: LugarRequest): Promise<LugarItem> => {
    const response = await apiClient.put<LugarItem>(`/configuracion/lugares/${id}`, data);
    return response.data;
  },

  toggleActivoLugar: async (id: number): Promise<LugarItem> => {
    const response = await apiClient.patch<LugarItem>(`/configuracion/lugares/${id}/toggle-activo`);
    return response.data;
  },

  // Usuarios
  listarUsuarios: async (params?: { page?: number; size?: number }): Promise<PaginaRespuesta<UsuarioItem>> => {
    const response = await apiClient.get<PaginaRespuesta<UsuarioItem>>('/configuracion/usuarios', { params });
    return response.data;
  },

  crearUsuario: async (data: UsuarioRequest): Promise<UsuarioItem> => {
    const response = await apiClient.post<UsuarioItem>('/configuracion/usuarios', data);
    return response.data;
  },

  actualizarUsuario: async (id: number, data: UsuarioRequest): Promise<UsuarioItem> => {
    const response = await apiClient.put<UsuarioItem>(`/configuracion/usuarios/${id}`, data);
    return response.data;
  },

  toggleActivoUsuario: async (id: number): Promise<UsuarioItem> => {
    const response = await apiClient.patch<UsuarioItem>(`/configuracion/usuarios/${id}/toggle-activo`);
    return response.data;
  },
};
