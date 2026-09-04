import { apiClient } from '../../../core/api/apiClient';
import { ImportacionMatriculasResumen, EstudianteMatricula } from '../types/matricula.types';

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
    anioLectivo?: number;
    grado?: string;
    grupo?: string;
    busqueda?: string;
  }): Promise<EstudianteMatricula[]> => {
    const response = await apiClient.get<EstudianteMatricula[]>('/matriculas/estudiantes', {
      params,
    });
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