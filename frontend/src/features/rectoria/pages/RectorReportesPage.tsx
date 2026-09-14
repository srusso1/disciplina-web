import React, { useState, useEffect, useCallback } from 'react';
import { rectoriaApi } from '../api/rectoriaApi';
import { incidentesApi } from '../../incidentes/api/incidentesApi';
import { Incidente, PaginaIncidentes, EstadoProceso } from '../../incidentes/types/incidente.types';
import { DetalleIncidenteModal } from '../../incidentes/components/DetalleIncidenteModal';
import { extraerMensajeError } from '../../../core/api/apiClient';
import {
  FileDown,
  Search,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  AlertCircle,
  X,
  ShieldCheck,
} from 'lucide-react';

export const RectorReportesPage: React.FC = () => {
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

  // Estados de descarga
  const [descargandoConsolidado, setDescargandoConsolidado] = useState<boolean>(false);
  const [descargandoIncidenteId, setDescargandoIncidenteId] = useState<number | null>(null);

  // Modal de Detalle de Incidente
  const [incidenteSeleccionadoId, setIncidenteSeleccionadoId] = useState<number | null>(null);

  const cargarIncidentes = useCallback(async (page: number = 0) => {
    setCargando(true);
    setError(null);
    try {
      const res: PaginaIncidentes = await incidentesApi.listar({
        page,
        size: 10,
        estado: filtroEstado ? (filtroEstado as EstadoProceso) : undefined,
        busqueda: busqueda.trim() || undefined,
      });

      setIncidentes(res.contenido || []);
      setPaginaActual(res.pagina);
      setTotalPaginas(res.totalPaginas || 1);
      setTotalElementos(res.totalElementos || 0);
    } catch (err: unknown) {
      console.error('Error al consultar incidentes para reportes:', err);
      setError(extraerMensajeError(err, 'No fue posible cargar el listado de expedientes.'));
    } finally {
      setCargando(false);
    }
  }, [busqueda, filtroEstado]);

  useEffect(() => {
    cargarIncidentes(0);
  }, [filtroEstado, cargarIncidentes]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(0);
    cargarIncidentes(0);
  };

  const handleDescargarConsolidado = async () => {
    setDescargandoConsolidado(true);
    setError(null);
    try {
      const blob = await rectoriaApi.descargarConsolidadoPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Informe-Ejecutivo-Convivencia-${new Date().getFullYear()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      setError(extraerMensajeError(err, 'Error al descargar el informe ejecutivo de Rectoría.'));
    } finally {
      setDescargandoConsolidado(false);
    }
  };

  const handleDescargarActa = async (incidenteId: number) => {
    setDescargandoIncidenteId(incidenteId);
    setError(null);
    try {
      const blob = await incidentesApi.descargarActaPdf(incidenteId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Acta-Formal-Incidente-${incidenteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      setError(extraerMensajeError(err, 'Error al generar el acta formal en PDF.'));
    } finally {
      setDescargandoIncidenteId(null);
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
            <FileText className="w-5 h-5 text-slate-700" />
            Emisión de Actas e Informes Institucionales
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generación oficial de resoluciones, actas disciplinarias y consolidado anual de convivencia escolar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Vigencia {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid de Tarjetas Técnicas de Reportes Oficiales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Tarjeta Técnica 1: Informe Consolidado Anual */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Informe Ejecutivo Directivo
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                PDF
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 leading-snug">
              Informe Consolidado Anual de Convivencia ({new Date().getFullYear()})
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Consolidación cuantitativa conforme a la Ley 1620 de 2013: estadísticas por tipología (I, II y III), mapa de calor de espacios institucionales, franjas horarias y estado del debido proceso para rendición de cuentas.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              Generación: <strong className="text-slate-600 font-medium">En tiempo real (Streaming)</strong>
            </div>
            <button
              type="button"
              onClick={handleDescargarConsolidado}
              disabled={descargandoConsolidado}
              className="h-8 px-3 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {descargandoConsolidado ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>{descargandoConsolidado ? 'Generando...' : 'Descargar Informe'}</span>
            </button>
          </div>
        </div>

        {/* Tarjeta Técnica 2: Protocolo Probatorio y Custodia Legal */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Custodia y Validez Legal
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTAS INDIVIDUALES
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 leading-snug">
              Actas Formales de Descargos y Notificación
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Expedición de actas individuales con valor probatorio institucional. Cada documento incorpora el relato cronológico de los hechos, descargos del estudiante, tipificación de la falta y compromisos vinculantes de las partes.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Validez ante Comité y MEN</span>
            </div>
            <span className="text-xs text-slate-600 font-medium">
              {totalElementos} expedientes disponibles
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor de Tabla con Toolbar Integrado */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Toolbar de búsqueda y filtros */}
        <div className="p-2.5 border-b border-slate-200 bg-slate-50/60">
          <form onSubmit={handleBuscar} className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[220px] max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por estudiante, hechos o radicado..."
                  className="w-full h-9 pl-8 pr-7 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-800"
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
                className="h-9 px-2.5 text-xs rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
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

        {/* Tabla de Expedientes para Descarga de Actas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Radicado</th>
                <th className="py-2.5 px-3">Fecha / Hora</th>
                <th className="py-2.5 px-3">Estudiantes Involucrados</th>
                <th className="py-2.5 px-3">Docente Reporta</th>
                <th className="py-2.5 px-3">Estado Proceso</th>
                <th className="py-2.5 px-3 text-right">Descarga Documental</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-7 h-7 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-xs font-medium text-slate-600">Cargando expedientes institucionales...</p>
                  </td>
                </tr>
              ) : incidentes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium text-slate-700">No se encontraron expedientes</p>
                    <p className="text-xs text-slate-400 mt-0.5">Modifique los criterios de búsqueda o el filtro de estado.</p>
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
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{inc.fechaIncidente}</span>
                        {inc.horaIncidente && (
                          <span className="text-slate-400 text-[10px]">({inc.horaIncidente})</span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        {inc.involucrados.map((inv) => (
                          <div key={inv.id} className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 text-[11px]">
                              {inv.estudianteNombreCompleto}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({inv.gradoMomento}-{inv.grupoMomento})
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase bg-slate-100 text-slate-600">
                              {inv.rolEstudiante}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-medium text-slate-800">
                        {inc.docenteReporta.nombreCompleto}
                      </span>
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
                        title="Ver detalle del caso"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ver</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDescargarActa(inc.id)}
                        disabled={descargandoIncidenteId === inc.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-medium border border-blue-200 transition-colors cursor-pointer disabled:opacity-50"
                        title="Descargar Acta Formal en PDF"
                      >
                        {descargandoIncidenteId === inc.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" />
                        ) : (
                          <FileDown className="w-3.5 h-3.5 text-blue-600" />
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
            <span>
              Página <strong className="text-slate-700">{paginaActual + 1}</strong> de{' '}
              <strong className="text-slate-700">{totalPaginas}</strong> ({totalElementos} expedientes)
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={paginaActual === 0}
                onClick={() => {
                  const nueva = paginaActual - 1;
                  setPaginaActual(nueva);
                  cargarIncidentes(nueva);
                }}
                className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled={paginaActual >= totalPaginas - 1}
                onClick={() => {
                  const nueva = paginaActual + 1;
                  setPaginaActual(nueva);
                  cargarIncidentes(nueva);
                }}
                className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
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
        onUpdated={() => cargarIncidentes(paginaActual)}
      />
    </div>
  );
};
