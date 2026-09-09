export interface AuditoriaRegistro {
  id: number;
  usuarioId?: number;
  usuarioUsername: string;
  usuarioNombreCompleto: string;
  usuarioRol: string;
  accion: string;
  entidad: string;
  entidadId: string;
  datosAnteriores?: string;
  datosNuevos?: string;
  ipOrigen?: string;
  createdAt: string;
}

export interface FiltrosAuditoria {
  entidad?: string;
  accion?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  busqueda?: string;
  page?: number;
  size?: number;
}
