import React, { useState, useEffect } from 'react';
import { auditoriaApi } from '../api/auditoriaApi';
import { AuditoriaRegistro, FiltrosAuditoria } from '../types/auditoria.types';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { useLockBodyScroll } from '../../../core/hooks/useLockBodyScroll';
import {
  ShieldAlert,
  Search,
  Clock,
  Code2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  ArrowRightLeft,
  RefreshCw,
  FileText,
} from 'lucide-react';

export const AuditoriaForensePage: React.FC = () => {
  const [registros, setRegistros] = useState<AuditoriaRegistro[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [totalElementos, setTotalElementos] = useState<number>(0);
  const [tamanoPagina, setTamanoPagina] = useState<number>(15);

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

  const cargarAuditorias = async (page: number = 0, size: number = tamanoPagina) => {
    setCargando(true);
    setError(null);
    try {
      const filtros: FiltrosAuditoria = {
        page,
        size,
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
    cargarAuditorias(0, tamanoPagina);
  }, [filtroEntidad, filtroAccion, tamanoPagina]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(0);
    cargarAuditorias(0, tamanoPagina);
  };

  const handleLimpiarFiltros = () => {
    setFiltroEntidad('');
    setFiltroAccion('');
    setBusqueda('');
    setFechaDesde('');
    setFechaHasta('');
    setPaginaActual(0);
    cargarAuditorias(0, tamanoPagina);
  };

  const handleCambiarTamano = (nuevoTamano: number) => {
    setTamanoPagina(nuevoTamano);
    setPaginaActual(0);
    cargarAuditorias(0, nuevoTamano);
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
    <div className="space-y-4 pb-8">
      {/* Barra de Título Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-700" />
            Bitácora de Auditoría Forense
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Custodia probatoria inmutable y trazabilidad del debido proceso institucional.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => cargarAuditorias(paginaActual)}
            disabled={cargando}
            className="h-9 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargando ? 'animate-spin text-blue-700' : 'text-slate-500'}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Contenedor de Tabla con Toolbar Integrado de 1 sola línea */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Toolbar en 1 sola línea */}
        <div className="p-2.5 border-b border-slate-200 bg-slate-50/60">
          <form onSubmit={handleBuscar} className="flex flex-wrap items-center gap-2">
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por ID, usuario, IP..."
                className="w-full h-9 pl-8 pr-7 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-800"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtro Entidad */}
            <select
              value={filtroEntidad}
              onChange={(e) => setFiltroEntidad(e.target.value)}
              className="h-9 px-2.5 text-xs rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="">Todas las Entidades</option>
              <option value="Incidente">Incidente</option>
              <option value="IncidenteEstudiante">IncidenteEstudiante</option>
              <option value="PlanIntervencion">Plan de Intervención</option>
              <option value="MatriculaEstudiante">Matrícula</option>
            </select>

            {/* Filtro Acción */}
            <select
              value={filtroAccion}
              onChange={(e) => setFiltroAccion(e.target.value)}
              className="h-9 px-2.5 text-xs rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="">Todas las Acciones</option>
              <option value="CREAR">CREAR</option>
              <option value="CAMBIO_ESTADO">CAMBIO_ESTADO</option>
              <option value="ACTUALIZAR">ACTUALIZAR</option>
              <option value="ACTUALIZAR_DESCARGO">ACTUALIZAR_DESCARGO</option>
              <option value="REGISTRAR_SEGUIMIENTO">REGISTRAR_SEGUIMIENTO</option>
              <option value="IMPORTACION_MASIVA">IMPORTACION_MASIVA</option>
            </select>

            {/* Rango de Fechas */}
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="h-9 text-xs px-2 rounded-md border border-slate-300 bg-white text-slate-700"
                title="Fecha inicial"
              />
              <span>-</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="h-9 text-xs px-2 rounded-md border border-slate-300 bg-white text-slate-700"
                title="Fecha final"
              />
            </div>

            {/* Botones */}
            <button
              type="submit"
              className="h-9 px-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Filtrar</span>
            </button>

            {(busqueda || filtroEntidad || filtroAccion || fechaDesde || fechaHasta) && (
              <button
                type="button"
                onClick={handleLimpiarFiltros}
                className="h-9 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-md flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}

            <div className="text-xs text-slate-500 font-medium ml-auto">
              Total: <strong className="text-slate-700">{totalElementos}</strong> eventos
            </div>
          </form>
        </div>

        {/* Tabla de Registros Forenses */}
        <div className="overflow-x-auto relative">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Fecha / Hora</th>
                <th className="py-2.5 px-3">Usuario Actor</th>
                <th className="py-2.5 px-3">Dirección IP</th>
                <th className="py-2.5 px-3">Acción</th>
                <th className="py-2.5 px-3">Entidad</th>
                <th className="py-2.5 px-3 text-center">Detalle del Cambio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-7 h-7 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-xs font-medium text-slate-600">Consultando registros inmutables de auditoría...</p>
                  </td>
                </tr>
              ) : registros.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium text-slate-700">No se encontraron eventos de auditoría</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ajusta los filtros o el rango de fechas para consultar registros históricos.
                    </p>
                  </td>
                </tr>
              ) : (
                registros.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{new Date(r.createdAt).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {r.usuarioNombreCompleto || r.usuarioUsername}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {r.usuarioUsername} ({r.usuarioRol?.replace('ROLE_', '') || 'SISTEMA'})
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {r.ipOrigen || '127.0.0.1'}
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getBadgeAccion(
                          r.accion
                        )}`}
                      >
                        {r.accion}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-800">{r.entidad}</span>
                        <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                          #{r.entidadId}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setRegistroSeleccionado(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                        title="Inspeccionar diff JSON forense"
                      >
                        <Code2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Ver Diff</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!cargando && totalElementos > 0 && (
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                Mostrando <strong className="text-slate-700">{paginaActual * tamanoPagina + 1}</strong> a{' '}
                <strong className="text-slate-700">
                  {Math.min(totalElementos, (paginaActual + 1) * tamanoPagina)}
                </strong>{' '}
                de <strong className="text-slate-700">{totalElementos}</strong> eventos
              </span>
              <div className="h-3.5 w-[1px] bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-1">
                <span>Por pág:</span>
                <select
                  value={tamanoPagina}
                  onChange={(e) => handleCambiarTamano(Number(e.target.value))}
                  className="h-7 px-1.5 rounded border border-slate-300 bg-white text-xs text-slate-700"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span>
                Página <strong className="text-slate-700">{paginaActual + 1}</strong> de{' '}
                <strong className="text-slate-700">{totalPaginas}</strong>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Primera página"
                  disabled={paginaActual === 0}
                  onClick={() => {
                    setPaginaActual(0);
                    cargarAuditorias(0, tamanoPagina);
                  }}
                  className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  title="Página anterior"
                  disabled={paginaActual === 0}
                  onClick={() => {
                    const nueva = paginaActual - 1;
                    setPaginaActual(nueva);
                    cargarAuditorias(nueva, tamanoPagina);
                  }}
                  className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  title="Página siguiente"
                  disabled={paginaActual >= totalPaginas - 1}
                  onClick={() => {
                    const nueva = paginaActual + 1;
                    setPaginaActual(nueva);
                    cargarAuditorias(nueva, tamanoPagina);
                  }}
                  className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  title="Última página"
                  disabled={paginaActual >= totalPaginas - 1}
                  onClick={() => {
                    const ultima = totalPaginas - 1;
                    setPaginaActual(ultima);
                    cargarAuditorias(ultima, tamanoPagina);
                  }}
                  className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] min-h-0 flex flex-col overflow-hidden shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Cabecera del Modal */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-700" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Inspección Forense de Mutación #{registroSeleccionado.id}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registro sobre {registroSeleccionado.entidad} (#{registroSeleccionado.entidadId}) por{' '}
                  {registroSeleccionado.usuarioNombreCompleto || registroSeleccionado.usuarioUsername}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRegistroSeleccionado(null)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido Comparativo */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3 modal-scroll-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Datos Anteriores */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                    <span>Estado Previo (Antes):</span>
                    <ArrowRightLeft className="w-3 h-3" />
                  </div>
                  <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-md text-[11px] font-mono overflow-x-auto max-h-64 border border-slate-800">
                    {formatearJson(registroSeleccionado.datosAnteriores) || 'null (Creación Inicial)'}
                  </pre>
                </div>

                {/* Datos Nuevos */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    <span>Estado Posterior (Después):</span>
                    <ArrowRightLeft className="w-3 h-3" />
                  </div>
                  <pre className="p-2.5 bg-slate-900 text-emerald-300 rounded-md text-[11px] font-mono overflow-x-auto max-h-64 border border-slate-800">
                    {formatearJson(registroSeleccionado.datosNuevos) || 'null'}
                  </pre>
                </div>
              </div>

              {/* Ficha Técnica del Evento */}
              <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Acción:</span>
                  <span className="font-semibold text-slate-800">{registroSeleccionado.accion}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Usuario:</span>
                  <span className="font-semibold text-slate-800">{registroSeleccionado.usuarioUsername}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">IP Origen:</span>
                  <span className="font-mono text-slate-800">{registroSeleccionado.ipOrigen}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hora:</span>
                  <span className="text-slate-800">{new Date(registroSeleccionado.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setRegistroSeleccionado(null)}
                className="h-8 px-3 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
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
