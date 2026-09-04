import { apiClient } from '../../../core/api/apiClient';
import { ImportacionMatriculasResumen, EstudianteMatricula, PaginaRespuesta, ActualizarEstudianteData } from '../types/matricula.types';

export const matriculasApi = {
  importarMasivo: async (file: File, anioLectivo?: number): Promise<ImportacionMatriculasResumen> => {
    const formData = new FormData();
    formData.append('file', file);
    if (anioLectivo) {
      formData.append('anioLectivo', anioLectivo.toString());
    }

    const response = await apiClient.post<ImportacionMatriculasResumen>(
      '/matriculas/importar-masivo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  listarEstudiantes: async (params?: {
    page?: number;
    size?: number;
    anioLectivo?: number;
    grado?: string;
    grupo?: string;
    busqueda?: string;
  }): Promise<PaginaRespuesta<EstudianteMatricula>> => {
    const response = await apiClient.get<PaginaRespuesta<EstudianteMatricula>>('/matriculas/estudiantes', {
      params,
    });
    return response.data;
  },

  actualizarEstudiante: async (
    id: number,
    data: ActualizarEstudianteData
  ): Promise<EstudianteMatricula> => {
    const response = await apiClient.put<EstudianteMatricula>(`/matriculas/estudiantes/${id}`, data);
    return response.data;
  },

  obtenerResumen: async (anioLectivo?: number): Promise<{ anioLectivo: number; totalMatriculados: number }> => {
    const response = await apiClient.get<{ anioLectivo: number; totalMatriculados: number }>(
      '/matriculas/resumen',
      { params: { anioLectivo } }
    );
    return response.data;
  },
};