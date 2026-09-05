export type EstadoPlanIntervencion = 'BORRADOR' | 'EN_SEGUIMIENTO' | 'CUMPLIDO' | 'INCUMPLIDO';

export interface SeguimientoCasoResponse {
  id: number;
  planId: number;
  usuarioId: number;
  usuarioNombre: string;
  usuarioRol: string;
  observacion: string;
  fechaRegistro: string;
}

export interface PlanIntervencionResponse {
  id: number;
  estudianteId: number;
  estudianteDocumento: string;
  estudianteNombre: string;
  incidenteOrigenId?: number;
  orientadorId?: number;
  orientadorNombre?: string;
  diagnosticoSituacional: string;
  recomendacionesIa?: string;
  accionesAcordadas: string;
  compromisoPadres?: string;
  fechaProximoSeguimiento?: string;
  estado: EstadoPlanIntervencion;
  seguimientos: SeguimientoCasoResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CrearPlanIntervencionRequest {
  estudianteId: number;
  incidenteOrigenId?: number;
  diagnosticoSituacional: string;
  recomendacionesIa?: string;
  accionesAcordadas: string;
  compromisoPadres?: string;
  fechaProximoSeguimiento?: string;
  estado?: EstadoPlanIntervencion;
}

export interface ActualizarPlanIntervencionRequest {
  diagnosticoSituacional?: string;
  recomendacionesIa?: string;
  accionesAcordadas?: string;
  compromisoPadres?: string;
  fechaProximoSeguimiento?: string;
  estado?: EstadoPlanIntervencion;
}

export interface RegistrarSeguimientoRequest {
  observacion: string;
  nuevoEstadoPlan?: EstadoPlanIntervencion;
  nuevaFechaProximoSeguimiento?: string;
}

export interface PropuestaIaResponse {
  estudianteId: number;
  estudianteNombre: string;
  incidenteOrigenId?: number;
  diagnosticoSituacional: string;
  recomendacionesIa: string;
  accionesAcordadasSugeridas: string;
  compromisoPadresSugerido: string;
  semanasSeguimientoSugeridas: number;
  asistidoPorIa: boolean;
  advertenciaGobierno: string;
}

