import { apiClient } from '../../../core/api/apiClient';
import { NotificacionItem, ConteoNotificacionesDTO } from '../types/notificacion.types';

export const notificacionesApi = {
  obtenerUltimas: async (limite: number = 15): Promise<NotificacionItem[]> => {
    const response = await apiClient.get<NotificacionItem[]>(`/api/v1/notificaciones?limite=${limite}`);
    return response.data;
  },

  obtenerConteoNoLeidas: async (): Promise<ConteoNotificacionesDTO> => {
    const response = await apiClient.get<ConteoNotificacionesDTO>('/api/v1/notificaciones/conteo-no-leidas');
    return response.data;
  },

  marcarLeida: async (id: number): Promise<NotificacionItem> => {
    const response = await apiClient.patch<NotificacionItem>(`/api/v1/notificaciones/${id}/leer`);
    return response.data;
  },

  marcarTodasLeidas: async (): Promise<void> => {
    await apiClient.patch('/api/v1/notificaciones/marcar-todas-leidas');
  },
};
