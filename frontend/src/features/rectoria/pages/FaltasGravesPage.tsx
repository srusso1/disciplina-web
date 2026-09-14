import React, { useState, useEffect, useCallback } from 'react';
import { incidentesApi } from '../../incidentes/api/incidentesApi';
import { Incidente, PaginaIncidentes, EstadoProceso } from '../../incidentes/types/incidente.types';
import { DetalleIncidenteModal } from '../../incidentes/components/DetalleIncidenteModal';
import { extraerMensajeError } from '../../../core/api/apiClient';
import {
  ShieldAlert,
  FileDown,
  Search,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';

export const FaltasGravesPage: React.FC = () => {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [totalElementos, setTotalElementos] = useState<number>(0);

  // Filtros
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoProceso | ''>('');

  // Modal de Detalle
  const [incidenteSeleccionadoId, setIncidenteSeleccionadoId] = useState<number | null>(null);
  const [descargandoId, setDescargandoId] = useState<number | null>(null);

  const cargarFaltasTipoIII = useCallback(async (page: number = 0) => {
    setCargando(true);
    setError(null);
    try {
      const res: PaginaIncidentes = await incidentesApi.listar({
        page,
        size: 10,
        tipoLey: 'TIPO_III',
        estado: filtroEstado ? (filtroEstado as EstadoProceso) : undefined,
        busqueda: busqueda.trim() || undefined,
      });

      setIncidentes(res.contenido || []);
      setPaginaActual(res.pagina);
      setTotalPaginas(res.totalPaginas || 1);
      setTotalElementos(res.totalElementos || 0);
    } catch (err: unknown) {
      console.error('Error al cargar faltas Tipo III:', err);
      setError(extraerMensajeError(err, 'No fue posible consultar los casos de Tipo III.'));
    } finally {
      setCargando(false);
    }
  }, [busqueda, filtroEstado]);

  useEffect(() => {
    cargarFaltasTipoIII(0);
  }, [filtroEstado, cargarFaltasTipoIII]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(0);
    cargarFaltasTipoIII(0);
  };

  const handleDescargarActa = async (incidenteId: number) => {
    setDescargandoId(incidenteId);
    try {
      const blob = await incidentesApi.descargarActaPdf(incidenteId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Acta-TipoIII-Incidente-${incidenteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      setError(extraerMensajeError(err, 'Error al descargar el acta en PDF.'));
    } finally {
      setDescargandoId(null);
    }
  };

  const getBadgeEstado = (estado: EstadoProceso) => {
    switch (estado) {
      case 'REPORTADO':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'EN_INDAGACION':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'CITACION_PADRES':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'EN_INTERVENCION':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'CERRADO':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Barra de Título Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            Faltas Graves y Gravísimas (Tipo III)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisión directiva a presuntos delitos y activación de Ruta Integral externa (Ley 1620).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-50 text-red-700 border border-red-200 font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Casos Críticos: {totalElementos}
          </span>
        </div>
      </div>

      {/* Banner de Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-800">
          <AlertCircle size={15} className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Contenedor de Tabla con Toolbar Integrado */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Toolbar integrado */}
        <div className="p-2.5 border-b border-slate-200 bg-slate-50/60">
          <form onSubmit={handleBuscar} className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[220px] max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por implicado, radicado o hechos..."
                  className="w-full h-9 pl-8 pr-7 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-800"
                />
                {busqueda && (
                  <button
                    type="button"
                    onClick={() => {
                      setBusqueda('');
                      setPaginaActual(0);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={filtroEstado}
                onChange={(e) => {
                  setFiltroEstado(e.target.value as EstadoProceso | '');
                  setPaginaActual(0);
                }}
                className="h-9 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
              >
                <option value="">Todos los Estados</option>
                <option value="REPORTADO">1. Reportado</option>
                <option value="EN_INDAGACION">2. En Indagación</option>
                <option value="CITACION_PADRES">3. Citación Acudientes</option>
                <option value="EN_INTERVENCION">4. En Intervención</option>
                <option value="CERRADO">5. Proceso Cerrado</option>
              </select>

              <button
                type="submit"
                className="h-9 px-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Filtrar</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium ml-auto">
              Total: <strong className="text-slate-700">{totalElementos}</strong> expedientes
            </div>
          </form>
        </div>

        {/* Tabla de Faltas Tipo III */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Radicado</th>
                <th className="py-2.5 px-3">Fecha & Hora</th>
                <th className="py-2.5 px-3">Tipificación Ley 1620</th>
                <th className="py-2.5 px-3">Partes Involucradas</th>
                <th className="py-2.5 px-3">Estado del Trámite</th>
                <th className="py-2.5 px-3 text-right">Acciones Directivas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-7 h-7 animate-spin mx-auto text-red-600 mb-2" />
                    <p className="text-xs font-medium text-slate-600">Consultando expedientes de alta gravedad...</p>
                  </td>
                </tr>
              ) : incidentes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium text-slate-700">No se encontraron casos críticos</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      No hay incidentes Tipo III clasificados según los filtros seleccionados.
                    </p>
                  </td>
                </tr>
              ) : (
                incidentes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900">
                        #{inc.id}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Calendar size={13} className="text-red-500 shrink-0" />
                        <span>{inc.fechaIncidente}</span>
                        {inc.horaIncidente && (
                          <span className="text-slate-400 text-[10px]">({inc.horaIncidente})</span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 max-w-xs">
                      {inc.involucrados.find((i) => i.falta) ? (
                        <div className="space-y-0.5">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-rose-50 text-rose-700 border-rose-200">
                            {inc.involucrados.find((i) => i.falta)?.falta?.codigo} - Tipo III
                          </span>
                          <span className="text-[11px] text-slate-600 line-clamp-1 block">
                            {inc.involucrados.find((i) => i.falta)?.falta?.descripcion}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Sin tipificación directa</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        {inc.involucrados.map((inv) => (
                          <div key={inv.id} className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                                inv.rolEstudiante === 'AGRESOR_PRINCIPAL'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : inv.rolEstudiante === 'VICTIMA'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {inv.rolEstudiante}
                            </span>
                            <span className="font-semibold text-slate-800 text-[11px]">
                              {inv.estudianteNombreCompleto}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({inv.gradoMomento}-{inv.grupoMomento})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getBadgeEstado(
                          inc.estadoProceso
                        )}`}
                      >
                        {inc.estadoProceso}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setIncidenteSeleccionadoId(inc.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                        title="Abrir expediente completo"
                      >
                        <Eye size={13} className="text-slate-500" />
                        <span>Expediente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDescargarActa(inc.id)}
                        disabled={descargandoId === inc.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-medium border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                        title="Descargar Acta Formal de Descargos"
                      >
                        {descargandoId === inc.id ? (
                          <Loader2 size={13} className="animate-spin text-rose-700" />
                        ) : (
                          <FileDown size={13} className="text-rose-600" />
                        )}
                        <span>Acta PDF</span>
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
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Página <strong className="text-slate-700">{paginaActual + 1}</strong> de{' '}
              <strong className="text-slate-700">{totalPaginas}</strong> ({totalElementos} expedientes Tipo III)
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={paginaActual === 0}
                onClick={() => {
                  const nueva = paginaActual - 1;
                  setPaginaActual(nueva);
                  cargarFaltasTipoIII(nueva);
                }}
                className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                disabled={paginaActual >= totalPaginas - 1}
                onClick={() => {
                  const nueva = paginaActual + 1;
                  setPaginaActual(nueva);
                  cargarFaltasTipoIII(nueva);
                }}
                className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalle de Incidente */}
      <DetalleIncidenteModal
        incidenteId={incidenteSeleccionadoId}
        isOpen={incidenteSeleccionadoId !== null}
        onClose={() => setIncidenteSeleccionadoId(null)}
        onUpdated={() => cargarFaltasTipoIII(paginaActual)}
      />
    </div>
  );
};
