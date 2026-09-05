import React, { useState, useEffect } from 'react';
import { planesApi } from '../../planes/api/planesApi';
import { matriculasApi } from '../../matriculas/api/matriculasApi';
import {
  PlanIntervencionResponse,
  EstadoPlanIntervencion,
  CrearPlanIntervencionRequest,
  RegistrarSeguimientoRequest
} from '../../planes/types/planes.types';
import { EstudianteMatricula } from '../../matriculas/types/matricula.types';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { ExpedienteEstudianteModal } from '../../matriculas/components/ExpedienteEstudianteModal';
import {
  Layers,
  Search,
  Plus,
  Calendar,
  Clock,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  FileEdit,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FolderOpen,
  Sparkles,
  Send,
  ShieldCheck
} from 'lucide-react';

export const PlanesIntervencionPage: React.FC = () => {
  // Datos principales
  const [planes, setPlanes] = useState<PlanIntervencionResponse[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Filtros y paginación
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');
  const [busquedaAplicada, setBusquedaAplicada] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState<number>(0);
  const [tamanoPagina, setTamanoPagina] = useState<number>(10);
  const [totalElementos, setTotalElementos] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);

  // Métricas rápidas
  const [metricas, setMetricas] = useState({
    enSeguimiento: 0,
    cumplidos: 0,
    incumplidos: 0,
    borradores: 0,
  });

  // Modal de Detalle y Seguimiento (CU-07)
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanIntervencionResponse | null>(null);
  const [isModalDetalleOpen, setIsModalDetalleOpen] = useState<boolean>(false);
  const [observacionSeguimiento, setObservacionSeguimiento] = useState<string>('');
  const [nuevoEstadoPlan, setNuevoEstadoPlan] = useState<EstadoPlanIntervencion>('EN_SEGUIMIENTO');
  const [nuevaFechaSeguimiento, setNuevaFechaSeguimiento] = useState<string>('');
  const [guardandoSeguimiento, setGuardandoSeguimiento] = useState<boolean>(false);

  // Modal de Nuevo Plan
  const [isModalNuevoOpen, setIsModalNuevoOpen] = useState<boolean>(false);
  const [estudiantesBusqueda, setEstudiantesBusqueda] = useState<EstudianteMatricula[]>([]);
  const [busquedaEstudianteTexto, setBusquedaEstudianteTexto] = useState<string>('');
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

  // Modal de Expediente
  const [expedienteEstudianteId, setExpedienteEstudianteId] = useState<number | null>(null);

  // Cargar lista de planes paginados
  const cargarPlanes = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await planesApi.listarPlanesPaginados({
        page: paginaActual,
        size: tamanoPagina,
        estado: filtroEstado || undefined,
        busqueda: busquedaAplicada || undefined,
      });

      setPlanes(res.contenido);
      setTotalElementos(res.totalElementos);
      setTotalPaginas(res.totalPaginas);

      // Calcular métricas locales sobre los planes recibidos
      const seg = res.contenido.filter((p: PlanIntervencionResponse) => p.estado === 'EN_SEGUIMIENTO').length;
      const cum = res.contenido.filter((p: PlanIntervencionResponse) => p.estado === 'CUMPLIDO').length;
      const inc = res.contenido.filter((p: PlanIntervencionResponse) => p.estado === 'INCUMPLIDO').length;
      const bor = res.contenido.filter((p: PlanIntervencionResponse) => p.estado === 'BORRADOR').length;
      setMetricas({
        enSeguimiento: seg,
        cumplidos: cum,
        incumplidos: inc,
        borradores: bor,
      });
    } catch (err) {
      console.error('Error al consultar planes:', err);
      setError(extraerMensajeError(err, 'No fue posible cargar los planes de intervención.'));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, [paginaActual, tamanoPagina, filtroEstado, busquedaAplicada]);

  // Manejar búsqueda
  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(0);
    setBusquedaAplicada(busqueda.trim());
  };

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setBusquedaAplicada('');
    setFiltroEstado('');
    setPaginaActual(0);
  };

  // Abrir detalle y seguimiento
  const handleAbrirDetalle = (plan: PlanIntervencionResponse) => {
    setPlanSeleccionado(plan);
    setObservacionSeguimiento('');
    setNuevoEstadoPlan(plan.estado);
    setNuevaFechaSeguimiento(plan.fechaProximoSeguimiento || '');
    setIsModalDetalleOpen(true);
  };

  // Guardar seguimiento CU-07
  const handleRegistrarSeguimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planSeleccionado) return;
    if (!observacionSeguimiento.trim()) {
      setError('La observación de seguimiento es obligatoria.');
      return;
    }

    setGuardandoSeguimiento(true);
    setError(null);
    try {
      const data: RegistrarSeguimientoRequest = {
        observacion: observacionSeguimiento.trim(),
        nuevoEstadoPlan: nuevoEstadoPlan,
        nuevaFechaProximoSeguimiento: nuevaFechaSeguimiento || undefined,
      };

      const actualizado = await planesApi.registrarSeguimiento(planSeleccionado.id, data);
      setPlanSeleccionado(actualizado);
      setObservacionSeguimiento('');
      setMensajeExito('Seguimiento registrado exitosamente.');
      setTimeout(() => setMensajeExito(null), 4000);
      cargarPlanes();
    } catch (err) {
      console.error('Error al guardar seguimiento:', err);
      setError(extraerMensajeError(err, 'Error al registrar la evolución del caso.'));
    } finally {
      setGuardandoSeguimiento(false);
    }
  };

  // Buscar estudiantes para nuevo plan
  const handleBuscarEstudiantes = async (texto: string) => {
    setBusquedaEstudianteTexto(texto);
    if (texto.trim().length < 2) {
      setEstudiantesBusqueda([]);
      return;
    }

    setBuscandoEstudiante(true);
    try {
      const res = await matriculasApi.listarEstudiantes({
        busqueda: texto.trim(),
        size: 5,
      });
      setEstudiantesBusqueda(res.contenido);
    } catch (err) {
      console.error('Error buscando estudiante:', err);
    } finally {
      setBuscandoEstudiante(false);
    }
  };

  // Asistencia con IA para nuevo plan
  const handleGenerarIaNuevoPlan = async () => {
    if (!estudianteSeleccionado) {
      setError('Debe seleccionar un estudiante para generar la propuesta con IA.');
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
    } catch (err) {
      console.error('Error al generar propuesta IA:', err);
      setAdvertenciaIa('No fue posible contactar a Gemini. Puedes completar los campos manualmente sin bloqueo.');
    } finally {
      setGenerandoIa(false);
    }
  };

  // Guardar nuevo plan
  const handleCrearNuevoPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estudianteSeleccionado) {
      setError('Debe seleccionar un estudiante.');
      return;
    }
    if (!diagnostico.trim() || !accionesAcordadas.trim()) {
      setError('El diagnóstico situacional y las acciones acordadas son campos obligatorios.');
      return;
    }

    setGuardandoNuevoPlan(true);
    setError(null);
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

      await planesApi.crearPlan(req);
      setMensajeExito(`Plan de intervención formulado exitosamente para ${estudianteSeleccionado.nombres}.`);
      setTimeout(() => setMensajeExito(null), 4000);
      setIsModalNuevoOpen(false);
      // Reset form
      setEstudianteSeleccionado(null);
      setDiagnostico('');
      setAccionesAcordadas('');
      setCompromisoPadres('');
      setRecomendacionesIa('');
      setFechaProximoSeguimiento('');
      cargarPlanes();
    } catch (err) {
      console.error('Error al crear plan:', err);
      setError(extraerMensajeError(err, 'Error al formular el plan de intervención.'));
    } finally {
      setGuardandoNuevoPlan(false);
    }
  };

  const getBadgeEstado = (estado: EstadoPlanIntervencion) => {
    switch (estado) {
      case 'EN_SEGUIMIENTO':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CUMPLIDO':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'INCUMPLIDO':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Institucional */}
      <div className="bg-gradient-to-r from-trujillo-dark via-slate-900 to-trujillo-navy rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-trujillo-sky/20 border border-trujillo-sky/30 text-xs font-semibold text-trujillo-sky mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Acompañamiento Formativo y Restaurativo • RF-06 & CU-07</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Planes de Intervención Pedagógica
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Gestión centralizada de acuerdos formativos, compromisos familiares, bitácora de seguimientos periódicos y asistencia de IA.
            </p>
          </div>

          <button
            onClick={() => setIsModalNuevoOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-trujillo-sky hover:bg-sky-400 text-trujillo-dark font-extrabold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Formular Nuevo Plan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-trujillo-navy/10 text-trujillo-navy flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Planes</span>
            <p className="text-xl font-extrabold text-slate-800">{totalElementos}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">En Seguimiento</span>
            <p className="text-xl font-extrabold text-slate-800">{metricas.enSeguimiento}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Cumplidos</span>
            <p className="text-xl font-extrabold text-slate-800">{metricas.cumplidos}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Incumplidos</span>
            <p className="text-xl font-extrabold text-slate-800">{metricas.incumplidos}</p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleBuscar} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por estudiante, documento o diagnóstico..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 focus:border-trujillo-sky"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPaginaActual(0);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 focus:border-trujillo-sky"
            >
              <option value="">Todos los Estados</option>
              <option value="EN_SEGUIMIENTO">En Seguimiento</option>
              <option value="CUMPLIDO">Cumplido</option>
              <option value="INCUMPLIDO">Incumplido</option>
              <option value="BORRADOR">Borrador</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Filtrar</span>
            </button>

            {(busquedaAplicada || filtroEstado) && (
              <button
                type="button"
                onClick={handleLimpiarFiltros}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium flex items-center gap-1.5 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Alertas */}
      {mensajeExito && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabla de Planes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {cargando ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-trujillo-sky" />
            <p className="text-xs font-semibold uppercase tracking-wider">Cargando planes de intervención...</p>
          </div>
        ) : planes.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <HeartHandshake className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No se encontraron planes de intervención</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Puedes formular un nuevo plan con el botón superior o buscar otro criterio.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">ID / Estudiante</th>
                  <th className="px-5 py-3.5">Diagnóstico y Acciones</th>
                  <th className="px-5 py-3.5">Próximo Seguimiento</th>
                  <th className="px-5 py-3.5 text-center">Seguimientos</th>
                  <th className="px-5 py-3.5 text-center">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {planes.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-600">
                          #{plan.id}
                        </span>
                        <div>
                          <div className="font-bold text-slate-800">{plan.estudianteNombre}</div>
                          <div className="text-xs font-mono text-slate-400">{plan.estudianteDocumento}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs sm:max-w-md">
                      <div className="font-medium text-slate-800 text-xs line-clamp-1">
                        <strong className="text-slate-500 uppercase text-[10px]">Diagnóstico: </strong>
                        {plan.diagnosticoSituacional}
                      </div>
                      <div className="text-slate-500 text-xs line-clamp-1 mt-0.5">
                        <strong className="text-slate-400 uppercase text-[10px]">Acciones: </strong>
                        {plan.accionesAcordadas}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      {plan.fechaProximoSeguimiento ? (
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{plan.fechaProximoSeguimiento}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Sin fecha</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {plan.seguimientos?.length || 0} notas
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${getBadgeEstado(
                          plan.estado
                        )}`}
                      >
                        {plan.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleAbrirDetalle(plan)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-trujillo-sky/10 hover:bg-trujillo-sky hover:text-white text-trujillo-navy text-xs font-bold transition-all duration-150 active:scale-95 border border-trujillo-sky/30"
                        title="Ver detalle y registrar evolución (CU-07)"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Seguimiento</span>
                      </button>

                      <button
                        onClick={() => setExpedienteEstudianteId(plan.estudianteId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all"
                        title="Abrir expediente completo del alumno"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {!cargando && totalPaginas > 1 && (
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-medium">
            <div>
              Página <strong className="text-slate-800">{paginaActual + 1}</strong> de{' '}
              <strong className="text-slate-800">{totalPaginas}</strong> ({totalElementos} planes en total)
            </div>

            <div className="flex items-center gap-2">
              <select
                value={tamanoPagina}
                onChange={(e) => {
                  setTamanoPagina(Number(e.target.value));
                  setPaginaActual(0);
                }}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
              >
                <option value={10}>10 / pág</option>
                <option value={20}>20 / pág</option>
                <option value={50}>50 / pág</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaginaActual(0)}
                  disabled={paginaActual === 0}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual((p) => Math.max(0, p - 1))}
                  disabled={paginaActual === 0}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-bold text-slate-800">
                  {paginaActual + 1} / {totalPaginas}
                </span>
                <button
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas - 1, p + 1))}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual(totalPaginas - 1)}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalle y Registro de Seguimiento (CU-07) */}
      {isModalDetalleOpen && planSeleccionado && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 my-8 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-trujillo-sky/20 text-trujillo-sky flex items-center justify-center">
                  <FileEdit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Plan #{planSeleccionado.id} • {planSeleccionado.estudianteNombre}</h3>
                  <p className="text-xs text-slate-400">Doc: {planSeleccionado.estudianteDocumento} | Estado: {planSeleccionado.estado}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalDetalleOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Información del Plan */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <span className="font-extrabold uppercase text-slate-500 tracking-wider text-[10px]">Diagnóstico Situacional:</span>
                  <p className="text-slate-800 font-medium mt-0.5">{planSeleccionado.diagnosticoSituacional}</p>
                </div>
                <div>
                  <span className="font-extrabold uppercase text-slate-500 tracking-wider text-[10px]">Acciones Acordadas:</span>
                  <p className="text-slate-800 font-medium mt-0.5">{planSeleccionado.accionesAcordadas}</p>
                </div>
                {planSeleccionado.compromisoPadres && (
                  <div>
                    <span className="font-extrabold uppercase text-slate-500 tracking-wider text-[10px]">Compromiso Padres / Familia:</span>
                    <p className="text-slate-800 font-medium mt-0.5">{planSeleccionado.compromisoPadres}</p>
                  </div>
                )}
                {planSeleccionado.recomendacionesIa && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                    <div className="flex items-center gap-1.5 font-bold text-[11px] mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sugerencias Asistidas por IA (Gemini):</span>
                    </div>
                    <p className="text-[11px]">{planSeleccionado.recomendacionesIa}</p>
                  </div>
                )}
              </div>

              {/* Historial de Seguimientos */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-trujillo-sky" />
                  <span>Bitácora de Evoluciones ({planSeleccionado.seguimientos?.length || 0})</span>
                </h4>

                {(!planSeleccionado.seguimientos || planSeleccionado.seguimientos.length === 0) ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                    Aún no se han registrado notas de seguimiento para este plan.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {planSeleccionado.seguimientos.map((seg) => (
                      <div key={seg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="font-bold text-slate-700">{seg.usuarioNombre || 'Orientador'}</span>
                          <span>{new Date(seg.fechaRegistro).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-700">{seg.observacion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulario para Registrar Nuevo Seguimiento (CU-07) */}
              <form onSubmit={handleRegistrarSeguimiento} className="p-4 bg-trujillo-ice/50 rounded-xl border border-trujillo-sky/30 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-trujillo-navy">
                  <Plus className="w-4 h-4 text-trujillo-sky" />
                  <span>Registrar Nueva Evolución / Seguimiento (CU-07)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones del Seguimiento *</label>
                  <textarea
                    rows={3}
                    placeholder="Describa los avances del estudiante, entrevistas sostenidas, cumplimiento de compromisos..."
                    value={observacionSeguimiento}
                    onChange={(e) => setObservacionSeguimiento(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 focus:border-trujillo-sky"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Actualizar Estado del Plan</label>
                    <select
                      value={nuevoEstadoPlan}
                      onChange={(e) => setNuevoEstadoPlan(e.target.value as EstadoPlanIntervencion)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                    >
                      <option value="EN_SEGUIMIENTO">EN_SEGUIMIENTO</option>
                      <option value="CUMPLIDO">CUMPLIDO</option>
                      <option value="INCUMPLIDO">INCUMPLIDO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Próxima Fecha de Revisión</label>
                    <input
                      type="date"
                      value={nuevaFechaSeguimiento}
                      onChange={(e) => setNuevaFechaSeguimiento(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={guardandoSeguimiento || !observacionSeguimiento.trim()}
                    className="px-4 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
                  >
                    {guardandoSeguimiento ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Guardar Nota de Seguimiento</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulación de Nuevo Plan */}
      {isModalNuevoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 my-8 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
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
                onClick={() => setIsModalNuevoOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearNuevoPlan} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Selector de Estudiante */}
              <div>
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
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Escribe documento o nombre del alumno..."
                      value={busquedaEstudianteTexto}
                      onChange={(e) => handleBuscarEstudiantes(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                    />
                    {buscandoEstudiante && (
                      <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3 text-slate-400" />
                    )}

                    {estudiantesBusqueda.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto divide-y divide-slate-100">
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
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
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
                  type="date"
                  value={fechaProximoSeguimiento}
                  onChange={(e) => setFechaProximoSeguimiento(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalNuevoOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoNuevoPlan || !estudianteSeleccionado}
                  className="px-4 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
                >
                  {guardandoNuevoPlan ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>Formular Plan Oficial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Expediente Integral */}
      <ExpedienteEstudianteModal
        estudianteId={expedienteEstudianteId}
        isOpen={expedienteEstudianteId !== null}
        onClose={() => setExpedienteEstudianteId(null)}
      />
    </div>
  );
};
