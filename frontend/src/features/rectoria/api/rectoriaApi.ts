import { apiClient } from '../../../core/api/apiClient';
import { MetricasDashboardRectoria } from '../types/rectoria.types';

export const rectoriaApi = {
  obtenerMetricasDashboard: async (): Promise<MetricasDashboardRectoria> => {
    const response = await apiClient.get<MetricasDashboardRectoria>('/rectoria/metricas-dashboard');
    return response.data;
  },

  descargarConsolidadoPdf: async (): Promise<Blob> => {
    const response = await apiClient.get('/reportes/pdf/consolidado-rectoria', {
      responseType: 'blob',
    });
    return response.data;
  },
};
