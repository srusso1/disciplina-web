export type ClasificacionLey = 'TIPO_I' | 'TIPO_II' | 'TIPO_III';
export type GravedadInstitucional = 'LEVE' | 'GRAVE' | 'GRAVISIMA';
export type EstadoProceso = 'REPORTADO' | 'EN_INDAGACION' | 'CITACION_PADRES' | 'EN_INTERVENCION' | 'CERRADO';
export type RolEstudianteIncidente = 'AGRESOR_PRINCIPAL' | 'PARTICIPE' | 'VICTIMA' | 'TESTIGO';

export interface DocenteCatalogo {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  areaDesempeno: string;
}

export interface LugarCatalogo {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CatalogoFalta {
  id: number;
  codigo: string;
  clasificacionLey: ClasificacionLey;
  gravedadInstitucional: GravedadInstitucional;
  descripcion: string;
  activo: boolean;
}

export interface InvolucradoRequest {
  estudianteId: number;
  catalogoFaltaId?: number;
  rolEstudiante: RolEstudianteIncidente;
  descripcionIndividual?: string;
}

export interface RegistrarIncidenteData {
  docenteReportaId: number;
  lugarId: number;
  fechaIncidente: string; // YYYY-MM-DD
  horaIncidente: string;  // HH:mm
  descripcionHechos: string;
  involucrados: InvolucradoRequest[];
}

export interface InvolucradoResponse {
  id: number;
  estudianteId: number;
  documento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  gradoMomento: string;
  grupoMomento: string;
  rolEstudiante: RolEstudianteIncidente;
  falta?: CatalogoFalta;
  descripcionIndividual?: string;
  descargo?: string;
  compromisos?: string;
  tieneDescargo: boolean;
  tieneCompromisos: boolean;
}

export interface Incidente {
  id: number;
  docenteReporta: DocenteCatalogo;
  lugar: LugarCatalogo;
  usuarioRegistro: string;
  fechaIncidente: string;
  horaIncidente: string;
  descripcionHechos: string;
  estadoProceso: EstadoProceso;
  createdAt: string;
  updatedAt: string;
  involucrados: InvolucradoResponse[];
}

export interface ActualizarEstadoData {
  nuevoEstado: EstadoProceso;
  observaciones?: string;
}

export interface ActualizarDescargoData {
  descargo: string;
  compromisos: string;
}

export interface EstadisticasIncidentes {
  totalIncidentes: number;
  tipoI: number;
  tipoII: number;
  tipoIII: number;
  enSeguimiento: number;
  cerrados: number;
}

export interface PaginaIncidentes {
  contenido: Incidente[];
  totalElementos: number;
  totalPaginas: number;
  tamanoPagina: number;
  pagina: number;
  primera: boolean;
  ultima: boolean;
}

export interface EstudianteIdentificadoIA {
  nombreMencionado?: string;
  estudianteId?: number | null;
  documento?: string | null;
  nombreCompleto?: string | null;
  gradoMomento?: string | null;
  grupoMomento?: string | null;
  rolSugerido: RolEstudianteIncidente;
  catalogoFaltaId?: number | null;
  faltaCodigo?: string | null;
  justificacionRol?: string | null;
}

export interface NarrativaProcesada {
  hechosEstandarizados: string;
  lugarSugeridoId?: number | null;
  lugarNombre?: string | null;
  docenteReportaId?: number | null;
  docenteReportaNombre?: string | null;
  clasificacionLeySugerida?: ClasificacionLey | null;
  fechaSugerida?: string | null;
  horaSugerida?: string | null;
  estudiantes: EstudianteIdentificadoIA[];
  asistidoPorIa: boolean;
  mensajeAsistente?: string;
}

export interface ProcesarNarrativaData {
  relato: string;
  anioLectivo?: number;
}

export interface PropuestaIntervencionIA {
  estudianteId: number;
  estudianteNombre: string;
  incidenteOrigenId?: number;
  diagnosticoSituacional: string;
  recomendacionesIa: string;
  accionesAcordadasSugeridas: string;
  compromisoPadresSugerido: string;
  semanasSeguimientoSugeridas: number;
  advertenciaGobierno: string;
  asistidoPorIa: boolean;
}

export interface GenerarPropuestaIntervencionData {
  estudianteId: number;
  incidenteOrigenId?: number;
}

