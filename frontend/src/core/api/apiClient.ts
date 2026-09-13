import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// Interceptor de Peticiones: inyecta Bearer token JWT si existe (prioriza sessionStorage para mitigar XSS en reposo)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('disciplina_token') || localStorage.getItem('disciplina_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuestas: detecta 401 y purga la sesion en todos los almacenamientos
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login');
      if (!isAuthEndpoint) {
        sessionStorage.removeItem('disciplina_token');
        sessionStorage.removeItem('disciplina_user');
        localStorage.removeItem('disciplina_token');
        localStorage.removeItem('disciplina_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export interface ApiErrorPayload {
  status?: number;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export const extraerMensajeError = (err: unknown, mensajePorDefecto = 'Ocurrió un error inesperado'): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorPayload | undefined;
    if (data) {
      if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
        return Object.values(data.fieldErrors).join('. ');
      }
      if (data.message) {
        return data.message;
      }
    }
    if (err.message) {
      return err.message;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return mensajePorDefecto;
};

