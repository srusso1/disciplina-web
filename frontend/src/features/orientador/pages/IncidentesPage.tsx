import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../core/auth/useAuthStore';
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
  const { user } = useAuthStore();
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
    <div className="space-y-5">
      {/* Banner de Bienvenida Operativo */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-trujillo-ice text-trujillo-navy text-xs font-semibold border border-sky-200">
            <ShieldAlert size={16} className="text-trujillo-sky" />
            <span>Debido Proceso & Convivencia Escolar (Ley 1620)</span>
          </div>
          <h1 className="text-xl font-bold text-trujillo-dark mt-2 tracking-tight">
            Bitácora General de Incidentes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bienvenido, <span className="font-semibold text-slate-700">{user?.nombres} {user?.apellidos}</span>. Registro y seguimiento formativo de casos individuales y colectivos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalRegistroAbierto(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-trujillo-navy hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors active:scale-[0.98] cursor-pointer shrink-0"
        >
          <PlusCircle size={16} className="text-trujillo-sky" />
          <span>Registrar Nuevo Incidente</span>
        </button>
      </div>

      {/* Tarjetas de Semáforo de Convivencia Institucional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Casos */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-trujillo-navy mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Expedientes {new Date().getFullYear()}</span>
            <div className="p-1.5 rounded-lg bg-trujillo-ice">
              <FileText size={16} className="text-trujillo-navy" />
            </div>
          </div>
          <p className="text-2xl font-bold text-trujillo-dark">{estadisticas.totalIncidentes}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <CheckCircle2 size={14} className="text-trujillo-laurel" />
            <span>{estadisticas.enSeguimiento} en proceso activo</span>
          </p>
        </div>

        {/* Tipo I - Leve */}
        <div className="bg-white border border-slate-200/80 border-l-4 border-l-yellow-500 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-yellow-800 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Faltas Tipo I (Leves)</span>
            <div className="p-1.5 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200/60">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{estadisticas.tipoI}</p>
          <p className="text-[11px] text-slate-500 mt-1">Manejo formativo y pedagógico</p>
        </div>

        {/* Tipo II - Grave */}
        <div className="bg-white border border-slate-200/80 border-l-4 border-l-orange-500 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-orange-800 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Faltas Tipo II (Graves)</span>
            <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200/60">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{estadisticas.tipoII}</p>
          <p className="text-[11px] text-slate-500 mt-1">Citación a acudientes y descargos</p>
        </div>

        {/* Tipo III - Gravísima */}
        <div className="bg-white border border-slate-200/80 border-l-4 border-l-rose-600 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Faltas Tipo III (Gravísimas)</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200/60">
              <ShieldAlert size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{estadisticas.tipoIII}</p>
          <p className="text-[11px] text-slate-500 mt-1">Ruta de Atención Integral externa</p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleBuscar} className="w-full md:w-96 relative">
          <Search size={16} className="text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante, documento o hechos..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-trujillo-navy/20 focus:border-trujillo-navy focus:bg-white transition placeholder:text-slate-400 text-slate-800"
          />
        </form>

        <div className="w-full md:w-auto flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter size={14} />
            <span>Filtrar:</span>
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaActual(0);
            }}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-trujillo-navy/20 focus:border-trujillo-navy text-slate-700 font-medium"
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
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-trujillo-navy/20 focus:border-trujillo-navy text-slate-700 font-medium"
          >
            <option value="">Clasificación Ley 1620</option>
            <option value="TIPO_I">Tipo I (Leves)</option>
            <option value="TIPO_II">Tipo II (Graves)</option>
            <option value="TIPO_III">Tipo III (Gravísimas)</option>
          </select>

          <button
            type="button"
            onClick={() => cargarDatos()}
            className="p-1.5 text-slate-500 hover:text-trujillo-navy hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Refrescar lista"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Lista / Tabla de Incidentes */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        {errorCarga && (
          <div className="p-3.5 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-600 shrink-0" />
              <span>{errorCarga}</span>
            </div>
            <button
              type="button"
              onClick={() => cargarDatos()}
              className="text-xs font-bold text-rose-700 underline hover:text-rose-900 ml-4 cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 size={24} className="animate-spin text-trujillo-sky mb-2" />
            <p className="text-xs font-medium">Consultando bitácora institucional...</p>
          </div>
        ) : incidentes.length === 0 ? (
          <div className="py-14 text-center text-slate-500">
            <FileText size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No se encontraron expedientes</p>
            <p className="text-xs text-slate-400 mt-0.5">
              No hay registros que coincidan con los filtros aplicados o aún no se han creado incidentes.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-3.5">ID</th>
                  <th className="py-2.5 px-3.5">Fecha / Lugar</th>
                  <th className="py-2.5 px-3.5">Estudiantes Involucrados (Curso al Momento del Hecho)</th>
                  <th className="py-2.5 px-3.5">Docente Reporta</th>
                  <th className="py-2.5 px-3.5">Estado del Proceso</th>
                  <th className="py-2.5 px-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {incidentes.map((inc) => (
                  <tr key={inc.id} className="even:bg-slate-50/50 hover:bg-slate-100/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-trujillo-navy">
                      #{inc.id}
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{inc.fechaIncidente}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {inc.lugar.nombre} {inc.horaIncidente && `(${inc.horaIncidente})`}
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
                              className="font-bold text-slate-800 hover:text-trujillo-navy hover:underline cursor-pointer text-left transition text-xs"
                              title="Ver expediente e historial del estudiante"
                            >
                              {inv.nombreCompleto}
                            </button>

                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
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
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getBadgeEstado(
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-trujillo-ice text-trujillo-navy hover:bg-sky-100 text-xs font-semibold border border-sky-200 transition cursor-pointer"
                      >
                        <Eye size={14} className="text-trujillo-sky" />
                        <span>Expediente</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

