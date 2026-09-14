export type TipoNotificacion = 'CRITICA' | 'TERMINO_LEGAL' | 'SEGUIMIENTO' | 'INFORMATIVA';
export type SeveridadNotificacion = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface NotificacionItem {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: TipoNotificacion;
  severidad: SeveridadNotificacion;
  rutaEnlace?: string;
  leida: boolean;
  createdAt: string;
}

export interface ConteoNotificacionesDTO {
  noLeidas: number;
}
