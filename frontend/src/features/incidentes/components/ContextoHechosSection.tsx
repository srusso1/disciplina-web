import React from 'react';
import { UserCheck, MapPin, Calendar, Clock, FileText, AlertTriangle } from 'lucide-react';
import { DocenteCatalogo, LugarCatalogo } from '../types/incidente.types';

interface ContextoHechosSectionProps {
  docentes: DocenteCatalogo[];
  lugares: LugarCatalogo[];
  cargandoCatalogos: boolean;
  docenteReportaId: number | '';
  setDocenteReportaId: (id: number | '') => void;
  lugarId: number | '';
  setLugarId: (id: number | '') => void;
  fechaIncidente: string;
  setFechaIncidente: (fecha: string) => void;
  horaIncidente: string;
  setHoraIncidente: (hora: string) => void;
  descripcionHechos: string;
  setDescripcionHechos: (hechos: string) => void;
  sugerenciaDocentePendiente?: string | null;
  alertaDocenteNoMencionado?: boolean;
  onLimpiarAlertaDocente?: () => void;
  sugerenciaLugarPendiente?: string | null;
  alertaLugarNoMencionado?: boolean;
  onLimpiarAlertaLugar?: () => void;
}

const getTodayLocalDate = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const ContextoHechosSection: React.FC<ContextoHechosSectionProps> = ({
  docentes,
  lugares,
  cargandoCatalogos,
  docenteReportaId,
  setDocenteReportaId,
  lugarId,
  setLugarId,
  fechaIncidente,
  setFechaIncidente,
  horaIncidente,
  setHoraIncidente,
  descripcionHechos,
  setDescripcionHechos,
  sugerenciaDocentePendiente,
  alertaDocenteNoMencionado,
  onLimpiarAlertaDocente,
  sugerenciaLugarPendiente,
  alertaLugarNoMencionado,
  onLimpiarAlertaLugar,
}) => {
  const tieneAlertaDocente = !docenteReportaId && (Boolean(sugerenciaDocentePendiente) || Boolean(alertaDocenteNoMencionado));
  const tieneAlertaLugar = !lugarId && (Boolean(sugerenciaLugarPendiente) || Boolean(alertaLugarNoMencionado));

  return (
    <>
      {/* Bloque 1: Contexto Institucional del Hecho */}
      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-trujillo-sky" />
            1. Contexto Institucional del Suceso
          </h3>
          <span className="text-[11px] text-slate-400">Campos obligatorios marcados con *</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Docente Reporta */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              Docente o Funcionario Informante *
            </label>

            {/* Alerta de sugerencia no encontrada o no detectada */}
            {sugerenciaDocentePendiente && !docenteReportaId && (
              <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-900 flex items-center gap-1.5 flex-wrap">
                    <span>Docente pendiente de vincular:</span>
                    <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">
                      "{sugerenciaDocentePendiente}"
                    </span>
                  </p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    La IA identificó este nombre en el relato, pero <strong>no coincide con la nómina de docentes activos</strong>. Por favor seleccione al funcionario correspondiente de la lista institucional.
                  </p>
                </div>
              </div>
            )}

            {alertaDocenteNoMencionado && !docenteReportaId && !sugerenciaDocentePendiente && (
              <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-900">
                    Docente informante no identificado en el relato
                  </p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    El texto analizado no especifica qué docente o funcionario reportó la situación. Seleccione al informante en el menú desplegable para continuar.
                  </p>
                </div>
              </div>
            )}

            <select
              value={docenteReportaId}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : '';
                setDocenteReportaId(val);
                if (onLimpiarAlertaDocente) onLimpiarAlertaDocente();
              }}
              disabled={cargandoCatalogos}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl focus:ring-2 transition font-medium text-slate-800 ${
                tieneAlertaDocente
                  ? 'border-amber-300 ring-1 ring-amber-200 focus:ring-amber-400 focus:border-amber-400'
                  : 'border-slate-300 focus:ring-trujillo-sky focus:border-trujillo-sky'
              }`}
              required
            >
              <option value="">Seleccione docente informante...</option>
              {docentes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombreCompleto} — {d.areaDesempeno}
                </option>
              ))}
            </select>
          </div>

          {/* Lugar */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Lugar Institucional del Hecho *
            </label>

            {/* Alerta de lugar sugerido no encontrado o no detectado */}
            {sugerenciaLugarPendiente && !lugarId && (
              <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-900 flex items-center gap-1.5 flex-wrap">
                    <span>Lugar institucional pendiente de vincular:</span>
                    <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">
                      "{sugerenciaLugarPendiente}"
                    </span>
                  </p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    La IA detectó este lugar en el relato, pero <strong>no coincide con los espacios registrados</strong> en el catálogo. Por favor seleccione la ubicación oficial del hecho.
                  </p>
                </div>
              </div>
            )}

            {alertaLugarNoMencionado && !lugarId && !sugerenciaLugarPendiente && (
              <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-900">
                    Lugar del hecho no identificado en el relato
                  </p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    El texto analizado no especifica el lugar donde ocurrió el incidente. Por favor seleccione el espacio institucional correspondiente.
                  </p>
                </div>
              </div>
            )}

            <select
              value={lugarId}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : '';
                setLugarId(val);
                if (onLimpiarAlertaLugar) onLimpiarAlertaLugar();
              }}
              disabled={cargandoCatalogos}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl focus:ring-2 transition font-medium text-slate-800 ${
                tieneAlertaLugar
                  ? 'border-amber-300 ring-1 ring-amber-200 focus:ring-amber-400 focus:border-amber-400'
                  : 'border-slate-300 focus:ring-trujillo-sky focus:border-trujillo-sky'
              }`}
              required
            >
              <option value="">Seleccione lugar institucional...</option>
              {lugares.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre} {l.descripcion ? `(${l.descripcion})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Fecha del Hecho *
            </label>
            <input
              type="date"
              max={getTodayLocalDate()}
              value={fechaIncidente}
              onChange={(e) => setFechaIncidente(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition text-slate-800"
              required
            >
            </input>
          </div>

          {/* Hora */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Hora Aproximada *
            </label>
            <input
              type="time"
              value={horaIncidente}
              onChange={(e) => setHoraIncidente(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition text-slate-800"
              required
            />
          </div>
        </div>
      </div>

      {/* Bloque 2: Descripción Fáctica General */}
      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-trujillo-sky" />
            2. Descripción Fáctica General del Incidente *
          </label>
          <span className="text-[11px] text-slate-400">
            {descripcionHechos.length} caracteres (mínimo 10)
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Relate de forma clara, objetiva, cronológica e imparcial los hechos acontecidos. Evite juicios de valor subjetivos.
        </p>
        <textarea
          rows={4}
          value={descripcionHechos}
          onChange={(e) => setDescripcionHechos(e.target.value)}
          placeholder="Escriba la descripción fáctica formal de los hechos ocurridos..."
          className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition placeholder:text-slate-400 leading-relaxed text-slate-800"
          required
        />
      </div>
    </>
  );
};
