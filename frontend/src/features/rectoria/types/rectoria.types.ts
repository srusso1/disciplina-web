export interface EstadoMetrica {
  estado: string;
  etiqueta: string;
  cantidad: number;
  porcentaje: number;
}

export interface LugarMetrica {
  lugarId: number;
  nombreLugar: string;
  cantidad: number;
  porcentaje: number;
}

export interface GradoMetrica {
  grado: string;
  cantidad: number;
  porcentaje: number;
}

export interface FranjaHoraria {
  franja: string;
  cantidad: number;
  porcentaje: number;
}

export interface TendenciaMensual {
  mes: string;
  mesNumero: number;
  anio: number;
  cantidad: number;
}

export interface MetricasDashboardRectoria {
  totalIncidentes: number;
  tipoI: number;
  tipoII: number;
  tipoIII: number;
  totalEstudiantesInvolucrados: number;
  totalEstudiantesReincidentes: number;
  tasaResolucion: number;
  casosCerrados: number;
  casosEnTramite: number;
  distribucionEstados: EstadoMetrica[];
  focosCriticosLugares: LugarMetrica[];
  distribucionPorGrado: GradoMetrica[];
  franjasHorariasCriticas: FranjaHoraria[];
  tendenciaMensual: TendenciaMensual[];
}
