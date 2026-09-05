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
      <div className="bg-gradient-to-r from-rose-950 to-slate-900 text-white p-5 rounded-2xl border border-rose-900 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-4 h-4" />
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
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleBuscar} className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por implicado, radicado o hechos..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value as EstadoProceso | '');
              setPaginaActual(0);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition text-slate-700 font-medium"
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
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {cargando ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-rose-600 mb-3" />
            <p className="text-xs font-medium">Consultando expedientes de alta gravedad...</p>
          </div>
        ) : incidentes.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <p className="text-sm font-semibold text-slate-800">Sin incidentes Tipo III reportados</p>
            <p className="text-xs text-slate-400">No hay casos clasificados como presuntos delitos según los filtros actuales.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-rose-50/60 border-b border-rose-100 text-rose-900 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Radicado</th>
                  <th className="py-3 px-4">Fecha & Hora</th>
                  <th className="py-3 px-4">Tipificación Ley 1620</th>
                  <th className="py-3 px-4">Partes Involucradas</th>
                  <th className="py-3 px-4">Estado del Trámite</th>
                  <th className="py-3 px-4 text-right">Acciones Directivas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {incidentes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-rose-50/30 transition">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-rose-700">
                        #{inc.id}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{inc.fechaIncidente}</span>
                        {inc.horaIncidente && (
                          <span className="text-slate-400 text-[10px]">({inc.horaIncidente})</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      {inc.involucrados.find((i) => i.falta) ? (
                        <div>
                          <span className="font-bold text-rose-800 text-[11px] block">
                            {inc.involucrados.find((i) => i.falta)?.falta?.codigo} - Tipo III
                          </span>
                          <span className="text-[11px] text-slate-600 line-clamp-1">
                            {inc.involucrados.find((i) => i.falta)?.falta?.descripcion}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sin tipificación directa</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {inc.involucrados.map((inv) => (
                          <div key={inv.id} className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                inv.rolEstudiante === 'AGRESOR_PRINCIPAL'
                                  ? 'bg-rose-100 text-rose-800'
                                  : inv.rolEstudiante === 'VICTIMA'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-slate-100 text-slate-600'
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
                        title="Abrir expediente completo"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Expediente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDescargarActa(inc.id)}
                        disabled={descargandoId === inc.id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
                        title="Descargar Acta Formal de Descargos"
                      >
                        {descargandoId === inc.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-700" />
                        ) : (
                          <FileDown className="w-3.5 h-3.5 text-rose-600" />
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
              <strong className="text-slate-800">{totalPaginas}</strong> ({totalElementos} expedientes Tipo III)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={paginaActual === 0}
                onClick={() => {
                  const nueva = paginaActual - 1;
                  setPaginaActual(nueva);
                  cargarFaltasTipoIII(nueva);
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
                  cargarFaltasTipoIII(nueva);
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
        onUpdated={() => cargarFaltasTipoIII(paginaActual)}
      />
    </div>
  );
};
