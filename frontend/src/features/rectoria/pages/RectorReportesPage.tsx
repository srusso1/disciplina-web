import React, { useState, useEffect, useCallback } from 'react';
import { rectoriaApi } from '../api/rectoriaApi';
import { incidentesApi } from '../../incidentes/api/incidentesApi';
import { Incidente, PaginaIncidentes, EstadoProceso } from '../../incidentes/types/incidente.types';
import { DetalleIncidenteModal } from '../../incidentes/components/DetalleIncidenteModal';
import { extraerMensajeError } from '../../../core/api/apiClient';
import {
  FileCheck,
  FileDown,
  Search,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  AlertCircle,
  Download,
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
    <div className="space-y-6">
      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-trujillo-sky flex items-center justify-center font-bold shadow-2xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Emisión de Actas & Resoluciones Institucionales
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Generación documental en memoria de expedientes y consolidados anuales (RF-08 & CU-11 - SAD)
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDescargarConsolidado}
          disabled={descargandoConsolidado}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-xs font-bold shadow-md shadow-trujillo-navy/20 transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {descargandoConsolidado ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Download className="w-4 h-4 text-trujillo-sky" />
          )}
          <span>{descargandoConsolidado ? 'Generando PDF...' : 'Descargar Consolidado Anual'}</span>
        </button>
      </div>

      {/* Banner de Error si ocurre */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tarjeta de Destacado del Informe Ejecutivo */}
      <div className="bg-gradient-to-br from-trujillo-navy to-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-trujillo-sky text-[10px] font-bold tracking-wider uppercase border border-white/10">
            Documento Oficial de Rectoría
          </span>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            Informe Ejecutivo Consolidado de Convivencia Escolar ({new Date().getFullYear()})
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Consolida indicadores de conflictividad según Ley 1620, mapa de calor de espacios institucionales, franjas horarias de mayor criticidad y balance cuantitativo del debido proceso para rendición de cuentas directiva.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDescargarConsolidado}
          disabled={descargandoConsolidado}
          className="px-4 py-2 rounded-xl bg-trujillo-sky hover:bg-sky-400 text-trujillo-dark text-xs font-bold transition active:scale-[0.98] cursor-pointer shrink-0 inline-flex items-center gap-2"
        >
          <FileDown className="w-4 h-4" />
          <span>Exportar PDF Consolidado</span>
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros de Expedientes */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleBuscar} className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante, hechos o radicado..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value as EstadoProceso | '');
              setPaginaActual(0);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 transition text-slate-700 font-medium"
          >
            <option value="">-- Todos los Estados --</option>
            <option value="REPORTADO">1. Reportado</option>
            <option value="EN_INDAGACION">2. En Indagación</option>
            <option value="CITACION_PADRES">3. Citación Acudientes</option>
            <option value="EN_INTERVENCION">4. En Intervención</option>
            <option value="CERRADO">5. Proceso Cerrado</option>
          </select>
        </div>
      </div>

      {/* Tabla de Expedientes para Descarga de Actas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {cargando ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-trujillo-navy mb-3" />
            <p className="text-xs font-medium">Cargando expedientes institucionales...</p>
          </div>
        ) : incidentes.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">No se encontraron expedientes</p>
            <p className="text-xs text-slate-400">Modifique los criterios de búsqueda o el filtro de estado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Radicado</th>
                  <th className="py-3 px-4">Fecha & Hora</th>
                  <th className="py-3 px-4">Estudiantes Involucrados</th>
                  <th className="py-3 px-4">Docente Reporta</th>
                  <th className="py-3 px-4">Estado Debido Proceso</th>
                  <th className="py-3 px-4 text-right">Descarga Documental</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {incidentes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-trujillo-navy">
                        #{inc.id}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-trujillo-sky shrink-0" />
                        <span>{inc.fechaIncidente}</span>
                        {inc.horaIncidente && (
                          <span className="text-slate-400 text-[10px]">({inc.horaIncidente})</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {inc.involucrados.map((inv) => (
                          <div key={inv.id} className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-[11px]">
                              {inv.estudianteNombreCompleto}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({inv.gradoMomento}-{inv.grupoMomento})
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-slate-100 text-slate-600">
                              {inv.rolEstudiante}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800">
                        {inc.docenteReporta.nombreCompleto}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeEstado(
                          inc.estadoProceso
                        )}`}
                      >
                        {inc.estadoProceso}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => setIncidenteSeleccionadoId(inc.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition cursor-pointer"
                        title="Ver detalle del caso"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ver</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDescargarActa(inc.id)}
                        disabled={descargandoIncidenteId === inc.id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-trujillo-ice hover:bg-sky-100 text-trujillo-navy text-[11px] font-bold border border-sky-200 transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
                        title="Descargar Acta Formal en PDF"
                      >
                        {descargandoIncidenteId === inc.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-trujillo-navy" />
                        ) : (
                          <FileDown className="w-3.5 h-3.5 text-trujillo-sky" />
                        )}
                        <span>Acta PDF</span>
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
              <strong className="text-slate-800">{totalPaginas}</strong> ({totalElementos} expedientes)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={paginaActual === 0}
                onClick={() => {
                  const nueva = paginaActual - 1;
                  setPaginaActual(nueva);
                  cargarIncidentes(nueva);
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
                  cargarIncidentes(nueva);
                }}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                <ChevronRight className="w-4 h-4" />
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
