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

export interface AreaDesempenoItem {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt?: string;
}

export interface AreaDesempenoRequest {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface DocenteItem {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  areaDesempenoId?: number;
  areaDesempeno?: string;
  areaDesempenoDetalle?: AreaDesempenoItem;
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
  areaDesempenoId?: number;
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

export interface AdvertenciaFila {
  fila: number;
  codigo?: string;
  estudiante?: string;
  motivo: string;
  accionTomada: string;
}

export interface ErrorFila {
  fila: number;
  campo: string;
  mensaje: string;
}

export interface ImportacionDocentesResumen {
  totalFilas: number;
  docentesCreados: number;
  docentesActualizados: number;
  advertencias: AdvertenciaFila[];
  errores: ErrorFila[];
  tiempoMs: number;
}
