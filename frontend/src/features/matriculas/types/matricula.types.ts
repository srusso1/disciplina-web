export interface AdvertenciaFila {
  fila: number;
  codigo: string;
  estudiante: string;
  motivo: string;
  accionTomada: string;
}

export interface ErrorFila {
  fila: number;
  codigo: string;
  motivo: string;
}

export interface ImportacionMatriculasResumen {
  totalFilasLeidas: number;
  estudiantesCreados: number;
  estudiantesActualizados: number;
  matriculasCreadas: number;
  matriculasActualizadas: number;
  anioLectivo: number;
  tiempoProcesamientoMs: number;
  advertencias: AdvertenciaFila[];
  errores: ErrorFila[];
}

export interface EstudianteMatricula {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  nombreAcudiente: string;
  telefonoAcudiente: string;
  grado: string;
  grupo: string;
  jornada: string;
  anioLectivo: number;
  estadoMatricula: string;
}