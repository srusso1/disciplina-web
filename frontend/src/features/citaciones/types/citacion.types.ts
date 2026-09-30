export type EstadoCitacion = 'PROGRAMADA' | 'CONFIRMADA' | 'ASISTIO' | 'NO_ASISTIO' | 'CANCELADA';
export type WaEstadoEnvio = 'NO_ENVIADO' | 'ENVIADO' | 'ENTREGADO' | 'LEIDO' | 'FALLIDO';

export interface CrearCitacionData {
  incidenteId: number;
  estudianteId: number;
  lugarCitaId: number;
  fechaCita: string;
  horaCita: string;
  asunto: string;
  observaciones?: string;
  reprogramacionDeId?: number;
}

export interface CitacionResponse {
  id: number;
  incidenteId: number;
  estudianteId: number;
  estudianteNombreCompleto: string;
  nombreAcudiente: string;
  telefonoAcudiente: string;
  lugarCita: { id: number; nombre: string };
  fechaCita: string;
  horaCita: string;
  asunto: string;
  observaciones?: string;
  estado: EstadoCitacion;
  waEstadoEnvio: WaEstadoEnvio;
  waErrorDetalle?: string;
  waEnviadoAt?: string;
  waEntregadoAt?: string;
  waLeidoAt?: string;
  reprogramacionDeId?: number;
  creadoPor: string;
  createdAt: string;
  updatedAt?: string;
}

export interface HistorialEstadoCitacion {
  id: number;
  estadoAnterior?: EstadoCitacion;
  estadoNuevo: EstadoCitacion;
  accion: string;
  motivo?: string;
  usuario?: string;
  fechaCambio: string;
}
