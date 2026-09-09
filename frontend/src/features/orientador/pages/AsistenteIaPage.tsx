import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentesApi } from '../../incidentes/api/incidentesApi';
import { planesApi } from '../../planes/api/planesApi';
import { matriculasApi } from '../../matriculas/api/matriculasApi';
import { NarrativaProcesada } from '../../incidentes/types/incidente.types';
import { PropuestaIaResponse, CrearPlanIntervencionRequest } from '../../planes/types/planes.types';
import { EstudianteMatricula } from '../../matriculas/types/matricula.types';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { useDebounce } from '../../../core/hooks/useDebounce';
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
  HeartHandshake,
  RotateCcw,
  Calendar,
  Info,
  Scale,
  ExternalLink
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
  const debouncedBusquedaEstudiante = useDebounce(busquedaEstudiante, 350);
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
  const [campoCopiado, setCampoCopiado] = useState<string | null>(null);

  const handleCopiarCampo = (texto: string, campoId: string) => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    setCampoCopiado(campoId);
    setTimeout(() => setCampoCopiado(null), 2000);
  };

  const handleRestablecerSugerencias = () => {
    if (!resultadoPlan) return;
    setDiagnosticoEdit(resultadoPlan.diagnosticoSituacional || '');
    setAccionesEdit(resultadoPlan.accionesAcordadasSugeridas || '');
    setCompromisoEdit(resultadoPlan.compromisoPadresSugerido || '');
    if (resultadoPlan.semanasSeguimientoSugeridas) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + resultadoPlan.semanasSeguimientoSugeridas * 7);
      setFechaSeguimientoEdit(fecha.toISOString().split('T')[0]);
    }
  };

  const handleCopiarPlanCompleto = () => {
    if (!resultadoPlan || !estudianteSeleccionado) return;
    const textoCompleto = `PLAN DE INTERVENCIÓN PEDAGÓGICA Y RESTAURATIVA
Estudiante: ${estudianteSeleccionado.apellidos}, ${estudianteSeleccionado.nombres}
Documento: ${estudianteSeleccionado.documento} • Grado: ${estudianteSeleccionado.grado}° ${estudianteSeleccionado.grupo}
Fecha Próximo Seguimiento: ${fechaSeguimientoEdit || 'No definida'}

1. DIAGNÓSTICO SITUACIONAL VALIDADO:
${diagnosticoEdit}

2. ACCIONES RESTAURATIVAS ACORDADAS:
${accionesEdit}

3. CORRESPONSABILIDAD Y COMPROMISO FAMILIAR:
${compromisoEdit || 'No registrado'}

4. ORIENTACIÓN DE IA (GEMINI):
${resultadoPlan.recomendacionesIa}`;

    navigator.clipboard.writeText(textoCompleto);
    setCampoCopiado('todo');
    setTimeout(() => setCampoCopiado(null), 2500);
  };

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

  // Búsqueda reactiva debounced para evitar saturación de red y race conditions
  useEffect(() => {
    let activo = true;

    const ejecutarBusqueda = async () => {
      const termino = debouncedBusquedaEstudiante.trim();
      if (termino.length < 2) {
        setEstudiantesResultados([]);
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
          setEstudiantesResultados(res.contenido);
        }
      } catch (err) {
        if (activo) {
          console.error('Error buscando estudiantes:', err);
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
      <div className="bg-trujillo-navy rounded-xl p-6 sm:p-7 text-white shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inteligencia Artificial Asistiva • Asistencia Pedagógica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Taller de Asistencia Pedagógica con IA
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Modelos de lenguaje natural (Google Gemini) para estandarización fáctica de relatos informales y diseño de acuerdos restaurativos.
            </p>
          </div>

          <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-xs text-slate-200 flex items-center gap-2 max-w-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
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
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-medium">
                    ¿Deseas formalizar este hecho en la bitácora escolar?
                  </span>
                  <button
                    onClick={() =>
                      navigate('/orientador/incidentes', {
                        state: { prefill: resultadoNarrativa, autoOpenModal: true },
                      })
                    }
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
                    title="Abre el modal de registro con todos estos campos pre-diligenciados"
                  >
                    <span>Transferir a Registro de Incidente Oficial</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Selección de Alumno y Parámetros */}
          <div className={`${resultadoPlan ? 'lg:col-span-4' : 'lg:col-span-5'} space-y-4`}>
            {/* Tarjeta de Búsqueda y Selección */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-trujillo-sky" />
                  <span>Selección del Estudiante</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Gemini consultará los antecedentes anonimizados del estudiante y formulará una propuesta de plan formativo estructurado.
                </p>
              </div>

              {/* Buscador de Estudiante */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                      title="Quitar estudiante"
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
                      onChange={(e) => setBusquedaEstudiante(e.target.value)}
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

            {/* Sidebar Contextual Adicional si hay resultado de Plan */}
            {resultadoPlan && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Control del Borrador</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Borrador Pedagógico
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 py-1">
                    <span className="text-slate-400">Motor de IA:</span>
                    <span className="font-semibold text-slate-800">Google Gemini Pro</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 py-1">
                    <span className="text-slate-400">Plazo sugerido:</span>
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {resultadoPlan.semanasSeguimientoSugeridas} semanas
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 py-1">
                    <span className="text-slate-400">Enfoque:</span>
                    <span className="font-semibold text-slate-800">Restaurativo Ley 1620</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={handleRestablecerSugerencias}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Restablecer sugerencias de IA</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerarPlan}
                    disabled={procesandoPlan}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {procesandoPlan ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                    <span>Regenerar con otra formulación</span>
                  </button>
                </div>
              </div>
            )}

            {/* Aviso de Gobernanza */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <Scale className="w-4 h-4 text-trujillo-navy" />
                <span>Gobernanza Human-in-the-Loop</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                La propuesta generada es una asistencia fáctica y orientativa. La decisión final, adecuación de términos y validez probatoria es potestad exclusiva del orientador escolar.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Formulario del Plan Generado (Espacio Generoso) */}
          <div className={`${resultadoPlan ? 'lg:col-span-8' : 'lg:col-span-7'} bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-trujillo-sky" />
                  <span>Propuesta y Formalización del Plan</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Revisa, amplía y valida las cláusulas pedagógicas antes de registrarlas en la hoja de vida convivencial.
                </p>
              </div>

              {resultadoPlan && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopiarPlanCompleto}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                    title="Copiar el texto completo de la propuesta al portapapeles"
                  >
                    {campoCopiado === 'todo' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar Propuesta</span>
                      </>
                    )}
                  </button>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold uppercase tracking-wider">
                    Borrador Asistido por IA
                  </span>
                </div>
              )}
            </div>

            {planGuardadoExito && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">{planGuardadoExito}</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/orientador/planes')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                >
                  <span>Ir a Planes de Intervención</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {!resultadoPlan ? (
              <div className="py-16 px-6 text-center text-slate-400 space-y-3 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <Layers className="w-7 h-7" />
                </div>
                <p className="text-base font-bold text-slate-700">Sin propuesta generada</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Selecciona un estudiante a la izquierda y presiona &quot;Formular Plan con Google Gemini&quot; para obtener un diagnóstico situacional, acciones restaurativas y recomendaciones normativas automáticas.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-2 text-[11px] text-slate-500">
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">Diagnóstico Situacional</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">Acuerdos Restaurativos</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">Compromiso de Acudientes</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recomendaciones Teóricas y Normativas de Gemini */}
                <div className="p-4 sm:p-5 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-xs text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Orientación Pedagógica y Normativa de Gemini:</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700/80 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300/60">
                      Marco Ley 1620
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-amber-950 font-normal">
                    {resultadoPlan.recomendacionesIa}
                  </p>
                  {resultadoPlan.advertenciaGobierno && (
                    <div className="pt-2.5 mt-2 border-t border-amber-200/60 flex items-start gap-2 text-[11px] text-amber-800">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{resultadoPlan.advertenciaGobierno}</span>
                    </div>
                  )}
                </div>

                {/* Campo 1: Diagnóstico Situacional Validado */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-trujillo-navy text-white text-[11px] font-bold flex items-center justify-center">
                        1
                      </span>
                      <label className="text-xs sm:text-sm font-bold text-slate-800">
                        Diagnóstico Situacional Validado
                      </label>
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                        Requerido
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopiarCampo(diagnosticoEdit, 'diagnostico')}
                      className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-medium transition-colors"
                      title="Copiar este campo"
                    >
                      {campoCopiado === 'diagnostico' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={diagnosticoEdit}
                    onChange={(e) => setDiagnosticoEdit(e.target.value)}
                    placeholder="Describe el contexto de la situación observada, antecedentes y factores de riesgo detectados..."
                    className="w-full p-4 rounded-xl border border-slate-300 focus:border-trujillo-navy focus:ring-2 focus:ring-trujillo-navy/15 text-xs sm:text-sm text-slate-800 leading-relaxed bg-white shadow-xs resize-y font-sans transition-all min-h-[140px]"
                  />
                  <p className="text-[11px] text-slate-500">
                    Fundamentación del caso basada en la recurrencia y gravedad de faltas registradas.
                  </p>
                </div>

                {/* Campo 2: Acciones Restaurativas Acordadas */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-trujillo-navy text-white text-[11px] font-bold flex items-center justify-center">
                        2
                      </span>
                      <label className="text-xs sm:text-sm font-bold text-slate-800">
                        Acciones Restaurativas Acordadas
                      </label>
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                        Requerido
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopiarCampo(accionesEdit, 'acciones')}
                      className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-medium transition-colors"
                      title="Copiar este campo"
                    >
                      {campoCopiado === 'acciones' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={accionesEdit}
                    onChange={(e) => setAccionesEdit(e.target.value)}
                    placeholder="Establece las actividades pedagógicas reparadoras, compromisos socioeducativos y metas de no repetición..."
                    className="w-full p-4 rounded-xl border border-slate-300 focus:border-trujillo-navy focus:ring-2 focus:ring-trujillo-navy/15 text-xs sm:text-sm text-slate-800 leading-relaxed bg-white shadow-xs resize-y font-sans transition-all min-h-[140px]"
                  />
                  <p className="text-[11px] text-slate-500">
                    Compromisos orientados a la reparación del daño escolar y desarrollo de habilidades socioemocionales.
                  </p>
                </div>

                {/* Campo 3: Compromiso Familiar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-trujillo-navy text-white text-[11px] font-bold flex items-center justify-center">
                        3
                      </span>
                      <label className="text-xs sm:text-sm font-bold text-slate-800">
                        Corresponsabilidad y Compromiso Familiar
                      </label>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        Recomendado
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopiarCampo(compromisoEdit, 'compromiso')}
                      className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-medium transition-colors"
                      title="Copiar este campo"
                    >
                      {campoCopiado === 'compromiso' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={compromisoEdit}
                    onChange={(e) => setCompromisoEdit(e.target.value)}
                    placeholder="Pautas de acompañamiento acordadas con el acudiente en el entorno del hogar..."
                    className="w-full p-4 rounded-xl border border-slate-300 focus:border-trujillo-navy focus:ring-2 focus:ring-trujillo-navy/15 text-xs sm:text-sm text-slate-800 leading-relaxed bg-white shadow-xs resize-y font-sans transition-all min-h-[105px]"
                  />
                  <p className="text-[11px] text-slate-500">
                    Acuerdos de acompañamiento y canal directo de comunicación con los padres o acudientes.
                  </p>
                </div>

                {/* Campo 4: Fecha Sugerida de Seguimiento */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-trujillo-navy text-white text-[11px] font-bold flex items-center justify-center">
                      4
                    </span>
                    <label className="text-xs sm:text-sm font-bold text-slate-800">
                      Fecha Límite de Seguimiento y Evaluación
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative max-w-xs w-full">
                      <input
                        type="date"
                        value={fechaSeguimientoEdit}
                        onChange={(e) => setFechaSeguimientoEdit(e.target.value)}
                        className="w-full p-3 pl-9 rounded-xl border border-slate-300 focus:border-trujillo-navy focus:ring-2 focus:ring-trujillo-navy/15 text-xs sm:text-sm bg-white font-sans transition-all"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    </div>
                    {resultadoPlan.semanasSeguimientoSugeridas && (
                      <span className="text-xs text-slate-500 font-medium">
                        (Plazo estimado por IA: {resultadoPlan.semanasSeguimientoSugeridas} semanas conforme a la ruta convivencial)
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Institucional de Guardado */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] sm:text-xs">
                      Al guardar, el plan se asigna formalmente a la hoja de vida convivencial del estudiante.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGuardarPlanOficial}
                    disabled={guardandoPlan}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"
                  >
                    {guardandoPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
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
