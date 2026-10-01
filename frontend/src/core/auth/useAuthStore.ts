import { create } from 'zustand';
import { apiClient } from '../api/apiClient';
import { AuthResponse, LoginCredentials, User, UserRole, ApiError } from '../types/auth.types';
import axios from 'axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<UserRole>;
  logout: () => void;
  clearError: () => void;
}

const getInitialUser = (): User | null => {
  try {
    const raw = sessionStorage.getItem('disciplina_user') || localStorage.getItem('disciplina_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialUser = getInitialUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials): Promise<UserRole> => {
    set({ isLoading: true, error: null });
    try {
      // Emite XSRF-TOKEN antes del login; Axios lo reenvía automáticamente
      // en las posteriores mutaciones autenticadas.
      await apiClient.get('/auth/csrf');
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const data = response.data;

      // Spring rota/invalida el token CSRF al autenticar para prevenir
      // fijación de sesión. Debe solicitarse de nuevo después del login;
      // de lo contrario el primer POST autenticado (p. ej. una citación)
      // será rechazado con 403.
      await apiClient.get('/auth/csrf');

      const user: User = {
        username: data.username,
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        rol: data.rol,
      };

      // Solo se conserva el perfil para restaurar la interfaz. El JWT vive en
      // una cookie HttpOnly y no es accesible desde JavaScript.
      sessionStorage.setItem('disciplina_user', JSON.stringify(user));
      // Purgar almacenamiento previo en localStorage para mitigar retención indebida en terminales compartidas
      localStorage.removeItem('disciplina_user');

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user.rol;
    } catch (err: unknown) {
      let errorMessage = 'Error al conectar con el servidor de autenticacion';
      if (axios.isAxiosError(err) && err.response?.data) {
        const apiError = err.response.data as ApiError;
        errorMessage = apiError.message || errorMessage;
      }
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
      });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    // Notificar al backend para que invalide la cookie HttpOnly
    apiClient.post('/auth/logout').catch(() => {});

    sessionStorage.removeItem('disciplina_user');
    localStorage.removeItem('disciplina_user');
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

// La cookie CSRF no es persistente por diseño. Al restaurar el perfil de la
// interfaz tras una recarga, solicitamos un token nuevo antes de la primera
// mutación autenticada (por ejemplo, crear una citación).
if (initialUser && typeof window !== 'undefined') {
  void apiClient.get('/auth/csrf').catch(() => {
    // Un 401 posterior limpiará el perfil; no interrumpir el render inicial.
  });
}

// Escuchar evento de 401 disparado por el interceptor de Axios
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}
