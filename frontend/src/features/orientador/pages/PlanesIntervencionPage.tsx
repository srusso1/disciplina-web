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
  FolderOpen,
  FileText,
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
    <div className="space-y-4 pb-12">
      {/* Barra de Título Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-slate-700" /> Planes de Intervención Pedagógica
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de acuerdos formativos, compromisos familiares y seguimiento restaurativo.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalNuevoOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Formular Nuevo Plan</span>
          </button>
        </div>
      </div>

      {/* Tarjetas KPI Compactas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Total Planes
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-tight mt-1">{totalElementos}</p>
          <p className="text-xs text-slate-500 mt-0.5">Registros formulados</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> En Seguimiento
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-tight mt-1">{metricas.enSeguimiento}</p>
          <p className="text-xs text-slate-500 mt-0.5">Planes activos en curso</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Cumplidos
            </span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-tight mt-1">{metricas.cumplidos}</p>
          <p className="text-xs text-slate-500 mt-0.5">Metas alcanzadas</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Incumplidos
            </span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-tight mt-1">{metricas.incumplidos}</p>
          <p className="text-xs text-slate-500 mt-0.5">Requieren escalamiento</p>
        </div>
      </div>

      {/* Barra de Filtros (Toolbar) */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por estudiante, documento o diagnóstico..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-8 h-10 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-800"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
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
              className="h-10 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 font-medium"
            >
              <option value="">Todos los Estados</option>
              <option value="EN_SEGUIMIENTO">En Seguimiento</option>
              <option value="CUMPLIDO">Cumplido</option>
              <option value="INCUMPLIDO">Incumplido</option>
              <option value="BORRADOR">Borrador</option>
            </select>

            <button
              type="submit"
              className="h-10 px-4 bg-[#1E3A8A] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>Filtrar</span>
            </button>

            {(busquedaAplicada || filtroEstado) && (
              <button
                type="button"
                onClick={handleLimpiarFiltros}
                className="h-10 px-3.5 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Alertas */}
      {mensajeExito && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabla de Planes */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-4">Radicado / Estudiante</th>
                <th className="py-3 px-4">Diagnóstico y Compromisos</th>
                <th className="py-3 px-4">Próximo Seguimiento</th>
                <th className="py-3 px-4 text-center">Seguimientos</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-medium text-slate-600">Cargando planes de intervención...</p>
                  </td>
                </tr>
              ) : planes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="text-base font-medium text-slate-700">No se encontraron planes de intervención</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Ajusta los filtros o formula un nuevo plan pedagógico con el botón superior.
                    </p>
                  </td>
                </tr>
              ) : (
                planes.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-xs font-bold text-slate-700 border border-slate-200">
                          #{plan.id}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{plan.estudianteNombre}</div>
                          <div className="text-xs font-mono text-slate-400">{plan.estudianteDocumento}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <div className="font-medium text-slate-800 text-sm line-clamp-1">
                        <span className="text-slate-500 font-semibold">Diag: </span>
                        {plan.diagnosticoSituacional}
                      </div>
                      <div className="text-slate-500 text-xs line-clamp-1 mt-0.5">
                        <span className="text-slate-400 font-semibold">Acciones: </span>
                        {plan.accionesAcordadas}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {plan.fechaProximoSeguimiento ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{plan.fechaProximoSeguimiento}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Sin fecha</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium font-mono border border-slate-200">
                        {plan.seguimientos?.length || 0} notas
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeEstado(
                          plan.estado
                        )}`}
                      >
                        {plan.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAbrirDetalle(plan)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer shadow-2xs"
                          title="Ver detalle y registrar evolución pedagógica"
                        >
                          <FileEdit className="w-3.5 h-3.5 text-slate-500" />
                          <span>Seguimiento</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpedienteEstudianteId(plan.estudianteId)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer shadow-2xs"
                          title="Abrir expediente escolar integral del estudiante"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Expediente</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!cargando && totalPaginas > 1 && (
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600 font-medium">
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
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
              >
                <option value={10}>10 / pág</option>
                <option value={20}>20 / pág</option>
                <option value={50}>50 / pág</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaginaActual(0)}
                  disabled={paginaActual === 0}
                  className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual((p) => Math.max(0, p - 1))}
                  disabled={paginaActual === 0}
                  className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-bold text-slate-800 text-xs">
                  {paginaActual + 1} / {totalPaginas}
                </span>
                <button
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas - 1, p + 1))}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual(totalPaginas - 1)}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 cursor-pointer"
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
