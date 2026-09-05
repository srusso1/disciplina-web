import { apiClient } from '../../../core/api/apiClient';
import { MetricasDashboardRectoria } from '../types/rectoria.types';

export const rectoriaApi = {
  obtenerMetricasDashboard: async (): Promise<MetricasDashboardRectoria> => {
    const response = await apiClient.get<MetricasDashboardRectoria>('/rectoria/metricas-dashboard');
    return response.data;
  },
};
