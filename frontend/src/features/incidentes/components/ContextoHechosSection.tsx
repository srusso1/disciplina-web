import React from 'react';
import { UserCheck, MapPin, Calendar, Clock, FileText } from 'lucide-react';
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
}) => {
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
            <select
              value={docenteReportaId}
              onChange={(e) => setDocenteReportaId(e.target.value ? Number(e.target.value) : '')}
              disabled={cargandoCatalogos}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition font-medium text-slate-800"
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
            <select
              value={lugarId}
              onChange={(e) => setLugarId(e.target.value ? Number(e.target.value) : '')}
              disabled={cargandoCatalogos}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition font-medium text-slate-800"
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

      {/* Bloque 3: Descripción Fáctica Oficial */}
      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-trujillo-sky" />
            3. Descripción Fáctica del Incidente *
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
