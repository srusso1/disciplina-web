import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
  // No depender del comportamiento implícito de Axios: el backend emite
  // XSRF-TOKEN y toda mutación debe devolverlo como X-XSRF-TOKEN.
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withXSRFToken: true,
});

// La sesión se transporta exclusivamente en la cookie HttpOnly; nunca se expone
// el JWT a JavaScript mediante Web Storage o cabeceras Bearer.
// El interceptor purga únicamente el perfil de interfaz ante un 401.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login');
      if (!isAuthEndpoint) {
        sessionStorage.removeItem('disciplina_user');
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

