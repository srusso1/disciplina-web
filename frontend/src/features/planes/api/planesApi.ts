import { apiClient } from '../../../core/api/apiClient';
import {
  PlanIntervencionResponse,
  CrearPlanIntervencionRequest,
  ActualizarPlanIntervencionRequest,
  RegistrarSeguimientoRequest,
  PropuestaIaResponse,
} from '../types/planes.types';
import { PaginaRespuesta } from '../../matriculas/types/matricula.types';

export const planesApi = {
  listarPorEstudiante: async (estudianteId: number): Promise<PlanIntervencionResponse[]> => {
    const response = await apiClient.get<PlanIntervencionResponse[]>(
      `/planes-intervencion/estudiante/${estudianteId}`
    );
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<PlanIntervencionResponse> => {
    const response = await apiClient.get<PlanIntervencionResponse>(`/planes-intervencion/${id}`);
    return response.data;
  },

  crearPlan: async (data: CrearPlanIntervencionRequest): Promise<PlanIntervencionResponse> => {
    const response = await apiClient.post<PlanIntervencionResponse>('/planes-intervencion', data);
    return response.data;
  },

  actualizarPlan: async (
    id: number,
    data: ActualizarPlanIntervencionRequest
  ): Promise<PlanIntervencionResponse> => {
    const response = await apiClient.put<PlanIntervencionResponse>(
      `/planes-intervencion/${id}`,
      data
    );
    return response.data;
  },

  registrarSeguimiento: async (
    planId: number,
    data: RegistrarSeguimientoRequest
  ): Promise<PlanIntervencionResponse> => {
    const response = await apiClient.post<PlanIntervencionResponse>(
      `/planes-intervencion/${planId}/seguimientos`,
      data
    );
    return response.data;
  },

  listarPlanesPaginados: async (params?: {
    estado?: string;
    busqueda?: string;
    page?: number;
    size?: number;
  }): Promise<PaginaRespuesta<PlanIntervencionResponse>> => {
    const response = await apiClient.get<PaginaRespuesta<PlanIntervencionResponse>>(
      '/planes-intervencion',
      { params }
    );
    return response.data;
  },

  generarPropuestaIa: async (estudianteId: number, incidenteOrigenId: number): Promise<PropuestaIaResponse> => {
    const response = await apiClient.post<PropuestaIaResponse>('/ia/generar-intervencion', {
      estudianteId,
      incidenteOrigenId,
    });
    return response.data;
  },
};

