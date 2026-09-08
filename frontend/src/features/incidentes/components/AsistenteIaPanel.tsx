import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { incidentesApi } from '../api/incidentesApi';
import { NarrativaProcesada } from '../types/incidente.types';

interface AsistenteIaPanelProps {
  onAplicar: (resultado: NarrativaProcesada) => void;
  anioLectivo?: number;
}

export const AsistenteIaPanel: React.FC<AsistenteIaPanelProps> = ({
  onAplicar,
  anioLectivo = new Date().getFullYear(),
}) => {
  const [panelAbierto, setPanelAbierto] = useState<boolean>(false);
  const [relatoInformal, setRelatoInformal] = useState<string>('');
  const [procesando, setProcesando] = useState<boolean>(false);
  const [resultado, setResultado] = useState<NarrativaProcesada | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aplicado, setAplicado] = useState<boolean>(false);

  const handleProcesar = async () => {
    if (!relatoInformal.trim()) return;

    setProcesando(true);
    setError(null);
    setAplicado(false);

    try {
      const res = await incidentesApi.procesarNarrativa({
        relato: relatoInformal.trim(),
        anioLectivo,
      });
      setResultado(res);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'No fue posible procesar el relato con el asistente IA.');
    } finally {
      setProcesando(false);
    }
  };

  const handleAplicar = () => {
    if (!resultado) return;
    onAplicar(resultado);
    setAplicado(true);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-sm transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-trujillo-navy text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-trujillo-sky" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Asistente Jurídico Inteligente</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-trujillo-ice text-trujillo-navy border border-sky-200">
                Google Gemini
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Redactá un relato informal del hecho y la IA inferirá la tipificación según la Ley 1620 y el Debido Proceso.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPanelAbierto((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-trujillo-navy hover:bg-white border border-slate-300 transition active:scale-[0.97] cursor-pointer shrink-0"
        >
          <span>{panelAbierto ? 'Ocultar Asistente' : 'Abrir Asistente'}</span>
          {panelAbierto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {panelAbierto && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-150">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Relato Informal o Minuta del Docente
            </label>
            <textarea
              rows={3}
              value={relatoInformal}
              onChange={(e) => {
                setRelatoInformal(e.target.value);
                setAplicado(false);
              }}
              placeholder="Ej: En las canchas deportivas durante el recreo, el estudiante Juan Acero empujó a Stiven Delgado tras una discusión..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-trujillo-navy focus:border-trujillo-navy transition placeholder:text-slate-400 font-normal leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <span className="text-[11px] text-slate-500 italic">
              Human-in-the-Loop: los datos estructurados son sugerencias editables antes de registrar.
            </span>

            <button
              type="button"
              onClick={handleProcesar}
              disabled={procesando || !relatoInformal.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-trujillo-navy hover:bg-trujillo-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs hover:shadow transition active:scale-[0.97] cursor-pointer"
            >
              {procesando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analizando con IA...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Estructurar con IA</span>
                </>
              )}
            </button>
          </div>

          {resultado && (
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      resultado.asistidoPorIa
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {resultado.asistidoPorIa ? 'Procesado con Google Gemini' : 'Modo Heurístico Institucional'}
                  </span>
                  {resultado.clasificacionLeySugerida && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                      Ley 1620: {resultado.clasificacionLeySugerida.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAplicar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-300 rounded-lg shadow-2xs hover:shadow-xs transition active:scale-[0.97] cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{aplicado ? '¡Aplicado al Formulario!' : 'Aplicar al Formulario'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Docente Detectado */}
                <div className="p-2 rounded-lg bg-white border border-indigo-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Docente Detectado</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        resultado.docenteReportaId
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : resultado.docenteReportaNombre
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {resultado.docenteReportaId
                        ? 'En Nómina'
                        : resultado.docenteReportaNombre
                        ? 'Sin Vincular'
                        : 'No Identificado'}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700 truncate block">
                    {resultado.docenteReportaNombre || 'No especificado en relato'}
                  </span>
                </div>

                {/* Lugar Detectado */}
                <div className="p-2 rounded-lg bg-white border border-indigo-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Lugar Detectado</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        resultado.lugarSugeridoId
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : resultado.lugarNombre
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {resultado.lugarSugeridoId
                        ? 'Catálogo OK'
                        : resultado.lugarNombre
                        ? 'Sin Vincular'
                        : 'No Identificado'}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700 truncate block">
                    {resultado.lugarNombre || 'No especificado en relato'}
                  </span>
                </div>

                {/* Involucrados */}
                <div className="p-2 rounded-lg bg-white border border-indigo-100 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Involucrados Detectados</span>
                  <span className="font-semibold text-slate-700 block">
                    {resultado.estudiantes?.length || 0} estudiante(s)
                  </span>
                </div>
              </div>

              {resultado.estudiantes && resultado.estudiantes.length > 0 && (
                <div className="p-2.5 rounded-lg bg-white border border-indigo-100 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Identificación de Alumnos en Matrícula Institucional
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {resultado.estudiantes.map((est, eIdx) => {
                      const matriculado = Boolean(est.estudianteId);
                      return (
                        <div
                          key={eIdx}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                            matriculado
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                              : 'bg-amber-50/70 border-amber-200 text-amber-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {matriculado ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <div className="truncate">
                              <p className="font-bold truncate">{est.nombreCompleto || est.nombreMencionado}</p>
                              <p className="text-[10px] opacity-80 truncate">
                                Rol: {est.rolSugerido} • {matriculado ? `Grado ${est.gradoMomento || ''}-${est.grupoMomento || ''}` : 'No encontrado en censo'}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                              matriculado
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {matriculado ? 'Matriculado' : 'Sin Matrícula'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-white border border-indigo-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Redacción Formal Estructurada
                </span>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{resultado.hechosEstandarizados}"
                </p>
              </div>

              {resultado.mensajeAsistente && (
                <p className="text-[11px] text-indigo-700 leading-normal">
                  {resultado.mensajeAsistente}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
