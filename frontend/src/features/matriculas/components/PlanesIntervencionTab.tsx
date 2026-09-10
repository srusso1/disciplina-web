import React, { useState, useEffect } from 'react';
import {
  PlanIntervencionResponse,
  CrearPlanIntervencionRequest,
  RegistrarSeguimientoRequest,
  EstadoPlanIntervencion,
} from '../../planes/types/planes.types';
import { planesApi } from '../../planes/api/planesApi';
import { extraerMensajeError } from '../../../core/api/apiClient';
import {
  HeartHandshake,
  Plus,
  Sparkles,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileEdit,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

interface PlanesIntervencionTabProps {
  estudianteId: number;
  estudianteNombre: string;
  incidentes: Array<{
    incidenteId: number;
    descripcion: string;
    faltaCodigo?: string;
    fechaIncidente?: string;
  }>;
}

export const PlanesIntervencionTab: React.FC<PlanesIntervencionTabProps> = ({
  estudianteId,
  estudianteNombre,
  incidentes,
}) => {
  const [planes, setPlanes] = useState<PlanIntervencionResponse[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario para crear nuevo plan
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState<boolean>(false);
  const [guardandoPlan, setGuardandoPlan] = useState<boolean>(false);
  const [generandoIa, setGenerandoIa] = useState<boolean>(false);
  const [advertenciaIa, setAdvertenciaIa] = useState<string | null>(null);

  // Campos del nuevo plan
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<string>('');
  const [diagnostico, setDiagnostico] = useState<string>('');
  const [recomendacionesIa, setRecomendacionesIa] = useState<string>('');
  const [accionesAcordadas, setAccionesAcordadas] = useState<string>('');
  const [compromisoPadres, setCompromisoPadres] = useState<string>('');
  const [fechaProximoSeguimiento, setFechaProximoSeguimiento] = useState<string>('');
  const [estadoNuevoPlan, setEstadoNuevoPlan] = useState<EstadoPlanIntervencion>('EN_SEGUIMIENTO');

  // Estado para registrar seguimiento de caso (CU-07)
  const [planIdSeguimiento, setPlanIdSeguimiento] = useState<number | null>(null);
  const [observacionSeguimiento, setObservacionSeguimiento] = useState<string>('');
  const [nuevoEstadoPlan, setNuevoEstadoPlan] = useState<EstadoPlanIntervencion>('EN_SEGUIMIENTO');
  const [nuevaFechaSeguimiento, setNuevaFechaSeguimiento] = useState<string>('');
  const [guardandoSeguimiento, setGuardandoSeguimiento] = useState<boolean>(false);

  // Control de acordeón de planes
  const [planExpandido, setPlanExpandido] = useState<number | null>(null);
  const [mensajeAlerta, setMensajeAlerta] = useState<{ tipo: 'error' | 'exito'; texto: string } | null>(null);

  const mostrarAlerta = (texto: string, tipo: 'error' | 'exito' = 'error') => {
    setMensajeAlerta({ tipo, texto });
  };

  const cargarPlanes = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await planesApi.listarPorEstudiante(estudianteId);
      setPlanes(data);
      if (data.length > 0 && planExpandido === null) {
        setPlanExpandido(data[0].id);
      }
    } catch (err) {
      console.error('Error al cargar planes de intervención:', err);
      setError(extraerMensajeError(err, 'No fue posible cargar los planes de intervención del estudiante.'));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, [estudianteId]);

  // CU-06: Generar propuesta asistida por IA (Gemini con fallback local)
  const handleGenerarIa = async () => {
    if (!incidenteSeleccionado) {
      mostrarAlerta('Debe seleccionar el incidente de origen para generar la propuesta con IA.');
      return;
    }
    setGenerandoIa(true);
    setAdvertenciaIa(null);
    try {
      const incId = parseInt(incidenteSeleccionado, 10);
      const propuesta = await planesApi.generarPropuestaIa(estudianteId, incId);

      setDiagnostico(propuesta.diagnosticoSituacional || '');
      setRecomendacionesIa(propuesta.recomendacionesIa || '');
      setAccionesAcordadas(propuesta.accionesAcordadasSugeridas || '');
      setCompromisoPadres(propuesta.compromisoPadresSugerido || '');

      if (propuesta.semanasSeguimientoSugeridas) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + propuesta.semanasSeguimientoSugeridas * 7);
        setFechaProximoSeguimiento(fecha.toISOString().split('T')[0]);
      }

      setAdvertenciaIa(propuesta.advertenciaGobierno || 'Propuesta estructurada por IA según antecedentes.');
    } catch (err) {
      console.error('Error al invocar asistencia IA:', err);
      mostrarAlerta(extraerMensajeError(err, 'No se pudo generar la propuesta asistida por IA.'));
    } finally {
      setGenerandoIa(false);
    }
  };

  // RF-06: Guardar nuevo plan
  const handleGuardarPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidenteSeleccionado) {
      mostrarAlerta('Debe seleccionar el incidente de convivencia que origina el plan.');
      return;
    }
    if (!diagnostico.trim() || !accionesAcordadas.trim()) {
      mostrarAlerta('El diagnóstico situacional y las acciones formativas son obligatorias.');
      return;
    }

    setGuardandoPlan(true);
    try {
      const payload: CrearPlanIntervencionRequest = {
        estudianteId,
        incidenteOrigenId: parseInt(incidenteSeleccionado, 10),
        diagnosticoSituacional: diagnostico.trim(),
        recomendacionesIa: recomendacionesIa.trim() || undefined,
        accionesAcordadas: accionesAcordadas.trim(),
        compromisoPadres: compromisoPadres.trim() || undefined,
        fechaProximoSeguimiento: fechaProximoSeguimiento || undefined,
        estado: estadoNuevoPlan,
      };

      const creado = await planesApi.crearPlan(payload);
      setPlanes((prev) => [creado, ...prev]);
      setPlanExpandido(creado.id);
      setMostrarFormNuevo(false);
      mostrarAlerta('Plan de intervención registrado exitosamente.', 'exito');

      // Limpiar formulario
      setDiagnostico('');
      setRecomendacionesIa('');
      setAccionesAcordadas('');
      setCompromisoPadres('');
      setFechaProximoSeguimiento('');
      setIncidenteSeleccionado('');
      setAdvertenciaIa(null);
    } catch (err) {
      console.error('Error al guardar plan:', err);
      mostrarAlerta(extraerMensajeError(err, 'Error al formular el plan de intervención.'));
    } finally {
      setGuardandoPlan(false);
    }
  };

  // CU-07: Registrar nota de seguimiento de caso
  const handleRegistrarSeguimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planIdSeguimiento || !observacionSeguimiento.trim()) {
      mostrarAlerta('La observación o nota pedagógica de seguimiento es obligatoria.');
      return;
    }

    setGuardandoSeguimiento(true);
    try {
      const payload: RegistrarSeguimientoRequest = {
        observacion: observacionSeguimiento.trim(),
        nuevoEstadoPlan,
        nuevaFechaProximoSeguimiento: nuevaFechaSeguimiento || undefined,
      };

      const planActualizado = await planesApi.registrarSeguimiento(planIdSeguimiento, payload);

      setPlanes((prev) =>
        prev.map((p) => (p.id === planIdSeguimiento ? planActualizado : p))
      );
      mostrarAlerta('Nota de seguimiento registrada con éxito.', 'exito');

      // Cerrar formulario de seguimiento
      setPlanIdSeguimiento(null);
      setObservacionSeguimiento('');
      setNuevaFechaSeguimiento('');
    } catch (err) {
      console.error('Error al registrar seguimiento:', err);
      mostrarAlerta(extraerMensajeError(err, 'No fue posible registrar la nota de seguimiento.'));
    } finally {
      setGuardandoSeguimiento(false);
    }
  };

  const getBadgeEstado = (estado: EstadoPlanIntervencion) => {
    switch (estado) {
      case 'EN_SEGUIMIENTO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CUMPLIDO':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'INCUMPLIDO':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'BORRADOR':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabecera de la sección */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-trujillo-sky" />
            <h3 className="text-sm font-bold text-slate-800">
              Planes de Intervención & Seguimiento Pedagógico
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ruta formativa, acuerdos restaurativos y trazabilidad de compromisos (Ley 1620 y Dec. 1965)
          </p>
        </div>

        {!mostrarFormNuevo && (
          incidentes.length > 0 ? (
            <button
              type="button"
              onClick={() => setMostrarFormNuevo(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-xs font-semibold shadow-2xs transition active:scale-[0.98] cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Formular Nuevo Plan</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-medium shrink-0 border border-slate-200">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Sin incidentes registrados</span>
            </div>
          )
        )}
      </div>

      {/* Banner si el estudiante no tiene incidentes */}
      {incidentes.length === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-amber-900">Estudiante sin incidentes convivenciales registrados</p>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              De acuerdo con el Manual de Convivencia y la Ley 1620, los planes de intervención pedagógica formativa requieren un incidente previo reportado en el sistema. Este alumno no registra faltas disciplinarias.
            </p>
          </div>
        </div>
      )}

      {/* Banner de Notificación / Alerta Accesible */}
      {mensajeAlerta && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-150 ${
            mensajeAlerta.tipo === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {mensajeAlerta.tipo === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{mensajeAlerta.texto}</span>
          </div>
          <button
            type="button"
            onClick={() => setMensajeAlerta(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Formulario de Creación de Plan (RF-06 & CU-06) */}
      {mostrarFormNuevo && (
        <form
          onSubmit={handleGuardarPlan}
          className="bg-white border-2 border-trujillo-navy/20 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-trujillo-navy" />
              <h4 className="text-sm font-bold text-slate-800">
                Formular Plan de Intervención Pedagógica: {estudianteNombre}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setMostrarFormNuevo(false);
                setAdvertenciaIa(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          {/* Selector de Incidente e Invocación IA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Incidente Convivencial Asociado <span className="text-rose-500">*</span>:
              </label>
              <select
                value={incidenteSeleccionado}
                onChange={(e) => setIncidenteSeleccionado(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
                required
              >
                <option value="">-- Seleccione el incidente de origen ({incidentes.length} disponibles) --</option>
                {incidentes.map((inc) => (
                  <option key={inc.incidenteId} value={inc.incidenteId}>
                    Caso #{inc.incidenteId} {inc.faltaCodigo ? `[Falta ${inc.faltaCodigo}]` : ''} -{' '}
                    {inc.descripcion?.substring(0, 60)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleGenerarIa}
                disabled={generandoIa || !incidenteSeleccionado}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                title={!incidenteSeleccionado ? 'Seleccione primero un incidente para orientar la IA' : 'Genera propuesta pedagógica estructurada analizando el caso'}
              >
                {generandoIa ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analizando caso con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-trujillo-sky" />
                    <span>Sugerir con Asistente IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Banner de Gobierno Human-in-the-Loop si se utilizó IA */}
          {advertenciaIa && (
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Propuesta preliminar asistida por IA:</p>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  {advertenciaIa} Valide, personalice y ajuste los compromisos antes de formalizar el plan.
                </p>
              </div>
            </div>
          )}

          {/* Campos del Plan */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diagnóstico Situacional / Causas Raíz: <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                rows={2}
                placeholder="Describa el contexto psicoformativo, dinámicas grupales o detonantes de la conducta observada..."
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Acciones Formativas y Tareas Restaurativas Acordadas: <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={accionesAcordadas}
                onChange={(e) => setAccionesAcordadas(e.target.value)}
                rows={2}
                placeholder="Medidas pedagógicas, talleres de autorregulación, acuerdos de aula, mediación escolar..."
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Compromiso de Acudientes / Entorno Familiar:
              </label>
              <textarea
                value={compromisoPadres}
                onChange={(e) => setCompromisoPadres(e.target.value)}
                rows={2}
                placeholder="Acompañamiento en casa, asistencia a citaciones, pautas de crianza positiva..."
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition resize-none"
              />
            </div>

            {recomendacionesIa && (
              <div>
                <label className="block text-xs font-semibold text-purple-800 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Recomendaciones Orientadoras de la IA:</span>
                </label>
                <textarea
                  value={recomendacionesIa}
                  onChange={(e) => setRecomendacionesIa(e.target.value)}
                  rows={2}
                  className="w-full text-xs rounded-xl border border-purple-200 p-2.5 bg-purple-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition resize-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha Próximo Seguimiento:
                </label>
                <input
                  type="date"
                  value={fechaProximoSeguimiento}
                  onChange={(e) => setFechaProximoSeguimiento(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estado Inicial:
                </label>
                <select
                  value={estadoNuevoPlan}
                  onChange={(e) => setEstadoNuevoPlan(e.target.value as EstadoPlanIntervencion)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
                >
                  <option value="EN_SEGUIMIENTO">En Seguimiento</option>
                  <option value="BORRADOR">Borrador</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botón de Enviar */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setMostrarFormNuevo(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardandoPlan}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-xs font-semibold shadow-2xs transition disabled:opacity-50 cursor-pointer"
            >
              {guardandoPlan ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Guardar Plan de Intervención</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Planes Existentes */}
      {cargando ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-trujillo-navy mb-2" />
          <p className="text-xs font-medium">Consultando planes pedagógicos...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-semibold">
          {error}
        </div>
      ) : planes.length === 0 ? (
        <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-50 text-trujillo-sky flex items-center justify-center mb-3">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Sin Planes de Intervención Registrados
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            El estudiante no cuenta actualmente con un plan pedagógico formulado.
            Haga clic en &quot;Formular Nuevo Plan&quot; para iniciar la ruta restaurativa.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {planes.map((plan) => {
            const expandido = planExpandido === plan.id;
            return (
              <div
                key={plan.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden transition"
              >
                {/* Cabecera del Acordeón */}
                <div
                  onClick={() => setPlanExpandido(expandido ? null : plan.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-trujillo-navy bg-trujillo-ice px-2 py-0.5 rounded-lg border border-sky-200">
                      Plan #{plan.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeEstado(
                        plan.estado
                      )}`}
                    >
                      {plan.estado.replace('_', ' ')}
                    </span>
                    {plan.incidenteOrigenId && (
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        (Origen: Caso #{plan.incidenteOrigenId})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {plan.fechaProximoSeguimiento && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-trujillo-sky" />
                        <span>Próx: {plan.fechaProximoSeguimiento}</span>
                      </div>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                      {plan.seguimientos?.length || 0} evoluciones
                    </span>
                    {expandido ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Contenido Expandido */}
                {expandido && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 text-xs">
                    {/* Detalles del Plan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                          Diagnóstico Situacional:
                        </span>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {plan.diagnosticoSituacional}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                          Acciones Formativas Acordadas:
                        </span>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {plan.accionesAcordadas}
                        </p>
                      </div>
                    </div>

                    {plan.compromisoPadres && (
                      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 space-y-1">
                        <span className="text-amber-800 font-semibold uppercase tracking-wider text-[10px] block">
                          Compromisos del Entorno Familiar / Acudiente:
                        </span>
                        <p className="text-amber-950 leading-relaxed">
                          {plan.compromisoPadres}
                        </p>
                      </div>
                    )}

                    {plan.recomendacionesIa && (
                      <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-200/50 space-y-1">
                        <span className="text-purple-800 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span>Recomendaciones Pedagógicas Sugeridas:</span>
                        </span>
                        <p className="text-purple-950 leading-relaxed">
                          {plan.recomendacionesIa}
                        </p>
                      </div>
                    )}

                    {/* Sección de Evoluciones y Seguimientos (CU-07) */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-trujillo-navy" />
                          <h5 className="font-bold text-slate-800">
                            Evolución y Notas de Seguimiento ({plan.seguimientos?.length || 0})
                          </h5>
                        </div>

                        {planIdSeguimiento !== plan.id && (
                          <button
                            type="button"
                            onClick={() => {
                              setPlanIdSeguimiento(plan.id);
                              setNuevoEstadoPlan(plan.estado);
                              setNuevaFechaSeguimiento(plan.fechaProximoSeguimiento || '');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-trujillo-ice hover:bg-sky-100 text-trujillo-navy text-[11px] font-bold border border-sky-200 transition active:scale-[0.98] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Registrar Seguimiento</span>
                          </button>
                        )}
                      </div>

                      {/* Formulario para Registrar Seguimiento en este Plan */}
                      {planIdSeguimiento === plan.id && (
                        <form
                          onSubmit={handleRegistrarSeguimiento}
                          className="bg-sky-50/40 border border-sky-200 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-150"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-xs">
                              Nueva Entrada de Seguimiento Pedagógico
                            </span>
                            <button
                              type="button"
                              onClick={() => setPlanIdSeguimiento(null)}
                              className="text-[11px] text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                            >
                              Cerrar
                            </button>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Observación / Avance Formativo: <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                              value={observacionSeguimiento}
                              onChange={(e) => setObservacionSeguimiento(e.target.value)}
                              rows={2}
                              placeholder="Describa el comportamiento observado, avance en compromisos o incidencias reportadas..."
                              className="w-full text-xs rounded-lg border border-slate-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition resize-none"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                Actualizar Estado del Plan:
                              </label>
                              <select
                                value={nuevoEstadoPlan}
                                onChange={(e) => setNuevoEstadoPlan(e.target.value as EstadoPlanIntervencion)}
                                className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
                              >
                                <option value="EN_SEGUIMIENTO">En Seguimiento</option>
                                <option value="CUMPLIDO">Cumplido (Objetivos Alcanzados)</option>
                                <option value="INCUMPLIDO">Incumplido (Reiteración)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                Nueva Fecha Próximo Seguimiento:
                              </label>
                              <input
                                type="date"
                                value={nuevaFechaSeguimiento}
                                onChange={(e) => setNuevaFechaSeguimiento(e.target.value)}
                                className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setPlanIdSeguimiento(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-semibold transition cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              disabled={guardandoSeguimiento}
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-[11px] font-semibold shadow-2xs transition disabled:opacity-50 cursor-pointer"
                            >
                              {guardandoSeguimiento ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>Guardando...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3" />
                                  <span>Registrar Evolución</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Lista Cronológica de Seguimientos */}
                      {plan.seguimientos && plan.seguimientos.length > 0 ? (
                        <div className="space-y-2">
                          {plan.seguimientos.map((seg) => (
                            <div
                              key={seg.id}
                              className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                                  <User className="w-3.5 h-3.5 text-trujillo-sky" />
                                  <span>{seg.usuarioNombre || 'Orientador Escolar'}</span>
                                  <span className="text-slate-400 font-normal">
                                    ({seg.usuarioRol?.replace('ROLE_', '') || 'ORIENTADOR'})
                                  </span>
                                </div>
                                <span className="text-slate-400 font-medium">
                                  {seg.fechaRegistro ? new Date(seg.fechaRegistro).toLocaleDateString() : '-'}
                                </span>
                              </div>
                              <p className="text-slate-800 text-xs leading-relaxed pt-0.5">
                                {seg.observacion}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic py-2">
                          No se han registrado notas de seguimiento para este plan aún.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
