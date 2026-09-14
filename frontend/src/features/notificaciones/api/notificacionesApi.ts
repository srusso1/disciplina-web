import { apiClient } from '../../../core/api/apiClient';
import { NotificacionItem, ConteoNotificacionesDTO } from '../types/notificacion.types';

export const notificacionesApi = {
  obtenerUltimas: async (limite: number = 15): Promise<NotificacionItem[]> => {
    const response = await apiClient.get<NotificacionItem[]>(`/notificaciones?limite=${limite}`);
    return response.data;
  },

  obtenerConteoNoLeidas: async (): Promise<ConteoNotificacionesDTO> => {
    const response = await apiClient.get<ConteoNotificacionesDTO>('/notificaciones/conteo-no-leidas');
    return response.data;
  },

  marcarLeida: async (id: number): Promise<NotificacionItem> => {
    const response = await apiClient.patch<NotificacionItem>(`/notificaciones/${id}/leer`);
    return response.data;
  },

  marcarTodasLeidas: async (): Promise<void> => {
    await apiClient.patch('/notificaciones/marcar-todas-leidas');
  },
};
