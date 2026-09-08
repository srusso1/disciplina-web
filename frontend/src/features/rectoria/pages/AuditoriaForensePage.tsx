import React, { useState, useEffect } from 'react';
import { auditoriaApi } from '../api/auditoriaApi';
import { AuditoriaRegistro, FiltrosAuditoria } from '../types/auditoria.types';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { useLockBodyScroll } from '../../../core/hooks/useLockBodyScroll';
import {
  ShieldAlert,
  Search,
  Calendar,
  Clock,
  Code2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Database,
  ArrowRightLeft,
  RefreshCw,
} from 'lucide-react';

export const AuditoriaForensePage: React.FC = () => {
  const [registros, setRegistros] = useState<AuditoriaRegistro[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [totalElementos, setTotalElementos] = useState<number>(0);

  // Filtros
  const [filtroEntidad, setFiltroEntidad] = useState<string>('');
  const [filtroAccion, setFiltroAccion] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  // Modal para ver diff forense
  const [registroSeleccionado, setRegistroSeleccionado] = useState<AuditoriaRegistro | null>(null);

  // Bloquear scroll de fondo cuando el modal esté abierto
  useLockBodyScroll(Boolean(registroSeleccionado));

  // Soporte para cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && registroSeleccionado) {
        setRegistroSeleccionado(null);
      }
    };
    if (registroSeleccionado) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [registroSeleccionado]);

  const cargarAuditorias = async (page: number = 0) => {
    setCargando(true);
    setError(null);
    try {
      const filtros: FiltrosAuditoria = {
        page,
        size: 15,
        entidad: filtroEntidad || undefined,
        accion: filtroAccion || undefined,
        busqueda: busqueda.trim() || undefined,
        fechaDesde: fechaDesde ? `${fechaDesde}T00:00:00Z` : undefined,
        fechaHasta: fechaHasta ? `${fechaHasta}T23:59:59Z` : undefined,
      };

      const res = await auditoriaApi.listarAuditorias(filtros);
      setRegistros(res.contenido || []);
      setPaginaActual(res.pagina);
      setTotalPaginas(res.totalPaginas || 1);
      setTotalElementos(res.totalElementos || 0);
    } catch (err) {
      console.error('Error al cargar bitácora forense:', err);
      setError(extraerMensajeError(err, 'No fue posible cargar el registro de auditoría.'));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAuditorias(0);
  }, [filtroEntidad, filtroAccion]);

  useEffect(() => {
    if (!registroSeleccionado) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRegistroSeleccionado(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [registroSeleccionado]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(0);
    cargarAuditorias(0);
  };

  const handleLimpiarFiltros = () => {
    setFiltroEntidad('');
    setFiltroAccion('');
    setBusqueda('');
    setFechaDesde('');
    setFechaHasta('');
    setPaginaActual(0);
    cargarAuditorias(0);
  };

  const getBadgeAccion = (accion: string) => {
    switch (accion.toUpperCase()) {
      case 'CREAR':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CAMBIO_ESTADO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ACTUALIZAR':
      case 'ACTUALIZAR_DESCARGO':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REGISTRAR_SEGUIMIENTO':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'IMPORTACION_MASIVA':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const formatearJson = (jsonString?: string) => {
    if (!jsonString) return null;
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Bitácora de Auditoría y Trazabilidad Forense
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Custodia probatoria inmutable y cadena de custodia del debido proceso institucional
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
            Total Eventos: <span className="text-slate-900 font-bold">{totalElementos}</span>
          </div>

          <button
            type="button"
            onClick={() => cargarAuditorias(paginaActual)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition active:scale-[0.98] cursor-pointer"
            title="Refrescar bitácora"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargando ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros de Búsqueda */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <form onSubmit={handleBuscar} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Búsqueda por texto */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por ID entidad, usuario, IP..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
            />
          </div>

          {/* Filtro Entidad */}
          <div>
            <select
              value={filtroEntidad}
              onChange={(e) => setFiltroEntidad(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
            >
              <option value="">-- Todas las Entidades --</option>
              <option value="Incidente">Incidente</option>
              <option value="IncidenteEstudiante">IncidenteEstudiante (Descargos)</option>
              <option value="PlanIntervencion">Plan de Intervención</option>
              <option value="MatriculaEstudiante">Matrículas</option>
            </select>
          </div>

          {/* Filtro Acción */}
          <div>
            <select
              value={filtroAccion}
              onChange={(e) => setFiltroAccion(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
            >
              <option value="">-- Todas las Acciones --</option>
              <option value="CREAR">CREAR</option>
              <option value="CAMBIO_ESTADO">CAMBIO_ESTADO</option>
              <option value="ACTUALIZAR">ACTUALIZAR</option>
              <option value="ACTUALIZAR_DESCARGO">ACTUALIZAR_DESCARGO</option>
              <option value="REGISTRAR_SEGUIMIENTO">REGISTRAR_SEGUIMIENTO</option>
              <option value="IMPORTACION_MASIVA">IMPORTACION_MASIVA</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-3 rounded-xl bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-xs font-semibold shadow-2xs transition active:scale-[0.98] cursor-pointer text-center"
            >
              Filtrar
            </button>
            <button
              type="button"
              onClick={handleLimpiarFiltros}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition cursor-pointer"
            >
              Limpiar
            </button>
          </div>
        </form>

        {/* Rango de Fechas */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-trujillo-sky" />
            <span>Rango de Fechas:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white"
            />
            <span className="text-slate-400">hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Tabla de Registros Forenses */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {cargando ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-trujillo-navy mb-3" />
            <p className="text-xs font-medium">Consultando registros inmutables de auditoría...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-rose-700 bg-rose-50 m-4 rounded-xl border border-rose-200">
            <p className="text-xs font-bold">{error}</p>
          </div>
        ) : registros.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <Database className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">No se encontraron eventos de auditoría</p>
            <p className="text-xs text-slate-400">Intente modificar los filtros o el rango de fechas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3.5">Timestamp</th>
                  <th className="py-2.5 px-3.5">Acción</th>
                  <th className="py-2.5 px-3.5">Entidad Afectada</th>
                  <th className="py-2.5 px-3.5">Usuario Actor</th>
                  <th className="py-2.5 px-3.5">IP Origen</th>
                  <th className="py-2.5 px-3.5 text-center">Registro de Cambios</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {registros.map((r) => (
                  <tr key={r.id} className="even:bg-slate-50/50 hover:bg-slate-100/60 transition-colors">
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Clock className="w-3.5 h-3.5 text-trujillo-sky shrink-0" />
                        <span>{new Date(r.createdAt).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeAccion(
                          r.accion
                        )}`}
                      >
                        {r.accion}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">{r.entidad}</span>
                        <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          #{r.entidadId}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div>
                        <span className="font-semibold text-slate-800 block">
                          {r.usuarioNombreCompleto || r.usuarioUsername}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {r.usuarioUsername} ({r.usuarioRol?.replace('ROLE_', '') || 'SISTEMA'})
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {r.ipOrigen || '127.0.0.1'}
                    </td>

                    <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setRegistroSeleccionado(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-trujillo-ice hover:bg-sky-100 text-trujillo-navy text-[11px] font-bold border border-sky-200 transition active:scale-[0.98] cursor-pointer"
                        title="Inspeccionar detalle del cambio realizado"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Ver Diff</span>
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
          <div className="p-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Página <strong className="text-slate-800">{paginaActual + 1}</strong> de{' '}
              <strong className="text-slate-800">{totalPaginas}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={paginaActual === 0}
                onClick={() => {
                  const nueva = paginaActual - 1;
                  setPaginaActual(nueva);
                  cargarAuditorias(nueva);
                }}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={paginaActual >= totalPaginas - 1}
                onClick={() => {
                  const nueva = paginaActual + 1;
                  setPaginaActual(nueva);
                  cargarAuditorias(nueva);
                }}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalle Forense JSON */}
      {registroSeleccionado && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overscroll-contain"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] min-h-0 flex flex-col overflow-hidden shadow-lg border border-slate-200/80 animate-in fade-in zoom-in-95 duration-150">
            {/* Cabecera del Modal */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-trujillo-navy" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Inspección Forense de Estado #{registroSeleccionado.id}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mutación sobre {registroSeleccionado.entidad} (ID #{registroSeleccionado.entidadId}) por{' '}
                  {registroSeleccionado.usuarioNombreCompleto}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRegistroSeleccionado(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Comparativo */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4 modal-scroll-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Datos Anteriores */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                    <span>Estado Previo (Antes):</span>
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800">
                    {formatearJson(registroSeleccionado.datosAnteriores) || 'null (Creación Inicial)'}
                  </pre>
                </div>

                {/* Datos Nuevos */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span>Estado Posterior (Después):</span>
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </div>
                  <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800">
                    {formatearJson(registroSeleccionado.datosNuevos) || 'null'}
                  </pre>
                </div>
              </div>

              {/* Ficha Técnica del Evento */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Acción:</span>
                  <span className="font-semibold text-slate-800">{registroSeleccionado.accion}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Usuario:</span>
                  <span className="font-semibold text-slate-800">{registroSeleccionado.usuarioUsername}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">IP Cliente:</span>
                  <span className="font-mono text-slate-800">{registroSeleccionado.ipOrigen}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Timestamp:</span>
                  <span className="text-slate-800">{new Date(registroSeleccionado.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setRegistroSeleccionado(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
