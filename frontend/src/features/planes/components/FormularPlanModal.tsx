import React, { useState, useEffect, useRef } from 'react';
import {
  PlanIntervencionResponse,
  CrearPlanIntervencionRequest
} from '../types/planes.types';
import { planesApi } from '../api/planesApi';
import { matriculasApi } from '../../matriculas/api/matriculasApi';
import { EstudianteMatricula } from '../../matriculas/types/matricula.types';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { useDebounce } from '../../../core/hooks/useDebounce';
import { useLockBodyScroll } from '../../../core/hooks/useLockBodyScroll';
import { notify } from '../../../core/utils/notify';
import {
  Plus,
  Loader2,
  Sparkles,
  ShieldCheck,
  X,
  Users,
  AlertTriangle
} from 'lucide-react';

interface FormularPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreado: (nuevoPlan: PlanIntervencionResponse) => void;
}

export const FormularPlanModal: React.FC<FormularPlanModalProps> = ({
  isOpen,
  onClose,
  onPlanCreado,
}) => {
  const [estudiantesBusqueda, setEstudiantesBusqueda] = useState<EstudianteMatricula[]>([]);
  const [busquedaEstudianteTexto, setBusquedaEstudianteTexto] = useState<string>('');
  const debouncedBusquedaEstudiante = useDebounce(busquedaEstudianteTexto, 350);
  const [buscandoEstudiante, setBuscandoEstudiante] = useState<boolean>(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<EstudianteMatricula | null>(null);

  // Formulario nuevo plan
  const [diagnostico, setDiagnostico] = useState<string>('');
  const [accionesAcordadas, setAccionesAcordadas] = useState<string>('');
  const [compromisoPadres, setCompromisoPadres] = useState<string>('');
  const [fechaProximoSeguimiento, setFechaProximoSeguimiento] = useState<string>('');
  const [recomendacionesIa, setRecomendacionesIa] = useState<string>('');
  const [guardandoNuevoPlan, setGuardandoNuevoPlan] = useState<boolean>(false);
  const [generandoIa, setGenerandoIa] = useState<boolean>(false);
  const [advertenciaIa, setAdvertenciaIa] = useState<string | null>(null);

  const modalNuevoScrollRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(isOpen);

  const [totalEstudiantesSistema, setTotalEstudiantesSistema] = useState<number | null>(null);

  // Comprobar si el sistema tiene estudiantes al abrir
  useEffect(() => {
    if (isOpen) {
      matriculasApi
        .listarEstudiantes({ size: 1 })
        .then((res) => {
          setTotalEstudiantesSistema(res.totalElementos);
        })
        .catch(() => {
          setTotalEstudiantesSistema(null);
        });
    }
  }, [isOpen]);

  // Soporte para cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Búsqueda reactiva debounced para evitar saturación y race conditions
  useEffect(() => {
    let activo = true;

    const ejecutarBusqueda = async () => {
      const termino = debouncedBusquedaEstudiante.trim();
      if (termino.length < 2) {
        setEstudiantesBusqueda([]);
        setBuscandoEstudiante(false);
        return;
      }

      setBuscandoEstudiante(true);
      try {
        const res = await matriculasApi.listarEstudiantes({
          busqueda: termino,
          size: 5,
        });
        if (activo) {
          setEstudiantesBusqueda(res.contenido);
        }
      } catch (err) {
        if (activo) {
          console.error('Error buscando estudiante:', err);
        }
      } finally {
        if (activo) {
          setBuscandoEstudiante(false);
        }
      }
    };

    ejecutarBusqueda();

    return () => {
      activo = false;
    };
  }, [debouncedBusquedaEstudiante]);

  if (!isOpen) return null;

  const resetFormulario = () => {
    setEstudianteSeleccionado(null);
    setEstudiantesBusqueda([]);
    setBusquedaEstudianteTexto('');
    setDiagnostico('');
    setAccionesAcordadas('');
    setCompromisoPadres('');
    setRecomendacionesIa('');
    setFechaProximoSeguimiento('');
    setAdvertenciaIa(null);
  };

  const handleCerrar = () => {
    resetFormulario();
    onClose();
  };

  // Asistencia con IA para nuevo plan
  const handleGenerarIaNuevoPlan = async () => {
    if (!estudianteSeleccionado) {
      notify.formError('Estudiante requerido', 'Debe seleccionar un estudiante para generar la propuesta con IA.', '#input-busqueda-estudiante-plan');
      return;
    }

    setGenerandoIa(true);
    setAdvertenciaIa(null);
    try {
      const prop = await planesApi.generarPropuestaIa(estudianteSeleccionado.id);
      setDiagnostico(prop.diagnosticoSituacional);
      setRecomendacionesIa(prop.recomendacionesIa);
      setAccionesAcordadas(prop.accionesAcordadasSugeridas);
      setCompromisoPadres(prop.compromisoPadresSugerido);

      if (prop.semanasSeguimientoSugeridas) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + prop.semanasSeguimientoSugeridas * 7);
        setFechaProximoSeguimiento(fecha.toISOString().split('T')[0]);
      }

      if (prop.advertenciaGobierno) {
        setAdvertenciaIa(prop.advertenciaGobierno);
      }
      notify.info('Propuesta generada', 'Se han cargado las sugerencias formativas de IA.');
    } catch (err) {
      console.error('Error al generar propuesta IA:', err);
      setAdvertenciaIa('No fue posible contactar a Gemini. Puedes completar los campos manualmente sin bloqueo.');
      notify.warning('Asistente IA no disponible', 'Puedes completar los campos pedagógicos manualmente.');
    } finally {
      setGenerandoIa(false);
    }
  };

  // Guardar nuevo plan
  const handleCrearNuevoPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estudianteSeleccionado) {
      notify.formError('Seleccione un estudiante', 'Debe buscar y seleccionar un estudiante matriculado.', '#input-busqueda-estudiante-plan');
      return;
    }
    if (!diagnostico.trim()) {
      notify.formError('Diagnóstico obligatorio', 'El diagnóstico situacional es un campo obligatorio.', '#textarea-diagnostico-plan');
      return;
    }
    if (!accionesAcordadas.trim()) {
      notify.formError('Acciones obligatorias', 'Las acciones acordadas son un campo obligatorio.', '#textarea-acciones-plan');
      return;
    }

    setGuardandoNuevoPlan(true);
    try {
      const req: CrearPlanIntervencionRequest = {
        estudianteId: estudianteSeleccionado.id,
        diagnosticoSituacional: diagnostico.trim(),
        accionesAcordadas: accionesAcordadas.trim(),
        compromisoPadres: compromisoPadres.trim() || undefined,
        recomendacionesIa: recomendacionesIa.trim() || undefined,
        fechaProximoSeguimiento: fechaProximoSeguimiento || undefined,
        estado: 'EN_SEGUIMIENTO',
      };

      const nuevoPlan = await planesApi.crearPlan(req);
      notify.success('Plan formulado', `Plan de intervención formulado exitosamente para ${estudianteSeleccionado.nombres}.`);
      resetFormulario();
      onPlanCreado(nuevoPlan);
      onClose();
    } catch (err) {
      console.error('Error al crear plan:', err);
      const msg = extraerMensajeError(err, 'Error al formular el plan de intervención.');
      notify.error('Error al formular plan', msg);
      modalNuevoScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setGuardandoNuevoPlan(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl border border-slate-200/80 overflow-hidden min-h-0 animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-trujillo-navy text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-trujillo-sky/20 text-trujillo-sky flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Formular Plan de Intervención Pedagógica</h3>
              <p className="text-xs text-slate-400">Diseño formativo conforme al manual de convivencia y Ley 1620</p>
            </div>
          </div>
          <button
            onClick={handleCerrar}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form noValidate onSubmit={handleCrearNuevoPlan} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div ref={modalNuevoScrollRef} className="p-6 space-y-4 flex-1 overflow-y-auto min-h-0 modal-scroll-body">
            {/* Selector de Estudiante */}
            <div className="space-y-2">
              {totalEstudiantesSistema === 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-900">No hay estudiantes matriculados en el sistema</p>
                    <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                      Actualmente no existen alumnos registrados en el censo escolar. Para formular planes de intervención, primero deben importarse las matrículas escolares desde el módulo de Rectoría.
                    </p>
                  </div>
                </div>
              )}

              <label className="block text-xs font-bold text-slate-700 mb-1">
                Buscar Estudiante Matriculado *
              </label>
              {estudianteSeleccionado ? (
                <div className="p-3 bg-trujillo-sky/10 border border-trujillo-sky/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-trujillo-dark">
                      {estudianteSeleccionado.apellidos}, {estudianteSeleccionado.nombres}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Doc: {estudianteSeleccionado.documento} • Grado: {estudianteSeleccionado.grado}° - {estudianteSeleccionado.grupo}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEstudianteSeleccionado(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    id="input-busqueda-estudiante-plan"
                    type="text"
                    placeholder="Escribe documento o nombre del alumno (mínimo 2 letras)..."
                    value={busquedaEstudianteTexto}
                    onChange={(e) => setBusquedaEstudianteTexto(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                  />
                  {buscandoEstudiante && (
                    <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3 text-slate-400" />
                  )}

                  {/* Dropdown de Búsqueda en Curso */}
                  {buscandoEstudiante && debouncedBusquedaEstudiante.trim().length >= 2 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-center text-xs text-slate-500 flex items-center justify-center gap-2 animate-in fade-in duration-100">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      <span>Buscando en el censo escolar...</span>
                    </div>
                  )}

                  {/* Dropdown de Resultados encontrados */}
                  {!buscandoEstudiante && estudiantesBusqueda.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-100">
                      {estudiantesBusqueda.map((est) => (
                        <div
                          key={est.id}
                          onClick={() => {
                            setEstudianteSeleccionado(est);
                            setEstudiantesBusqueda([]);
                            setBusquedaEstudianteTexto('');
                          }}
                          className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <span className="font-bold text-slate-800">{est.apellidos}, {est.nombres}</span>
                          <span className="text-slate-400 ml-2 font-mono">({est.documento}) - {est.grado}° {est.grupo}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dropdown de Sin Resultados */}
                  {!buscandoEstudiante && debouncedBusquedaEstudiante.trim().length >= 2 && estudiantesBusqueda.length === 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center animate-in fade-in duration-100">
                      <Users className="w-6 h-6 mx-auto text-slate-300 mb-1.5 stroke-[1.5]" />
                      <p className="text-xs font-semibold text-slate-700">No se encontraron estudiantes</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        No hay coincidencias para &quot;{debouncedBusquedaEstudiante}&quot;.
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Verifique el número de documento o apellidos, o confirme que la matrícula esté importada en el sistema.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botón de Asistente IA */}
            {estudianteSeleccionado && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs text-amber-900 font-medium">
                    ¿Deseas consultar sugerencias pedagógicas con Google Gemini para este expediente?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerarIaNuevoPlan}
                  disabled={generandoIa}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95 cursor-pointer"
                >
                  {generandoIa ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{generandoIa ? 'Analizando...' : 'Generar Propuesta'}</span>
                </button>
              </div>
            )}

            {advertenciaIa && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                {advertenciaIa}
              </div>
            )}

            {/* Campos del Plan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Diagnóstico Situacional *</label>
              <textarea
                id="textarea-diagnostico-plan"
                rows={3}
                placeholder="Factores desencadenantes, historial de convivencia y estado socioemocional observado..."
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Acciones Formativas y Restaurativas Acordadas *</label>
              <textarea
                id="textarea-acciones-plan"
                rows={3}
                placeholder="Talleres, cartas de reparación, servicio pedagógico comunitario o acompañamiento en orientación..."
                value={accionesAcordadas}
                onChange={(e) => setAccionesAcordadas(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Compromiso de los Padres / Familia</label>
              <textarea
                id="textarea-compromiso-padres"
                rows={2}
                placeholder="Pautas de crianza positiva, control de horarios, asistencia a escuela de padres..."
                value={compromisoPadres}
                onChange={(e) => setCompromisoPadres(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Primer Seguimiento</label>
              <input
                id="input-fecha-seguimiento"
                type="date"
                value={fechaProximoSeguimiento}
                onChange={(e) => setFechaProximoSeguimiento(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
              />
            </div>
          </div>

          {/* Footer Fijo */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-slate-400">Los campos marcados con asterisco (*) son obligatorios</span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleCerrar}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardandoNuevoPlan || !estudianteSeleccionado}
                className="px-4 py-2 rounded-lg bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                {guardandoNuevoPlan ? <Loader2 className="w-3.5 h-3.5 animate-spin text-trujillo-sky" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>Formular Plan Oficial</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
