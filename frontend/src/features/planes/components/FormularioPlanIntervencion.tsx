import React, { useState } from 'react';
import { EstadoPlanIntervencion } from '../types/planes.types';
import { Sparkles, Loader2, BrainCircuit, ChevronDown, ChevronUp, FileText, ShieldAlert } from 'lucide-react';

interface EditableSectionProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  accent?: 'blue' | 'amber' | 'slate';
}

const renderPlanText = (value: string) => {
  const lines = value.split(/\n|(?=\d+\.\s)/).map((line) => line.trim()).filter(Boolean);
  const hasNumberedItems = lines.filter((line) => /^\d+\.\s/.test(line)).length >= 2;

  if (!hasNumberedItems) {
    return <p className="text-sm text-slate-700 leading-6 whitespace-pre-wrap">{value}</p>;
  }

  return (
    <ol className="space-y-2.5">
      {lines.map((line, index) => {
        const item = line.replace(/^\d+\.\s*/, '');
        return (
          <li key={`${item}-${index}`} className="flex gap-3 text-sm text-slate-700 leading-6">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{index + 1}</span>
            <span>{item}</span>
          </li>
        );
      })}
    </ol>
  );
};

const EditableSection: React.FC<EditableSectionProps> = ({ title, value, onChange, placeholder, required, accent = 'blue' }) => {
  const [editando, setEditando] = useState(false);
  const accentClasses = accent === 'amber' ? 'border-amber-200 bg-amber-50/30' : accent === 'slate' ? 'border-slate-200 bg-slate-50/40' : 'border-indigo-200 bg-indigo-50/20';

  return (
    <section className={`rounded-2xl border p-4 space-y-3 ${accentClasses}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title} {required && <span className="text-rose-500">*</span>}</h3>
          <span className="text-[11px] font-medium text-indigo-600">Sugerencia IA Â· Editable</span>
        </div>
        <button type="button" onClick={() => setEditando((prev) => !prev)} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
          {editando ? 'Ver propuesta' : 'Editar'}
        </button>
      </div>
      {editando ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={6} className="w-full rounded-xl border border-indigo-200 bg-white p-3 text-sm leading-6 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-y" required={required} />
      ) : (
        <div className="rounded-xl border border-white bg-white/80 p-3.5">{value ? renderPlanText(value) : <p className="text-sm italic text-slate-400">AÃºn no hay contenido. GenerÃ¡ una propuesta o escribila manualmente.</p>}</div>
      )}
    </section>
  );
};

export interface IncidenteOpcionPlan {
  incidenteId: number;
  descripcion?: string;
  descripcionHechos?: string;
  faltaCodigo?: string;
  falta?: {
    codigo?: string;
    descripcion?: string;
  };
  fechaIncidente?: string;
}

export interface FormularioPlanIntervencionProps {
  incidentes: IncidenteOpcionPlan[];
  incidenteSeleccionadoId: number | null;
  onSeleccionarIncidente: (id: number | null) => void;
  diagnostico: string;
  onCambiarDiagnostico: (valor: string) => void;
  accionesAcordadas: string;
  onCambiarAccionesAcordadas: (valor: string) => void;
  compromisoPadres: string;
  onCambiarCompromisoPadres: (valor: string) => void;
  recomendacionesIa: string;
  onCambiarRecomendacionesIa: (valor: string) => void;
  fechaProximoSeguimiento: string;
  onCambiarFechaProximoSeguimiento: (valor: string) => void;
  estado?: EstadoPlanIntervencion;
  onCambiarEstado?: (estado: EstadoPlanIntervencion) => void;
  mostrarSelectorEstado?: boolean;
  generandoIa: boolean;
  advertenciaIa: string | null;
  onGenerarIa: () => void;
}

export const FormularioPlanIntervencion: React.FC<FormularioPlanIntervencionProps> = ({
  incidentes,
  incidenteSeleccionadoId,
  onSeleccionarIncidente,
  diagnostico,
  onCambiarDiagnostico,
  accionesAcordadas,
  onCambiarAccionesAcordadas,
  compromisoPadres,
  onCambiarCompromisoPadres,
  recomendacionesIa,
  onCambiarRecomendacionesIa,
  fechaProximoSeguimiento,
  onCambiarFechaProximoSeguimiento,
  estado = 'EN_SEGUIMIENTO',
  onCambiarEstado,
  mostrarSelectorEstado = false,
  generandoIa,
  advertenciaIa,
  onGenerarIa,
}) => {
  const [mostrarRecomendacionesIa, setMostrarRecomendacionesIa] = useState<boolean>(true);
  const incidenteSeleccionado = incidentes.find((incidente) => incidente.incidenteId === incidenteSeleccionadoId);
  const codigoFalta = incidenteSeleccionado?.faltaCodigo || incidenteSeleccionado?.falta?.codigo;
  const descripcionHechos = incidenteSeleccionado?.descripcionHechos || incidenteSeleccionado?.descripcion;

  return (
    <div className="space-y-4">
      {incidenteSeleccionado && (
        <section className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-700" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-sky-800">Contexto del caso</p>
              <p className="text-xs text-sky-700">La propuesta se construirÃ¡ sobre este incidente.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-white/80 border border-sky-100 p-3"><span className="block text-[10px] font-bold uppercase text-slate-400">Caso</span><span className="font-bold text-slate-800">#{incidenteSeleccionado.incidenteId}</span><span className="block text-slate-500 mt-0.5">{incidenteSeleccionado.fechaIncidente || 'Fecha no disponible'}</span></div>
            <div className="rounded-xl bg-white/80 border border-sky-100 p-3"><span className="block text-[10px] font-bold uppercase text-slate-400">Falta tipificada</span><span className="font-bold text-trujillo-navy">{codigoFalta || 'Sin cÃ³digo asociado'}</span></div>
            <div className="rounded-xl bg-white/80 border border-sky-100 p-3"><span className="block text-[10px] font-bold uppercase text-slate-400">Hechos registrados</span><span className="block text-slate-700 line-clamp-2">{descripcionHechos || 'Sin descripciÃ³n adicional'}</span></div>
          </div>
        </section>
      )}

      {/* Selector de Incidente de Origen */}
      <div className="space-y-1.5">
        <label htmlFor="select-incidente-origen-plan" className="block text-xs font-bold text-slate-700">
          Incidente Convivencial Asociado (Origen del Plan) <span className="text-rose-500">*</span>
        </label>
        <select
          id="select-incidente-origen-plan"
          value={incidenteSeleccionadoId ?? ''}
          onChange={(e) => onSeleccionarIncidente(e.target.value ? Number(e.target.value) : null)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
          required
        >
          <option value="">-- Seleccione el caso convivencial ({incidentes.length} disponibles) --</option>
          {incidentes.map((inc) => {
            const codigo = inc.faltaCodigo || inc.falta?.codigo;
            const desc = inc.descripcionHechos || inc.descripcion || 'Sin descripciÃ³n adicional';
            return (
              <option key={inc.incidenteId} value={inc.incidenteId}>
                Caso #{inc.incidenteId} {inc.fechaIncidente ? `(${inc.fechaIncidente})` : ''} - {codigo ? `[${codigo}] ` : ''}
                {desc.length > 70 ? `${desc.substring(0, 70)}...` : desc}
              </option>
            );
          })}
        </select>
      </div>

      {/* BotÃ³n de Asistente IA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-indigo-50 border border-indigo-200 gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs text-indigo-900 font-semibold">
            Â¿Deseas consultar sugerencias pedagÃ³gicas con Google Gemini para este caso?
          </span>
        </div>
        <button
          type="button"
          onClick={onGenerarIa}
          disabled={generandoIa || !incidenteSeleccionadoId}
          title={!incidenteSeleccionadoId ? 'Selecciona primero el incidente de origen' : undefined}
          className="px-3.5 py-2 rounded-lg bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generandoIa ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{generandoIa ? 'Analizando...' : 'Generar Propuesta'}</span>
        </button>
      </div>

      {advertenciaIa && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          {advertenciaIa}
        </div>
      )}

            <div className="flex items-center gap-2 pt-1">
        <span className="h-px bg-slate-200 flex-1" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Revisá y ajustá el plan</span>
        <span className="h-px bg-slate-200 flex-1" />
      </div>

      <EditableSection title="Diagnóstico situacional y causas raíz" value={diagnostico} onChange={onCambiarDiagnostico} placeholder="Factores desencadenantes, historial de convivencia y estado socioemocional observado..." required />
      <EditableSection title="Acciones formativas y restaurativas acordadas" value={accionesAcordadas} onChange={onCambiarAccionesAcordadas} placeholder="Talleres, acciones reparadoras o acuerdos de aula..." required />
      <EditableSection title="Compromiso de los padres y entorno familiar" value={compromisoPadres} onChange={onCambiarCompromisoPadres} placeholder="Pautas de acompañamiento, supervisión y comunicación familiar..." accent="slate" />

      {/* Recomendaciones Asistente IA */}
      {recomendacionesIa && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
          <div
            onClick={() => setMostrarRecomendacionesIa((prev) => !prev)}
            className="text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5 text-amber-800">
              <BrainCircuit className="w-4 h-4 text-amber-600" />
              <span>Recomendaciones Orientadoras de la IA</span>
            </div>
            {mostrarRecomendacionesIa ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
          {mostrarRecomendacionesIa && (
            <textarea
              rows={3}
              value={recomendacionesIa}
              onChange={(e) => onCambiarRecomendacionesIa(e.target.value)}
              className="w-full text-xs text-slate-600 leading-normal italic bg-white border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-y"
            />
          )}
        </div>
      )}

      {/* Fechas y Estados */}
      <div className={`grid grid-cols-1 ${mostrarSelectorEstado ? 'sm:grid-cols-2' : ''} gap-3 pt-1`}>
        <div>
          <label htmlFor="input-fecha-seguimiento" className="block text-xs font-bold text-slate-700 mb-1">
            Fecha PrÃ³ximo Seguimiento
          </label>
          <input
            id="input-fecha-seguimiento"
            type="date"
            value={fechaProximoSeguimiento}
            onChange={(e) => onCambiarFechaProximoSeguimiento(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
          />
        </div>

        {mostrarSelectorEstado && onCambiarEstado && (
          <div>
            <label htmlFor="select-estado-nuevo-plan" className="block text-xs font-bold text-slate-700 mb-1">
              Estado Inicial del Plan
            </label>
            <select
              id="select-estado-nuevo-plan"
              value={estado}
              onChange={(e) => onCambiarEstado(e.target.value as EstadoPlanIntervencion)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
            >
              <option value="EN_SEGUIMIENTO">En Seguimiento</option>
              <option value="BORRADOR">Borrador</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
