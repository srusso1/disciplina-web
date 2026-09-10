import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FileText,
  Clock,
  PlusCircle,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Loader2,
  Calendar,
} from 'lucide-react';
import { incidentesApi } from '../../incidentes/api/incidentesApi';
import { extraerMensajeError } from '../../../core/api/apiClient';
import {
  Incidente,
  EstadoProceso,
  ClasificacionLey,
  EstadisticasIncidentes,
  NarrativaProcesada,
} from '../../incidentes/types/incidente.types';
import { RegistrarIncidenteModal } from '../../incidentes/components/RegistrarIncidenteModal';
import { DetalleIncidenteModal } from '../../incidentes/components/DetalleIncidenteModal';
import { ExpedienteEstudianteModal } from '../../matriculas/components/ExpedienteEstudianteModal';

export const IncidentesPage: React.FC = () => {
  const location = useLocation();

  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasIncidentes>({
    totalIncidentes: 0,
    tipoI: 0,
    tipoII: 0,
    tipoIII: 0,
    enSeguimiento: 0,
    cerrados: 0,
  });

  const [cargando, setCargando] = useState<boolean>(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);
  const [totalElementos, setTotalElementos] = useState<number>(0);

  // Filtros
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filtroTipoLey, setFiltroTipoLey] = useState<string>('');

  // Modales
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState<boolean>(false);
  const [datosPrellenadosIa, setDatosPrellenadosIa] = useState<NarrativaProcesada | null>(null);
  const [incidenteSeleccionadoId, setIncidenteSeleccionadoId] = useState<number | null>(null);
  const [expedienteEstudianteId, setExpedienteEstudianteId] = useState<number | null>(null);

  // Detectar transferencia reactiva desde Asistente IA (CU-05 -> CU-04)
  useEffect(() => {
    const state = location.state as { prefill?: NarrativaProcesada; autoOpenModal?: boolean } | null;
    if (state?.prefill && state?.autoOpenModal) {
      setDatosPrellenadosIa(state.prefill);
      setModalRegistroAbierto(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const [resLista, resStats] = await Promise.all([
        incidentesApi.listar({
          page: paginaActual,
          size: 10,
          estado: filtroEstado ? (filtroEstado as EstadoProceso) : undefined,
          tipoLey: filtroTipoLey ? (filtroTipoLey as ClasificacionLey) : undefined,
          busqueda: busqueda.trim() || undefined,
        }),
        incidentesApi.obtenerEstadisticas(),
      ]);

      setIncidentes(resLista.contenido);
      setTotalPaginas(resLista.totalPaginas);
      setTotalElementos(resLista.totalElementos);
      setEstadisticas(resStats);
    } catch (err) {
      console.error('Error al cargar datos de convivencia:', err);
      setErrorCarga(extraerMensajeError(err, 'No fue posible cargar la bitácora de convivencia escolar.'));
    } finally {
      setCargando(false);
    }
  }, [paginaActual, filtroEstado, filtroTipoLey, busqueda]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(0);
    cargarDatos();
  };

  const getBadgeEstado = (estado: EstadoProceso) => {
    switch (estado) {
      case 'REPORTADO':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'EN_INDAGACION':
        return 'bg-sky-50 text-trujillo-navy border-sky-200';
      case 'CITACION_PADRES':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'EN_INTERVENCION':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'CERRADO':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getBadgeRol = (rol: string) => {
    switch (rol) {
      case 'AGRESOR_PRINCIPAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PARTICIPE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'VICTIMA':
        return 'bg-sky-50 text-trujillo-navy border-sky-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getBadgeTipoLey = (tipo?: string) => {
    switch (tipo) {
      case 'TIPO_I':
        return 'bg-convivencia-tipo1-bg text-convivencia-tipo1-text border-convivencia-tipo1-border';
      case 'TIPO_II':
        return 'bg-convivencia-tipo2-bg text-convivencia-tipo2-text border-convivencia-tipo2-border';
      case 'TIPO_III':
        return 'bg-convivencia-tipo3-bg text-convivencia-tipo3-text border-convivencia-tipo3-border';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Título Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-700" /> Bitácora General de Incidentes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Registro, tipificación y debido proceso de convivencia escolar (Ley 1620).</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalRegistroAbierto(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Nuevo Incidente</span>
          </button>
        </div>
      </div>

      {/* Tarjetas KPI Compactas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Casos */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Expedientes {new Date().getFullYear()}
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-tight mt-1">{estadisticas.totalIncidentes}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{estadisticas.enSeguimiento} en proceso activo</span>
          </p>
        </div>

        {/* Tipo I */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500" /> Tipo I (Leves)
            </span>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-tight mt-1">{estadisticas.tipoI}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Manejo formativo institucional</p>
        </div>

        {/* Tipo II */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Tipo II (Graves)
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-tight mt-1">{estadisticas.tipoII}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Citación acudientes y descargos</p>
        </div>

        {/* Tipo III */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" /> Tipo III (Gravísimas)
            </span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-tight mt-1">{estadisticas.tipoIII}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Ruta de Atención Integral externa</p>
        </div>
      </div>

      {/* Barra de Herramientas y Filtros (Toolbar) */}
      <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <form onSubmit={handleBuscar} className="w-full sm:w-80 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante, documento o hechos..."
            className="w-full pl-9 pr-3 h-9 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition placeholder:text-slate-400 text-slate-800"
          />
        </form>

        <div className="w-full sm:w-auto flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaActual(0);
            }}
            className="h-9 px-2.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 font-medium"
          >
            <option value="">Todos los Estados</option>
            <option value="REPORTADO">Reportado</option>
            <option value="EN_INDAGACION">En Indagación</option>
            <option value="CITACION_PADRES">Citación Acudientes</option>
            <option value="EN_INTERVENCION">En Intervención</option>
            <option value="CERRADO">Cerrado</option>
          </select>

          <select
            value={filtroTipoLey}
            onChange={(e) => {
              setFiltroTipoLey(e.target.value);
              setPaginaActual(0);
            }}
            className="h-9 px-2.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 font-medium"
          >
            <option value="">Clasificación Ley 1620</option>
            <option value="TIPO_I">Tipo I (Leves)</option>
            <option value="TIPO_II">Tipo II (Graves)</option>
            <option value="TIPO_III">Tipo III (Gravísimas)</option>
          </select>

          <button
            type="button"
            onClick={() => cargarDatos()}
            className="h-9 px-2.5 text-slate-600 hover:text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 rounded-md transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Refrescar lista"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Tabla de Incidentes */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {errorCarga && (
          <div className="p-3 bg-red-50 border-b border-red-200 text-red-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorCarga}</span>
            </div>
            <button
              type="button"
              onClick={() => cargarDatos()}
              className="text-xs font-semibold text-red-700 underline hover:text-red-900 ml-4 cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3.5">ID</th>
                <th className="py-2.5 px-3.5">Fecha / Hora / Lugar</th>
                <th className="py-2.5 px-3.5">Estudiantes Implicados</th>
                <th className="py-2.5 px-3.5">Docente Reporta</th>
                <th className="py-2.5 px-3.5">Estado del Proceso</th>
                <th className="py-2.5 px-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-xs font-medium text-slate-600">Consultando bitácora institucional...</p>
                  </td>
                </tr>
              ) : incidentes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium text-slate-700">No se encontraron incidentes registrados</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ajusta los filtros de búsqueda o ingresa un nuevo registro en el sistema.
                    </p>
                  </td>
                </tr>
              ) : (
                incidentes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold font-mono text-slate-800">
                      #{inc.id}
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inc.fechaIncidente}</span>
                        {inc.horaIncidente && <span className="text-slate-400 font-normal">({inc.horaIncidente})</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {inc.lugar.nombre}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="space-y-1 max-w-md">
                        {inc.involucrados.map((inv) => (
                          <div
                            key={inv.id}
                            className="flex items-center gap-1.5 text-xs flex-wrap"
                          >
                            <button
                              type="button"
                              onClick={() => setExpedienteEstudianteId(inv.estudianteId)}
                              className="font-medium text-slate-800 hover:text-blue-700 hover:underline cursor-pointer text-left transition text-xs"
                              title="Ver expediente e historial del estudiante"
                            >
                              {inv.nombreCompleto}
                            </button>

                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                              {inv.gradoMomento}-{inv.grupoMomento}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getBadgeRol(
                                inv.rolEstudiante
                              )}`}
                            >
                              {inv.rolEstudiante}
                            </span>
                            {inv.falta && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getBadgeTipoLey(
                                  inv.falta.clasificacionLey
                                )}`}
                              >
                                {inv.falta.codigo} ({inv.falta.clasificacionLey})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="font-medium text-slate-800 text-xs">
                        {inc.docenteReporta.nombreCompleto}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {inc.docenteReporta.areaDesempeno}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getBadgeEstado(
                          inc.estadoProceso
                        )}`}
                      >
                        {inc.estadoProceso}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setIncidenteSeleccionadoId(inc.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Expediente</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Mostrando página <strong>{paginaActual + 1}</strong> de{' '}
              <strong>{totalPaginas}</strong> ({totalElementos} expedientes)
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPaginaActual((p) => Math.max(0, p - 1))}
                disabled={paginaActual === 0}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                title="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPaginaActual((p) => Math.min(totalPaginas - 1, p + 1))}
                disabled={paginaActual >= totalPaginas - 1}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                title="Página siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <RegistrarIncidenteModal
        isOpen={modalRegistroAbierto}
        initialData={datosPrellenadosIa}
        onClose={() => {
          setModalRegistroAbierto(false);
          setDatosPrellenadosIa(null);
        }}
        onSuccess={() => {
          setPaginaActual(0);
          cargarDatos();
          setDatosPrellenadosIa(null);
        }}
      />

      <DetalleIncidenteModal
        incidenteId={incidenteSeleccionadoId}
        isOpen={incidenteSeleccionadoId !== null}
        onClose={() => setIncidenteSeleccionadoId(null)}
        onUpdated={() => cargarDatos()}
      />

      <ExpedienteEstudianteModal
        estudianteId={expedienteEstudianteId}
        isOpen={expedienteEstudianteId !== null}
        onClose={() => setExpedienteEstudianteId(null)}
      />
    </div>
  );
};

