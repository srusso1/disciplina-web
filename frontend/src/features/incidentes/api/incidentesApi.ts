import { apiClient } from '../../../core/api/apiClient';
import {
  DocenteCatalogo,
  LugarCatalogo,
  CatalogoFalta,
  RegistrarIncidenteData,
  Incidente,
  InvolucradoResponse,
  ActualizarEstadoData,
  ActualizarDescargoData,
  EstadisticasIncidentes,
  PaginaIncidentes,
  EstadoProceso,
  ClasificacionLey,
  GravedadInstitucional,
  NarrativaProcesada,
  ProcesarNarrativaData,
  PropuestaIntervencionIA,
  GenerarPropuestaIntervencionData,
} from '../types/incidente.types';

export const incidentesApi = {
  // Catalogos
  listarDocentes: async (): Promise<DocenteCatalogo[]> => {
    const response = await apiClient.get<DocenteCatalogo[]>('/catalogos/docentes');
    return response.data;
  },

  listarLugares: async (): Promise<LugarCatalogo[]> => {
    const response = await apiClient.get<LugarCatalogo[]>('/catalogos/lugares');
    return response.data;
  },

  listarFaltas: async (params?: {
    tipo?: ClasificacionLey;
    tipoLey?: ClasificacionLey;
    gravedad?: GravedadInstitucional;
  }): Promise<CatalogoFalta[]> => {
    const queryParams = params
      ? {
          ...params,
          tipo: params.tipo || params.tipoLey,
          tipoLey: params.tipoLey || params.tipo,
        }
      : undefined;
    const response = await apiClient.get<CatalogoFalta[]>('/catalogos/faltas', { params: queryParams });
    return response.data;
  },

  // Incidentes
  registrar: async (data: RegistrarIncidenteData): Promise<Incidente> => {
    const response = await apiClient.post<Incidente>('/incidentes', data);
    return response.data;
  },

  listar: async (params?: {
    page?: number;
    size?: number;
    estado?: EstadoProceso;
    tipoLey?: ClasificacionLey;
    busqueda?: string;
  }): Promise<PaginaIncidentes> => {
    const response = await apiClient.get<PaginaIncidentes>('/incidentes', { params });
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<Incidente> => {
    const response = await apiClient.get<Incidente>(`/incidentes/${id}`);
    return response.data;
  },

  actualizarEstado: async (id: number, data: ActualizarEstadoData): Promise<Incidente> => {
    const payload = {
      estadoProceso: data.estadoProceso || data.nuevoEstado,
      nuevoEstado: data.nuevoEstado || data.estadoProceso,
      observaciones: data.observaciones,
    };
    const response = await apiClient.patch<Incidente>(`/incidentes/${id}/estado`, payload);
    return response.data;
  },

  actualizarDescargo: async (
    incidenteId: number,
    estudianteId: number,
    data: ActualizarDescargoData
  ): Promise<InvolucradoResponse> => {
    const payload = {
      descargoEstudiante: data.descargoEstudiante || data.descargo,
      compromisoIndividual: data.compromisoIndividual || data.compromisos,
      descargo: data.descargo || data.descargoEstudiante,
      compromisos: data.compromisos || data.compromisoIndividual,
    };
    const response = await apiClient.put<InvolucradoResponse>(
      `/incidentes/${incidenteId}/estudiantes/${estudianteId}/descargo`,
      payload
    );
    return response.data;
  },

  obtenerEstadisticas: async (): Promise<EstadisticasIncidentes> => {
    const response = await apiClient.get<EstadisticasIncidentes>('/incidentes/estadisticas');
    return response.data;
  },

  // IA y Asistente PLN de Convivencia
  procesarNarrativa: async (data: ProcesarNarrativaData): Promise<NarrativaProcesada> => {
    const response = await apiClient.post<NarrativaProcesada>('/ia/procesar-narrativa', data);
    return response.data;
  },

  generarPropuestaIntervencion: async (
    data: GenerarPropuestaIntervencionData
  ): Promise<PropuestaIntervencionIA> => {
    const response = await apiClient.post<PropuestaIntervencionIA>(
      '/ia/generar-intervencion',
      data
    );
    return response.data;
  },

  // Generación Documental en Memoria (PDF)
  descargarActaPdf: async (incidenteId: number): Promise<Blob> => {
    const response = await apiClient.get(`/reportes/pdf/incidente/${incidenteId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
