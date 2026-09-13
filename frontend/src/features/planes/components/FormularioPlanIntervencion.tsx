import React, { useState } from 'react';
import { EstadoPlanIntervencion } from '../types/planes.types';
import { Sparkles, Loader2, BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react';

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

  return (
    <div className="space-y-4">
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
            const desc = inc.descripcionHechos || inc.descripcion || 'Sin descripción adicional';
            return (
              <option key={inc.incidenteId} value={inc.incidenteId}>
                Caso #{inc.incidenteId} {inc.fechaIncidente ? `(${inc.fechaIncidente})` : ''} - {codigo ? `[${codigo}] ` : ''}
                {desc.length > 70 ? `${desc.substring(0, 70)}...` : desc}
              </option>
            );
          })}
        </select>
      </div>

      {/* Botón de Asistente IA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs text-amber-900 font-medium">
            ¿Deseas consultar sugerencias pedagógicas con Google Gemini para este caso?
          </span>
        </div>
        <button
          type="button"
          onClick={onGenerarIa}
          disabled={generandoIa || !incidenteSeleccionadoId}
          title={!incidenteSeleccionadoId ? 'Selecciona primero el incidente de origen' : undefined}
          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generandoIa ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{generandoIa ? 'Analizando...' : 'Generar Propuesta'}</span>
        </button>
      </div>

      {advertenciaIa && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
          {advertenciaIa}
        </div>
      )}

      {/* Diagnóstico Situacional */}
      <div>
        <label htmlFor="textarea-diagnostico-plan" className="block text-xs font-bold text-slate-700 mb-1">
          Diagnóstico Situacional / Causas Raíz <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="textarea-diagnostico-plan"
          rows={3}
          placeholder="Factores desencadenantes, historial de convivencia y estado socioemocional observado..."
          value={diagnostico}
          onChange={(e) => onCambiarDiagnostico(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 resize-y min-h-[80px]"
          required
        />
      </div>

      {/* Acciones Acordadas */}
      <div>
        <label htmlFor="textarea-acciones-plan" className="block text-xs font-bold text-slate-700 mb-1">
          Acciones Formativas y Restaurativas Acordadas <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="textarea-acciones-plan"
          rows={3}
          placeholder="Talleres, cartas de reparación, servicio pedagógico comunitario o acuerdos de aula..."
          value={accionesAcordadas}
          onChange={(e) => onCambiarAccionesAcordadas(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 resize-y min-h-[80px]"
          required
        />
      </div>

      {/* Compromiso de los Padres */}
      <div>
        <label htmlFor="textarea-compromiso-padres" className="block text-xs font-bold text-slate-700 mb-1">
          Compromiso de los Padres / Entorno Familiar
        </label>
        <textarea
          id="textarea-compromiso-padres"
          rows={2}
          placeholder="Pautas de crianza positiva, control de horarios, asistencia a escuela de padres..."
          value={compromisoPadres}
          onChange={(e) => onCambiarCompromisoPadres(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 resize-y"
        />
      </div>

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
            Fecha Próximo Seguimiento
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
