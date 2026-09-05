import React, { useState, useEffect, useCallback } from 'react';
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
import {
  Incidente,
  EstadoProceso,
  ClasificacionLey,
  EstadisticasIncidentes,
} from '../../incidentes/types/incidente.types';
import { RegistrarIncidenteModal } from '../../incidentes/components/RegistrarIncidenteModal';
import { DetalleIncidenteModal } from '../../incidentes/components/DetalleIncidenteModal';
import { ExpedienteEstudianteModal } from '../../matriculas/components/ExpedienteEstudianteModal';

export const IncidentesPage: React.FC = () => {
  const { user } = useAuthStore();

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
  const [paginaActual, setPaginaActual] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);
  const [totalElementos, setTotalElementos] = useState<number>(0);

  // Filtros
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filtroTipoLey, setFiltroTipoLey] = useState<string>('');

  // Modales
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState<boolean>(false);
  const [incidenteSeleccionadoId, setIncidenteSeleccionadoId] = useState<number | null>(null);
  const [expedienteEstudianteId, setExpedienteEstudianteId] = useState<number | null>(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
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
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'EN_INDAGACION':
        return 'bg-sky-100 text-trujillo-navy border-sky-200';
      case 'CITACION_PADRES':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'EN_INTERVENCION':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CERRADO':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
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

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida Operativo */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-trujillo-ice text-trujillo-navy text-xs font-semibold border border-sky-200">
            <ShieldAlert className="w-3.5 h-3.5 text-trujillo-sky" />
            <span>Debido Proceso & Convivencia Escolar (Ley 1620)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-trujillo-dark mt-2 tracking-tight">
            Bitacora General de Incidentes
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Bienvenido, <span className="font-semibold text-slate-700">{user?.nombres} {user?.apellidos}</span>. Registro y seguimiento formativo de casos individuales y colectivos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalRegistroAbierto(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-sm font-semibold shadow-md shadow-trujillo-navy/20 transition-all duration-150 active:scale-[0.98] cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-trujillo-sky" />
          <span>Registrar Nuevo Incidente</span>
        </button>
      </div>

      {/* Tarjetas de Semaforo de Convivencia Institucional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Casos */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-trujillo-navy mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Expedientes 2026</span>
            <div className="p-2 rounded-xl bg-trujillo-ice">
              <FileText className="w-4 h-4 text-trujillo-navy" />
            </div>
          </div>
          <p className="text-3xl font-black text-trujillo-dark">{estadisticas.totalIncidentes}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-trujillo-laurel" />
            <span>{estadisticas.enSeguimiento} en proceso activo</span>
          </p>
        </div>

        {/* Tipo I - Leve */}
        <div className="bg-white border border-yellow-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-yellow-400">
          <div className="flex items-center justify-between text-yellow-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faltas Tipo I (Leves)</span>
            <div className="p-2 rounded-xl bg-yellow-100/70">
              <AlertTriangle className="w-4 h-4 text-yellow-700" />
            </div>
          </div>
          <p className="text-3xl font-black text-yellow-900">{estadisticas.tipoI}</p>
          <p className="text-xs text-slate-500 mt-1">Manejo formativo y pedagogico</p>
        </div>

        {/* Tipo II - Grave */}
        <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-orange-400">
          <div className="flex items-center justify-between text-orange-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faltas Tipo II (Graves)</span>
            <div className="p-2 rounded-xl bg-orange-100/70">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-orange-900">{estadisticas.tipoII}</p>
          <p className="text-xs text-slate-500 mt-1">Citacion a acudientes y descargos</p>
        </div>

        {/* Tipo III - Gravisima */}
        <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-rose-400">
          <div className="flex items-center justify-between text-rose-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faltas Tipo III (Gravisimas)</span>
            <div className="p-2 rounded-xl bg-rose-100/70">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-900">{estadisticas.tipoIII}</p>
          <p className="text-xs text-slate-500 mt-1">Ruta de Atencion Integral externa</p>
        </div>
      </div>

      {/* Barra de Filtros y Busqueda */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleBuscar} className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante, documento o hechos..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:bg-white transition placeholder:text-slate-400"
          />
        </form>

        <div className="w-full md:w-auto flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaActual(0);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-trujillo-sky text-slate-700 font-medium"
          >
            <option value="">Todos los Estados</option>
            <option value="REPORTADO">Reportado</option>
            <option value="EN_INDAGACION">En Indagacion</option>
            <option value="CITACION_PADRES">Citacion Acudientes</option>
            <option value="EN_INTERVENCION">En Intervencion</option>
            <option value="CERRADO">Cerrado</option>
          </select>

          <select
            value={filtroTipoLey}
            onChange={(e) => {
              setFiltroTipoLey(e.target.value);
              setPaginaActual(0);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-trujillo-sky text-slate-700 font-medium"
          >
            <option value="">Clasificación Ley 1620</option>
            <option value="TIPO_I">Tipo I (Leves)</option>
            <option value="TIPO_II">Tipo II (Graves)</option>
            <option value="TIPO_III">Tipo III (Gravísimas)</option>
          </select>

          <button
            type="button"
            onClick={() => cargarDatos()}
            className="p-2 text-slate-500 hover:text-trujillo-navy hover:bg-slate-100 rounded-xl transition cursor-pointer"
            title="Refrescar lista"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lista / Tabla de Incidentes */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-trujillo-sky mb-2" />
            <p className="text-sm font-medium">Consultando bitacora institucional...</p>
          </div>
        ) : incidentes.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-base font-bold text-slate-700">No se encontraron expedientes</p>
            <p className="text-xs text-slate-400 mt-1">
              No hay registros que coincidan con los filtros aplicados o aun no se han creado incidentes.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Fecha / Lugar</th>
                  <th className="py-3.5 px-4">Estudiantes Involucrados (Snapshot)</th>
                  <th className="py-3.5 px-4">Docente Reporta</th>
                  <th className="py-3.5 px-4">Estado del Proceso</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {incidentes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-trujillo-navy">
                      #{inc.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {inc.fechaIncidente}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {inc.lugar.nombre} {inc.horaIncidente && `(${inc.horaIncidente})`}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5 max-w-md">
                        {inc.involucrados.map((inv) => (
                          <div
                            key={inv.id}
                            className="flex items-center gap-2 text-xs flex-wrap"
                          >
                            <button
                              type="button"
                              onClick={() => setExpedienteEstudianteId(inv.estudianteId)}
                              className="font-bold text-slate-800 hover:text-trujillo-navy hover:underline cursor-pointer text-left transition"
                              title="Ver expediente e historial del estudiante"
                            >
                              {inv.nombreCompleto}
                            </button>

                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {inv.gradoMomento}-{inv.grupoMomento}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getBadgeRol(
                                inv.rolEstudiante
                              )}`}
                            >
                              {inv.rolEstudiante}
                            </span>
                            {inv.falta && (
                              <span className="text-[10px] font-semibold text-slate-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                {inv.falta.codigo} ({inv.falta.clasificacionLey})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 text-xs">
                        {inc.docenteReporta.nombreCompleto}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {inc.docenteReporta.areaDesempeno}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeEstado(
                          inc.estadoProceso
                        )}`}
                      >
                        {inc.estadoProceso}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setIncidenteSeleccionadoId(inc.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-trujillo-ice text-trujillo-navy hover:bg-sky-100 text-xs font-bold border border-sky-200 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-trujillo-sky" />
                        <span>Expediente</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginacion */}
        {totalPaginas > 1 && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Mostrando pagina <strong>{paginaActual + 1}</strong> de{' '}
              <strong>{totalPaginas}</strong> ({totalElementos} expedientes en total)
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPaginaActual((p) => Math.max(0, p - 1))}
                disabled={paginaActual === 0}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition"
                title="Pagina anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPaginaActual((p) => Math.min(totalPaginas - 1, p + 1))}
                disabled={paginaActual >= totalPaginas - 1}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition"
                title="Pagina siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <RegistrarIncidenteModal
        isOpen={modalRegistroAbierto}
        onClose={() => setModalRegistroAbierto(false)}
        onSuccess={() => {
          setPaginaActual(0);
          cargarDatos();
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

