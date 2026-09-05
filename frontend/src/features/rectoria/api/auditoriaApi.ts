import { apiClient } from '../../../core/api/apiClient';
import { AuditoriaRegistro, FiltrosAuditoria } from '../types/auditoria.types';
import { PaginaRespuesta } from '../../matriculas/types/matricula.types';

export const auditoriaApi = {
  listarAuditorias: async (filtros?: FiltrosAuditoria): Promise<PaginaRespuesta<AuditoriaRegistro>> => {
    const response = await apiClient.get<PaginaRespuesta<AuditoriaRegistro>>('/auditoria', {
      params: filtros,
    });
    return response.data;
  },

  obtenerHistorialPorEntidad: async (
    entidad: string,
    entidadId: string
  ): Promise<AuditoriaRegistro[]> => {
    const response = await apiClient.get<AuditoriaRegistro[]>(
      `/auditoria/entidad/${entidad}/${entidadId}`
    );
    return response.data;
  },
};
