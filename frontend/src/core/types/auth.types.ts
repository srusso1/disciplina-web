export type UserRole = 'ROLE_RECTOR' | 'ROLE_ORIENTADOR';

export interface User {
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: UserRole;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}
