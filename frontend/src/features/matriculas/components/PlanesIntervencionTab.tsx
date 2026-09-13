import React, { useState, useEffect } from 'react';
import {
  PlanIntervencionResponse,
  RegistrarSeguimientoRequest,
  EstadoPlanIntervencion,
} from '../../planes/types/planes.types';
import { planesApi } from '../../planes/api/planesApi';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { useFormularPlan } from '../../planes/hooks/useFormularPlan';
import { FormularioPlanIntervencion } from '../../planes/components/FormularioPlanIntervencion';
import {
  HeartHandshake,
  Plus,
  BrainCircuit,
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

  // Control para desplegar formulario de nuevo plan
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState<boolean>(false);

  // Hook desacoplado para gestión de formulación de planes e IA
  const planForm = useFormularPlan({
    estadoInicial: 'EN_SEGUIMIENTO',
  });

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

      {/* Formulario de Creación de Plan (Desacoplado) */}
      {mostrarFormNuevo && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!planForm.incidenteSeleccionadoId) {
              mostrarAlerta('Debe seleccionar el incidente de convivencia que origina el plan.');
              return;
            }
            await planForm.guardarPlan(
              estudianteId,
              planForm.incidenteSeleccionadoId,
              (nuevo) => {
                setPlanes((prev) => [nuevo, ...prev]);
                setPlanExpandido(nuevo.id);
                setMostrarFormNuevo(false);
                mostrarAlerta('Plan de intervención registrado exitosamente.', 'exito');
              }
            );
          }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200"
        >
          {/* Encabezado del Formulario Documental */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-900 rounded-md border border-blue-100 shrink-0">
                <FileEdit className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                  Formular Plan de Intervención Pedagógica
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-none">
                  Estudiante: <span className="font-semibold text-slate-700">{estudianteNombre}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMostrarFormNuevo(false);
                planForm.resetFormulario();
              }}
              className="text-xs text-slate-400 hover:text-slate-700 font-medium cursor-pointer transition-colors"
            >
              Cancelar
            </button>
          </div>

          <FormularioPlanIntervencion
            incidentes={incidentes}
            incidenteSeleccionadoId={planForm.incidenteSeleccionadoId}
            onSeleccionarIncidente={planForm.setIncidenteSeleccionadoId}
            diagnostico={planForm.diagnostico}
            onCambiarDiagnostico={planForm.setDiagnostico}
            accionesAcordadas={planForm.accionesAcordadas}
            onCambiarAccionesAcordadas={planForm.setAccionesAcordadas}
            compromisoPadres={planForm.compromisoPadres}
            onCambiarCompromisoPadres={planForm.setCompromisoPadres}
            recomendacionesIa={planForm.recomendacionesIa}
            onCambiarRecomendacionesIa={planForm.setRecomendacionesIa}
            fechaProximoSeguimiento={planForm.fechaProximoSeguimiento}
            onCambiarFechaProximoSeguimiento={planForm.setFechaProximoSeguimiento}
            estado={planForm.estado}
            onCambiarEstado={planForm.setEstado}
            mostrarSelectorEstado={true}
            generandoIa={planForm.generandoIa}
            advertenciaIa={planForm.advertenciaIa}
            onGenerarIa={() => {
              if (planForm.incidenteSeleccionadoId) {
                planForm.generarPropuestaIa(estudianteId, planForm.incidenteSeleccionadoId);
              } else {
                mostrarAlerta('Debe seleccionar el incidente de origen para generar la propuesta con IA.');
              }
            }}
          />

          {/* Botón de Enviar */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMostrarFormNuevo(false);
                planForm.resetFormulario();
              }}
              className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={planForm.guardando}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {planForm.guardando ? (
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
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-slate-600 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <BrainCircuit className="w-3.5 h-3.5 text-slate-500" />
                          <span>Recomendaciones Pedagógicas Sugeridas (IA):</span>
                        </span>
                        <p className="text-slate-700 leading-relaxed italic text-xs">
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
