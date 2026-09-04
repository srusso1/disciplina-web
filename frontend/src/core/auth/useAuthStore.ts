import { create } from 'zustand';
import { apiClient } from '../api/apiClient';
import { AuthResponse, LoginCredentials, User, UserRole, ApiError } from '../types/auth.types';
import axios from 'axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<UserRole>;
  logout: () => void;
  clearError: () => void;
}

const getInitialUser = (): User | null => {
  try {
    const raw = localStorage.getItem('disciplina_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialToken = localStorage.getItem('disciplina_token');
const initialUser = getInitialUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken && initialUser),
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials): Promise<UserRole> => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const data = response.data;

      const user: User = {
        username: data.username,
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        rol: data.rol,
      };

      localStorage.setItem('disciplina_token', data.token);
      localStorage.setItem('disciplina_user', JSON.stringify(user));

      set({
        user,
        token: data.token,
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
        token: null,
      });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('disciplina_token');
    localStorage.removeItem('disciplina_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

// Escuchar evento de 401 disparado por el interceptor de Axios
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}
