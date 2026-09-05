import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentesApi } from '../../incidentes/api/incidentesApi';
import { planesApi } from '../../planes/api/planesApi';
import { matriculasApi } from '../../matriculas/api/matriculasApi';
import { NarrativaProcesada } from '../../incidentes/types/incidente.types';
import { PropuestaIaResponse, CrearPlanIntervencionRequest } from '../../planes/types/planes.types';
import { EstudianteMatricula } from '../../matriculas/types/matricula.types';
import { extraerMensajeError } from '../../../core/api/apiClient';
import {
  Sparkles,
  FileText,
  Layers,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  X,
  HeartHandshake
} from 'lucide-react';

type TabAsistente = 'narrativa' | 'plan';

export const AsistenteIaPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState<TabAsistente>('narrativa');

  // Tab 1: Narrativa PLN (CU-05)
  const [narrativaInput, setNarrativaInput] = useState<string>('');
  const [procesandoNarrativa, setProcesandoNarrativa] = useState<boolean>(false);
  const [resultadoNarrativa, setResultadoNarrativa] = useState<NarrativaProcesada | null>(null);
  const [errorNarrativa, setErrorNarrativa] = useState<string | null>(null);
  const [textoCopiado, setTextoCopiado] = useState<boolean>(false);

  // Tab 2: Plan de Intervención (CU-06)
  const [busquedaEstudiante, setBusquedaEstudiante] = useState<string>('');
  const [estudiantesResultados, setEstudiantesResultados] = useState<EstudianteMatricula[]>([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<EstudianteMatricula | null>(null);
  const [buscandoEstudiante, setBuscandoEstudiante] = useState<boolean>(false);

  const [procesandoPlan, setProcesandoPlan] = useState<boolean>(false);
  const [resultadoPlan, setResultadoPlan] = useState<PropuestaIaResponse | null>(null);
  const [errorPlan, setErrorPlan] = useState<string | null>(null);
  const [planGuardadoExito, setPlanGuardadoExito] = useState<string | null>(null);
  const [guardandoPlan, setGuardandoPlan] = useState<boolean>(false);

  // Formulario editable para guardar plan oficial
  const [diagnosticoEdit, setDiagnosticoEdit] = useState<string>('');
  const [accionesEdit, setAccionesEdit] = useState<string>('');
  const [compromisoEdit, setCompromisoEdit] = useState<string>('');
  const [fechaSeguimientoEdit, setFechaSeguimientoEdit] = useState<string>('');

  // Ejemplos de prueba para narrativa
  const ejemplosNarrativa = [
    {
      titulo: 'Altercado físico en descanso',
      texto: 'Durante el segundo descanso a eso de las 10:15 am en el patio central, el profesor Juan Martínez observó que los estudiantes Carlos Pérez y Andrés Gómez comenzaron a discutir acaloradamente por un balón y luego Carlos le propinó un golpe en el rostro a Andrés, dejándole un hematoma visible.',
    },
    {
      titulo: 'Irrespeto verbal a docente',
      texto: 'En la tercera hora de clase en el aula 601, la docente María González reportó que el alumno Felipe Morales se negó a guardar su celular, comenzó a responder con groserías e insultos a la profesora y abandonó el salón sin autorización previa.',
    },
  ];

  // Estandarizar narrativa con Gemini
  const handleProcesarNarrativa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!narrativaInput.trim()) return;

    setProcesandoNarrativa(true);
    setErrorNarrativa(null);
    setResultadoNarrativa(null);
    try {
      const res = await incidentesApi.procesarNarrativa({ relato: narrativaInput.trim() });
      setResultadoNarrativa(res);
    } catch (err) {
      console.error('Error al procesar narrativa:', err);
      setErrorNarrativa(
        extraerMensajeError(err, 'No fue posible contactar el servicio de IA de Gemini. Verifique su conexión o intente nuevamente.')
      );
    } finally {
      setProcesandoNarrativa(false);
    }
  };

  const handleCopiarHechos = () => {
    if (!resultadoNarrativa?.hechosEstandarizados) return;
    navigator.clipboard.writeText(resultadoNarrativa.hechosEstandarizados);
    setTextoCopiado(true);
    setTimeout(() => setTextoCopiado(false), 2500);
  };

  // Buscar estudiantes para el plan
  const handleBuscarEstudiantes = async (texto: string) => {
    setBusquedaEstudiante(texto);
    if (texto.trim().length < 2) {
      setEstudiantesResultados([]);
      return;
    }

    setBuscandoEstudiante(true);
    try {
      const res = await matriculasApi.listarEstudiantes({
        busqueda: texto.trim(),
        size: 5,
      });
      setEstudiantesResultados(res.contenido);
    } catch (err) {
      console.error('Error buscando estudiantes:', err);
    } finally {
      setBuscandoEstudiante(false);
    }
  };

  // Generar plan de intervención con Gemini
  const handleGenerarPlan = async () => {
    if (!estudianteSeleccionado) return;

    setProcesandoPlan(true);
    setErrorPlan(null);
    setResultadoPlan(null);
    setPlanGuardadoExito(null);
    try {
      const res = await planesApi.generarPropuestaIa(estudianteSeleccionado.id);
      setResultadoPlan(res);
      setDiagnosticoEdit(res.diagnosticoSituacional);
      setAccionesEdit(res.accionesAcordadasSugeridas);
      setCompromisoEdit(res.compromisoPadresSugerido);

      if (res.semanasSeguimientoSugeridas) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + res.semanasSeguimientoSugeridas * 7);
        setFechaSeguimientoEdit(fecha.toISOString().split('T')[0]);
      }
    } catch (err) {
      console.error('Error al generar plan IA:', err);
      setErrorPlan(
        extraerMensajeError(err, 'No fue posible generar la propuesta pedagógica con Google Gemini.')
      );
    } finally {
      setProcesandoPlan(false);
    }
  };

  // Guardar propuesta como plan oficial
  const handleGuardarPlanOficial = async () => {
    if (!estudianteSeleccionado || !resultadoPlan) return;

    setGuardandoPlan(true);
    setErrorPlan(null);
    try {
      const req: CrearPlanIntervencionRequest = {
        estudianteId: estudianteSeleccionado.id,
        diagnosticoSituacional: diagnosticoEdit.trim(),
        accionesAcordadas: accionesEdit.trim(),
        compromisoPadres: compromisoEdit.trim() || undefined,
        recomendacionesIa: resultadoPlan.recomendacionesIa || undefined,
        fechaProximoSeguimiento: fechaSeguimientoEdit || undefined,
        estado: 'EN_SEGUIMIENTO',
      };

      const creado = await planesApi.crearPlan(req);
      setPlanGuardadoExito(`¡Plan #${creado.id} creado exitosamente en la base de datos!`);
      setTimeout(() => {
        setPlanGuardadoExito(null);
      }, 5000);
    } catch (err) {
      console.error('Error al guardar plan oficial:', err);
      setErrorPlan(extraerMensajeError(err, 'No fue posible persistir el plan de intervención.'));
    } finally {
      setGuardandoPlan(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Institucional */}
      <div className="bg-gradient-to-r from-trujillo-dark via-slate-900 to-trujillo-navy rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inteligencia Artificial Cognitiva • RF-05 & RF-06</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Taller de Asistencia Pedagógica con IA
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Modelos de lenguaje natural (Google Gemini) para estandarización fáctica de relatos informales y diseño de acuerdos restaurativos.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2 max-w-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] leading-tight">
              <strong>Human-in-the-Loop:</strong> La IA propone, el orientador valida y decide.
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setTabActiva('narrativa')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all duration-150 ${
            tabActiva === 'narrativa'
              ? 'border-trujillo-sky text-trujillo-navy bg-trujillo-sky/5 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Estandarizador de Narrativas (PLN)</span>
        </button>

        <button
          onClick={() => setTabActiva('plan')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all duration-150 ${
            tabActiva === 'plan'
              ? 'border-trujillo-sky text-trujillo-navy bg-trujillo-sky/5 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Formulador de Intervenciones (IA)</span>
        </button>
      </div>

      {/* TAB 1: Estandarizador de Narrativas (CU-05) */}
      {tabActiva === 'narrativa' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Columna Izquierda: Entrada */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-trujillo-sky" />
                <span>Relato Informal o Narrativa Libre</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pega la versión suministrada por el docente, acudiente o informante. Gemini extraerá las entidades, lugar, hora y tipología conforme a la Ley 1620.
              </p>
            </div>

            {/* Chips de Ejemplos */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ejemplos Rápidos:</span>
              <div className="flex flex-wrap gap-2">
                {ejemplosNarrativa.map((ej, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNarrativaInput(ej.texto)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                  >
                    {ej.titulo}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleProcesarNarrativa} className="space-y-3">
              <textarea
                rows={7}
                placeholder="Escribe aquí el relato libre de los hechos (ej: En el patio a las 10:15 el alumno Carlos de 8-1 golpeó a Andrés en el rostro...)"
                value={narrativaInput}
                onChange={(e) => setNarrativaInput(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 focus:border-trujillo-sky font-sans"
                required
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setNarrativaInput('')}
                  disabled={!narrativaInput}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  Limpiar Texto
                </button>

                <button
                  type="submit"
                  disabled={procesandoNarrativa || !narrativaInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-extrabold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
                >
                  {procesandoNarrativa ? (
                    <Loader2 className="w-4 h-4 animate-spin text-trujillo-sky" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-trujillo-gold" />
                  )}
                  <span>{procesandoNarrativa ? 'Analizando con Gemini...' : 'Estandarizar Hechos'}</span>
                </button>
              </div>
            </form>

            {errorNarrativa && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
                <span>{errorNarrativa}</span>
                <button onClick={() => setErrorNarrativa(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Columna Derecha: Resultado Estructurado */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Extracción Estructurada por Gemini</span>
              </h2>
              {resultadoNarrativa && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wide">
                  Procesado con Éxito
                </span>
              )}
            </div>

            {!resultadoNarrativa ? (
              <div className="p-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-xl">
                <Sparkles className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">Esperando relato para analizar</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Ingresa una narrativa informal a la izquierda y presiona &quot;Estandarizar Hechos&quot;.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Hechos Estandarizados */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase tracking-wider text-slate-500 text-[10px]">
                      Redacción Fáctica Formal (Debido Proceso):
                    </span>
                    <button
                      onClick={handleCopiarHechos}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-trujillo-navy hover:text-trujillo-sky"
                    >
                      {textoCopiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{textoCopiado ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {resultadoNarrativa.hechosEstandarizados}
                  </p>
                </div>

                {/* Clasificación sugerida */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-700">Clasificación Ley 1620</span>
                    <span className="text-sm font-black text-amber-900">{resultadoNarrativa.clasificacionLeySugerida || 'TIPO_I'}</span>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-700">Lugar Detectado</span>
                    <span className="text-sm font-black text-blue-900">{resultadoNarrativa.lugarNombre || 'Patio Central'}</span>
                  </div>
                </div>

                {/* Involucrados Identificados */}
                {resultadoNarrativa.estudiantes && resultadoNarrativa.estudiantes.length > 0 && (
                  <div>
                    <span className="block font-extrabold uppercase tracking-wider text-slate-500 text-[10px] mb-2">
                      Estudiantes Identificados en el Texto ({resultadoNarrativa.estudiantes.length}):
                    </span>
                    <div className="space-y-1.5">
                      {resultadoNarrativa.estudiantes.map((est, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800">{est.nombreCompleto || est.nombreMencionado || 'Estudiante'}</span>
                            {est.documento && <span className="text-slate-400 font-mono ml-2">({est.documento})</span>}
                          </div>
                          <span className="px-2 py-0.5 rounded bg-trujillo-sky/10 border border-trujillo-sky/30 text-trujillo-navy font-bold text-[10px] uppercase">
                            {est.rolSugerido}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acciones de continuidad */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => navigate('/orientador/incidentes')}
                    className="px-4 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    <span>Ir a Bitácora para Registrar Incidente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Formulador de Intervenciones (CU-06) */}
      {tabActiva === 'plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Columna Izquierda: Selección de Alumno y Petición */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-trujillo-sky" />
                <span>Selección del Estudiante</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Gemini consultará los antecedentes anonimizados del estudiante y formulará un plan restaurativo estructurado (SAD Sección 16.2).
              </p>
            </div>

            {/* Buscador de Estudiante */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Buscar por Nombre o Documento:
              </label>
              {estudianteSeleccionado ? (
                <div className="p-3.5 bg-trujillo-sky/10 border border-trujillo-sky/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-trujillo-dark">
                      {estudianteSeleccionado.apellidos}, {estudianteSeleccionado.nombres}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Doc: {estudianteSeleccionado.documento} • Grado: {estudianteSeleccionado.grado}° {estudianteSeleccionado.grupo}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEstudianteSeleccionado(null);
                      setResultadoPlan(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Escribe documento o nombre..."
                    value={busquedaEstudiante}
                    onChange={(e) => handleBuscarEstudiantes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                  />
                  {buscandoEstudiante && (
                    <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3 text-slate-400" />
                  )}

                  {estudiantesResultados.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {estudiantesResultados.map((est) => (
                        <div
                          key={est.id}
                          onClick={() => {
                            setEstudianteSeleccionado(est);
                            setEstudiantesResultados([]);
                            setBusquedaEstudiante('');
                          }}
                          className="p-3 hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <span className="font-bold text-slate-800">{est.apellidos}, {est.nombres}</span>
                          <span className="text-slate-400 ml-2 font-mono">({est.documento}) - {est.grado}° {est.grupo}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerarPlan}
                disabled={procesandoPlan || !estudianteSeleccionado}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
              >
                {procesandoPlan ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{procesandoPlan ? 'Razonando diagnóstico pedagógico...' : 'Formular Plan con Google Gemini'}</span>
              </button>
            </div>

            {errorPlan && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
                <span>{errorPlan}</span>
                <button onClick={() => setErrorPlan(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Columna Derecha: Formulario del Plan Generado */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-trujillo-sky" />
                <span>Propuesta y Formalización del Plan</span>
              </h2>
              {resultadoPlan && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold uppercase">
                  Borrador Asistido por IA
                </span>
              )}
            </div>

            {planGuardadoExito && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{planGuardadoExito}</span>
              </div>
            )}

            {!resultadoPlan ? (
              <div className="p-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-xl">
                <Layers className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">Sin propuesta generada</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Selecciona un estudiante a la izquierda y presiona &quot;Formular Plan con Google Gemini&quot;.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Recomendaciones de IA */}
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-extrabold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Recomendación Teórica y Formativa de Gemini:</span>
                  </div>
                  <p className="text-xs leading-relaxed">{resultadoPlan.recomendacionesIa}</p>
                </div>

                {/* Campos editables para validación humana */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Diagnóstico Situacional Validado</label>
                  <textarea
                    rows={3}
                    value={diagnosticoEdit}
                    onChange={(e) => setDiagnosticoEdit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Acciones Restaurativas Acordadas</label>
                  <textarea
                    rows={3}
                    value={accionesEdit}
                    onChange={(e) => setAccionesEdit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Compromiso Familiar</label>
                  <textarea
                    rows={2}
                    value={compromisoEdit}
                    onChange={(e) => setCompromisoEdit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Sugerida de Seguimiento</label>
                  <input
                    type="date"
                    value={fechaSeguimientoEdit}
                    onChange={(e) => setFechaSeguimientoEdit(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleGuardarPlanOficial}
                    disabled={guardandoPlan}
                    className="px-5 py-2.5 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-extrabold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
                  >
                    {guardandoPlan ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>Guardar como Plan Oficial en Base de Datos</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
