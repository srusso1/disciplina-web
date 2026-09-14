import { apiClient } from '../../../core/api/apiClient';
import type {
  AreaDesempenoItem,
  AreaDesempenoRequest,
  PaginaRespuesta,
} from '../types/configuracion.types';

export const areasDesempenoApi = {
  listarActivas: async (): Promise<AreaDesempenoItem[]> => {
    const { data } = await apiClient.get<AreaDesempenoItem[]>('/areas-desempeno/activas');
    return data;
  },

  listarPaginado: async (params?: {
    q?: string;
    page?: number;
    size?: number;
  }): Promise<PaginaRespuesta<AreaDesempenoItem>> => {
    const { data } = await apiClient.get<PaginaRespuesta<AreaDesempenoItem>>('/areas-desempeno', {
      params: {
        q: params?.q || undefined,
        page: params?.page ?? 0,
        size: params?.size ?? 15,
      },
    });
    return data;
  },

  crear: async (payload: AreaDesempenoRequest): Promise<AreaDesempenoItem> => {
    const { data } = await apiClient.post<AreaDesempenoItem>('/areas-desempeno', payload);
    return data;
  },

  actualizar: async (id: number, payload: AreaDesempenoRequest): Promise<AreaDesempenoItem> => {
    const { data } = await apiClient.put<AreaDesempenoItem>(`/areas-desempeno/${id}`, payload);
    return data;
  },

  eliminarLogico: async (id: number): Promise<void> => {
    await apiClient.delete(`/areas-desempeno/${id}`);
  },

  toggleActivo: async (id: number): Promise<AreaDesempenoItem> => {
    const { data } = await apiClient.patch<AreaDesempenoItem>(`/areas-desempeno/${id}/toggle-activo`);
    return data;
  },
};
