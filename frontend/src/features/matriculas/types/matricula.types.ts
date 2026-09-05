import type { EstadoProceso, RolEstudianteIncidente, CatalogoFalta } from '../../incidentes/types/incidente.types';

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

export interface ActualizarEstudianteData {
  documento: string;
  nombres: string;
  apellidos: string;
  nombreAcudiente: string;
  telefonoAcudiente: string;
  grado: string;
  grupo: string;
  jornada?: string;
  estadoMatricula?: string;
  anioLectivo?: number;
}

export interface PaginaRespuesta<T> {
  contenido: T[];
  pagina: number;
  tamanoPagina: number;
  totalElementos: number;
  totalPaginas: number;
  primera: boolean;
  ultima: boolean;
}

export interface MatriculaHistorial {
  id: number;
  anioLectivo: number;
  grado: string;
  grupo: string;
  jornada: string;
  estadoMatricula: string;
}

export interface ResumenConvivencia {
  totalIncidentes: number;
  comoAgresorPrincipal: number;
  comoParticipe: number;
  comoVictima: number;
  comoTestigo: number;
  faltasTipoI: number;
  faltasTipoII: number;
  faltasTipoIII: number;
  reincidente: boolean;
}

export interface IncidenteHistorialEstudiante {
  incidenteId: number;
  fechaIncidente: string;
  horaIncidente?: string;
  lugarNombre: string;
  docenteReportaNombre: string;
  estadoProceso: EstadoProceso;
  descripcionHechos: string;
  rolEstudiante: RolEstudianteIncidente;
  anioLectivoSnapshot: number;
  gradoMomento: string;
  grupoMomento: string;
  falta?: CatalogoFalta;
  descargoEstudiante?: string;
  compromisoIndividual?: string;
  createdAt: string;
}

export interface ExpedienteEstudiante {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  nombreAcudiente?: string;
  telefonoAcudiente?: string;
  emailAcudiente?: string;
  activo: boolean;
  matriculaActual?: MatriculaHistorial;
  historialMatriculas: MatriculaHistorial[];
  resumenConvivencia: ResumenConvivencia;
  historialIncidentes: IncidenteHistorialEstudiante[];
}