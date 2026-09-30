import { apiClient } from '../../../core/api/apiClient';
import {
  CitacionResponse,
  CrearCitacionData,
  EstadoCitacion,
  HistorialEstadoCitacion,
} from '../types/citacion.types';

export const citacionesApi = {
  crear: async (data: CrearCitacionData) =>
    (await apiClient.post<CitacionResponse>('/citaciones', data)).data,
  listarPorIncidente: async (id: number) =>
    (await apiClient.get<CitacionResponse[]>(`/citaciones/incidente/${id}`)).data,
  listarPorEstudiante: async (id: number) =>
    (await apiClient.get<CitacionResponse[]>(`/citaciones/estudiante/${id}`)).data,
  actualizarEstado: async (id: number, estado: EstadoCitacion, motivo?: string) =>
    (await apiClient.patch<CitacionResponse>(`/citaciones/${id}/estado`, { estado, motivo })).data,
  reenviar: async (id: number) =>
    (await apiClient.post<CitacionResponse>(`/citaciones/${id}/reenviar`)).data,
  obtenerHistorial: async (id: number) =>
    (await apiClient.get<HistorialEstadoCitacion[]>(`/citaciones/${id}/historial`)).data,
};
