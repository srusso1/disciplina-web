import React, { useState, useEffect } from 'react';
import { planesApi } from '../../planes/api/planesApi';
import {
  PlanIntervencionResponse,
  EstadoPlanIntervencion,
} from '../../planes/types/planes.types';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { ExpedienteEstudianteModal } from '../../matriculas/components/ExpedienteEstudianteModal';
import { DetallePlanModal } from '../../planes/components/DetallePlanModal';
import { FormularPlanModal } from '../../planes/components/FormularPlanModal';
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
  FolderOpen
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

  // Modal de Detalle y Seguimiento
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanIntervencionResponse | null>(null);
  const [isModalDetalleOpen, setIsModalDetalleOpen] = useState<boolean>(false);

  // Modal de Formulación de Nuevo Plan
  const [isModalNuevoOpen, setIsModalNuevoOpen] = useState<boolean>(false);

  // Modal de Expediente Integral
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
    setIsModalDetalleOpen(true);
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
      <div className="bg-trujillo-navy rounded-xl p-6 sm:p-7 text-white shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-trujillo-sky/20 border border-trujillo-sky/30 text-xs font-semibold text-sky-200 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Acompañamiento Formativo y Restaurativo • Plan Integral</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Planes de Intervención Pedagógica
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Gestión centralizada de acuerdos formativos, compromisos familiares, bitácora de seguimientos periódicos y asistencia de IA.
            </p>
          </div>

          <button
            onClick={() => setIsModalNuevoOpen(true)}
            className="px-4 py-2 rounded-lg bg-trujillo-sky hover:bg-sky-400 text-trujillo-dark font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
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
              className="px-4 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-sm font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Filtrar</span>
            </button>

            {(busquedaAplicada || filtroEstado) && (
              <button
                type="button"
                onClick={handleLimpiarFiltros}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer"
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
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 cursor-pointer">
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
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-2.5 px-3.5">ID / Estudiante</th>
                  <th className="py-2.5 px-3.5">Diagnóstico y Acciones</th>
                  <th className="py-2.5 px-3.5">Próximo Seguimiento</th>
                  <th className="py-2.5 px-3.5 text-center">Seguimientos</th>
                  <th className="py-2.5 px-3.5 text-center">Estado</th>
                  <th className="py-2.5 px-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {planes.map((plan) => (
                  <tr key={plan.id} className="even:bg-slate-50/50 hover:bg-slate-100/60 transition-colors">
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-600">
                          #{plan.id}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800">{plan.estudianteNombre}</div>
                          <div className="text-xs font-mono text-slate-400">{plan.estudianteDocumento}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 max-w-xs sm:max-w-md">
                      <div className="font-medium text-slate-800 text-xs line-clamp-1">
                        <strong className="text-slate-500 uppercase text-[10px]">Diagnóstico: </strong>
                        {plan.diagnosticoSituacional}
                      </div>
                      <div className="text-slate-500 text-xs line-clamp-1 mt-0.5">
                        <strong className="text-slate-400 uppercase text-[10px]">Acciones: </strong>
                        {plan.accionesAcordadas}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-xs text-slate-600">
                      {plan.fechaProximoSeguimiento ? (
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{plan.fechaProximoSeguimiento}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Sin fecha</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {plan.seguimientos?.length || 0} notas
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${getBadgeEstado(
                          plan.estado
                        )}`}
                      >
                        {plan.estado}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAbrirDetalle(plan)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-trujillo-ice hover:bg-sky-100 text-trujillo-navy text-xs font-semibold transition-all duration-150 active:scale-[0.98] border border-sky-200 cursor-pointer shadow-2xs"
                          title="Ver detalle y registrar evolución pedagógica"
                        >
                          <FileEdit className="w-3.5 h-3.5 text-trujillo-navy" />
                          <span>Seguimiento</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpedienteEstudianteId(plan.estudianteId)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all duration-150 active:scale-[0.98] border border-slate-200 cursor-pointer shadow-2xs"
                          title="Abrir expediente escolar integral del estudiante"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-trujillo-sky" />
                          <span>Expediente</span>
                        </button>
                      </div>
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
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual((p) => Math.max(0, p - 1))}
                  disabled={paginaActual === 0}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-bold text-slate-800">
                  {paginaActual + 1} / {totalPaginas}
                </span>
                <button
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas - 1, p + 1))}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual(totalPaginas - 1)}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 cursor-pointer"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Modular de Detalle y Seguimiento */}
      <DetallePlanModal
        isOpen={isModalDetalleOpen}
        plan={planSeleccionado}
        onClose={() => {
          setIsModalDetalleOpen(false);
          setPlanSeleccionado(null);
        }}
        onSeguimientoRegistrado={(planActualizado) => {
          setPlanSeleccionado(planActualizado);
          setMensajeExito('Seguimiento registrado exitosamente.');
          setTimeout(() => setMensajeExito(null), 4000);
          cargarPlanes();
        }}
      />

      {/* Modal Modular de Formulación de Nuevo Plan */}
      <FormularPlanModal
        isOpen={isModalNuevoOpen}
        onClose={() => setIsModalNuevoOpen(false)}
        onPlanCreado={(nuevoPlan) => {
          setMensajeExito(`Plan #${nuevoPlan.id} formulado exitosamente para ${nuevoPlan.estudianteNombre}.`);
          setTimeout(() => setMensajeExito(null), 4000);
          cargarPlanes();
        }}
      />

      {/* Modal de Expediente Integral */}
      <ExpedienteEstudianteModal
        estudianteId={expedienteEstudianteId}
        isOpen={expedienteEstudianteId !== null}
        onClose={() => setExpedienteEstudianteId(null)}
      />
    </div>
  );
};
