export interface PaginaRespuesta<T> {
  contenido: T[];
  pagina: number;
  tamanoPagina: number;
  totalElementos: number;
  totalPaginas: number;
  primera: boolean;
  ultima: boolean;
}

export interface CatalogoFaltaItem {
  id: number;
  codigo: string;
  clasificacionLey: 'TIPO_I' | 'TIPO_II' | 'TIPO_III';
  gravedadInstitucional: 'LEVE' | 'GRAVE' | 'GRAVISIMA';
  descripcion: string;
  procedimientoSugerido?: string;
  activo: boolean;
}

export interface DocenteItem {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  areaDesempeno?: string;
  activo: boolean;
}

export interface LugarItem {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}


export interface UsuarioItem {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: 'ROLE_RECTOR' | 'ROLE_ORIENTADOR';
  activo: boolean;
  createdAt: string;
}

export interface CatalogoFaltaRequest {
  codigo: string;
  clasificacionLey: string;
  gravedadInstitucional: string;
  descripcion: string;
  procedimientoSugerido?: string;
  activo?: boolean;
}

export interface DocenteRequest {
  documento: string;
  nombres: string;
  apellidos: string;
  areaDesempeno?: string;
  activo?: boolean;
}

export interface LugarRequest {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface UsuarioRequest {
  username: string;
  password?: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;
  activo?: boolean;
}
