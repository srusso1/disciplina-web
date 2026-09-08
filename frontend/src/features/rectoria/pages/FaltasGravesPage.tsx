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
  CheckCircle2,
  Scale,
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
    <div className="space-y-6">
      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-200/80 shadow-2xs border-l-4 border-l-rose-600">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Faltas Tipo III & Activación de Ruta Integral (Ley 1620)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Seguimiento directivo a presuntos delitos contra la libertad, integridad o formación sexual y agresiones graves.
              </p>
            </div>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 self-start md:self-auto">
          Casos Críticos Activos: <span className="text-rose-950 text-sm font-black">{totalElementos}</span>
        </div>
      </div>

      {/* Banner Legal Informativo - Ley 1620 */}
      <div className="bg-trujillo-navy text-white p-4 rounded-xl border border-slate-800 shadow-sm space-y-1.5">
        <div className="flex items-center gap-2 text-trujillo-sky text-xs font-semibold uppercase tracking-wider">
          <Scale size={16} />
          <span>Protocolo Obligatorio de Convivencia Escolar (Decreto 1965 / Ley 1620)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Ante la ocurrencia de una <strong>Falta Tipo III</strong>, el Presidente del Comité de Convivencia Escolar (Rector) debe:
          (1) Remitir de manera inmediata el caso a la <strong>Policía de Infancia y Adolescencia</strong> o <strong>ICBF / Comisaría de Familia</strong>;
          (2) Adoptar de inmediato medidas para proteger a la víctima y salvaguardar sus derechos;
          (3) Citar de forma prioritaria a los representantes legales de las partes.
        </p>
      </div>

      {/* Banner de Error */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleBuscar} className="w-full sm:w-80 relative">
          <Search size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por implicado, radicado o hechos..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-navy/20 focus:border-trujillo-navy transition text-slate-800"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value as EstadoProceso | '');
              setPaginaActual(0);
            }}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-navy/20 focus:border-trujillo-navy transition text-slate-700 font-medium"
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

      {/* Tabla de Faltas Tipo III */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {cargando ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={24} className="animate-spin text-rose-600 mb-2" />
            <p className="text-xs font-medium">Consultando expedientes de alta gravedad...</p>
          </div>
        ) : incidentes.length === 0 ? (
          <div className="py-14 text-center text-slate-500 space-y-1.5">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
            <p className="text-sm font-semibold text-slate-800">Sin incidentes Tipo III reportados</p>
            <p className="text-xs text-slate-400">No hay casos clasificados como presuntos delitos según los filtros actuales.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3.5">Radicado</th>
                  <th className="py-2.5 px-3.5">Fecha & Hora</th>
                  <th className="py-2.5 px-3.5">Tipificación Ley 1620</th>
                  <th className="py-2.5 px-3.5">Partes Involucradas</th>
                  <th className="py-2.5 px-3.5">Estado del Trámite</th>
                  <th className="py-2.5 px-3.5 text-right">Acciones Directivas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {incidentes.map((inc) => (
                  <tr key={inc.id} className="even:bg-slate-50/50 hover:bg-slate-100/60 transition-colors">
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-trujillo-navy">
                        #{inc.id}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Calendar size={14} className="text-rose-500 shrink-0" />
                        <span>{inc.fechaIncidente}</span>
                        {inc.horaIncidente && (
                          <span className="text-slate-400 text-[10px]">({inc.horaIncidente})</span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 max-w-xs">
                      {inc.involucrados.find((i) => i.falta) ? (
                        <div className="space-y-0.5">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-convivencia-tipo3-bg text-convivencia-tipo3-text border-convivencia-tipo3-border">
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

                    <td className="py-2.5 px-3.5">
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

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getBadgeEstado(
                          inc.estadoProceso
                        )}`}
                      >
                        {inc.estadoProceso}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setIncidenteSeleccionadoId(inc.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                        title="Abrir expediente completo"
                      >
                        <Eye size={14} className="text-slate-500" />
                        <span>Expediente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDescargarActa(inc.id)}
                        disabled={descargandoId === inc.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-200 transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
                        title="Descargar Acta Formal de Descargos"
                      >
                        {descargandoId === inc.id ? (
                          <Loader2 size={14} className="animate-spin text-rose-700" />
                        ) : (
                          <FileDown size={14} className="text-rose-600" />
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
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Página <strong className="text-slate-800">{paginaActual + 1}</strong> de{' '}
              <strong className="text-slate-800">{totalPaginas}</strong> ({totalElementos} expedientes Tipo III)
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
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                disabled={paginaActual >= totalPaginas - 1}
                onClick={() => {
                  const nueva = paginaActual + 1;
                  setPaginaActual(nueva);
                  cargarFaltasTipoIII(nueva);
                }}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                <ChevronRight size={16} />
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
