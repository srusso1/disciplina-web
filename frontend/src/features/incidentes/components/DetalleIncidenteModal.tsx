import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Shield,
  Clock,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Save,
  Loader2,
  Send,
  AlertTriangle,
  Scale,
  FolderKanban,
} from 'lucide-react';
import { incidentesApi } from '../api/incidentesApi';
import {
  Incidente,
  EstadoProceso,
  InvolucradoResponse,
  ClasificacionLey,
} from '../types/incidente.types';
import { ExpedienteEstudianteModal } from '../../matriculas/components/ExpedienteEstudianteModal';

interface DetalleIncidenteModalProps {
  incidenteId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const ESTADOS_DISPONIBLES: { estado: EstadoProceso; etiqueta: string }[] = [
  { estado: 'REPORTADO', etiqueta: '1. Reportado' },
  { estado: 'EN_INDAGACION', etiqueta: '2. En Indagación' },
  { estado: 'CITACION_PADRES', etiqueta: '3. Citación Acudientes' },
  { estado: 'EN_INTERVENCION', etiqueta: '4. En Intervención / Seguimiento' },
  { estado: 'CERRADO', etiqueta: '5. Proceso Cerrado' },
];

export const DetalleIncidenteModal: React.FC<DetalleIncidenteModalProps> = ({
  incidenteId,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [incidente, setIncidente] = useState<Incidente | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cambio de estado
  const [nuevoEstado, setNuevoEstado] = useState<EstadoProceso>('REPORTADO');
  const [observacionEstado, setObservacionEstado] = useState<string>('');
  const [actualizandoEstado, setActualizandoEstado] = useState<boolean>(false);

  // Descargos individuales en edición
  const [editandoDescargoId, setEditandoDescargoId] = useState<number | null>(null);
  const [descargoTexto, setDescargoTexto] = useState<string>('');
  const [compromisoTexto, setCompromisoTexto] = useState<string>('');
  const [guardandoDescargo, setGuardandoDescargo] = useState<boolean>(false);

  // Modal de Expediente Integral del Estudiante
  const [expedienteEstudianteId, setExpedienteEstudianteId] = useState<number | null>(null);

  const cargarDetalle = useCallback(async (id: number) => {
    setCargando(true);
    setError(null);
    try {
      const data = await incidentesApi.obtenerPorId(id);
      setIncidente(data);
      setNuevoEstado(data.estadoProceso);
    } catch (err: unknown) {
      const e = err as Error;
      setError('Error al cargar detalles del expediente: ' + e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && incidenteId) {
      cargarDetalle(incidenteId);
      setEditandoDescargoId(null);
    }
  }, [isOpen, incidenteId, cargarDetalle]);

  const handleCambiarEstado = async () => {
    if (!incidente) return;
    setActualizandoEstado(true);
    try {
      const actualizado = await incidentesApi.actualizarEstado(incidente.id, {
        nuevoEstado,
        observaciones: observacionEstado.trim() || undefined,
      });
      setIncidente(actualizado);
      setObservacionEstado('');
      onUpdated();
    } catch (err: unknown) {
      const e = err as Error;
      setError('No se pudo actualizar el estado: ' + e.message);
    } finally {
      setActualizandoEstado(false);
    }
  };

  const iniciarEdicionDescargo = (inv: InvolucradoResponse) => {
    setEditandoDescargoId(inv.estudianteId);
    setDescargoTexto(inv.descargo || '');
    setCompromisoTexto(inv.compromisos || '');
  };

  const cancelarEdicionDescargo = () => {
    setEditandoDescargoId(null);
    setDescargoTexto('');
    setCompromisoTexto('');
  };

  const guardarDescargo = async (estudianteId: number) => {
    if (!incidente) return;
    if (!descargoTexto.trim()) {
      setError('El descargo o declaración del estudiante no puede estar vacío.');
      return;
    }

    setGuardandoDescargo(true);
    try {
      const actualizado = await incidentesApi.actualizarDescargo(incidente.id, estudianteId, {
        descargo: descargoTexto.trim(),
        compromisos: compromisoTexto.trim(),
      });
      setIncidente(actualizado);
      setEditandoDescargoId(null);
      onUpdated();
    } catch (err: unknown) {
      const e = err as Error;
      setError('Error al registrar descargo: ' + e.message);
    } finally {
      setGuardandoDescargo(false);
    }
  };

  if (!isOpen) return null;

  const getBadgeRol = (rol: string) => {
    switch (rol) {
      case 'AGRESOR_PRINCIPAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'PARTICIPE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'VICTIMA':
        return 'bg-sky-100 text-trujillo-navy border-sky-200';
      case 'TESTIGO':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getBadgeClasificacionLey = (tipo?: ClasificacionLey) => {
    switch (tipo) {
      case 'TIPO_I':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'TIPO_II':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'TIPO_III':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-trujillo-navy text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-trujillo-navy-light rounded-xl border border-sky-400/30">
              <Scale className="w-5 h-5 text-trujillo-sky" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Expediente #{incidente?.id || incidenteId}</h2>
                {incidente && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-trujillo-ice text-trujillo-navy border border-sky-200">
                    {incidente.estadoProceso}
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-200/80">Seguimiento Formativo y Garantía del Debido Proceso (Ley 1620)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-trujillo-sky mb-2" />
              <p className="text-sm font-medium">Cargando expediente institucional...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Aviso del Sistema</p>
                <p>{error}</p>
              </div>
            </div>
          ) : incidente ? (
            <>
              {/* Barra de Gestión de Estado del Proceso (Debido Proceso) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-trujillo-sky" />
                    <span className="text-xs font-bold text-trujillo-navy uppercase tracking-wider">
                      Estado Actual del Debido Proceso
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Registrado por: <strong className="text-slate-700">{incidente.usuarioRegistro}</strong>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value as EstadoProceso)}
                    className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky font-medium text-slate-700"
                  >
                    {ESTADOS_DISPONIBLES.map((st) => (
                      <option key={st.estado} value={st.estado}>
                        {st.etiqueta}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={observacionEstado}
                    onChange={(e) => setObservacionEstado(e.target.value)}
                    placeholder="Nota u observación del cambio de estado..."
                    className="flex-[1.5] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky text-slate-700 placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={handleCambiarEstado}
                    disabled={actualizandoEstado || nuevoEstado === incidente.estadoProceso}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-40 shrink-0"
                  >
                    {actualizandoEstado ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Actualizar Estado</span>
                  </button>
                </div>
              </div>

              {/* Ficha Técnica del Incidente */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Docente Informante
                  </span>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-trujillo-sky shrink-0" />
                    {incidente.docenteReporta.nombreCompleto}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{incidente.docenteReporta.areaDesempeno}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Lugar del Hecho
                  </span>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-trujillo-sky shrink-0" />
                    {incidente.lugar.nombre}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{incidente.lugar.descripcion || 'Sede Institucional'}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Fecha y Hora
                  </span>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-trujillo-sky shrink-0" />
                    {incidente.fechaIncidente}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {incidente.horaIncidente || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Narración Objetiva de los Hechos */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <h3 className="text-xs font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-1.5">
                  <FileEdit className="w-4 h-4 text-trujillo-sky" />
                  Descripción Circunstanciada de los Hechos
                </h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {incidente.descripcionHechos}
                </p>
              </div>

              {/* Lista de Involucrados con Derecho al Debido Proceso y Descargos */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-trujillo-navy uppercase tracking-wider flex items-center justify-between">
                  <span>
                    Estudiantes Vinculados al Expediente ({incidente.involucrados.length})
                  </span>
                  <span className="text-xs font-normal normal-case text-slate-500">
                    Snapshots históricos inmutables de matrícula
                  </span>
                </h3>

                <div className="space-y-4">
                  {incidente.involucrados.map((inv) => (
                    <div
                      key={inv.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition space-y-4"
                    >
                      {/* Cabecera del Involucrado */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-bold text-slate-900">
                              {inv.nombreCompleto}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeRol(inv.rolEstudiante)}`}>
                              {inv.rolEstudiante}
                            </span>
                            <button
                              type="button"
                              onClick={() => setExpedienteEstudianteId(inv.estudianteId)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-trujillo-ice hover:bg-trujillo-navy text-trujillo-navy hover:text-white text-[11px] font-semibold border border-sky-200 transition cursor-pointer"
                              title="Ver expediente e historial de convivencia"
                            >
                              <FolderKanban className="w-3 h-3 text-trujillo-sky" />
                              <span>Expediente</span>
                            </button>
                          </div>

                          <p className="text-xs text-slate-500 mt-0.5">
                            Doc: <strong>{inv.documento}</strong> | Grado al momento del hecho:{' '}
                            <span className="font-bold text-trujillo-navy bg-trujillo-ice px-2 py-0.5 rounded border border-sky-200">
                              Grado {inv.gradoMomento} - Grupo {inv.grupoMomento}
                            </span>
                          </p>
                        </div>

                        {inv.falta && (
                          <div className="text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeClasificacionLey(inv.falta.clasificacionLey)}`}>
                              {inv.falta.codigo} - {inv.falta.clasificacionLey} ({inv.falta.gravedadInstitucional})
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs truncate" title={inv.falta.descripcion}>
                              {inv.falta.descripcion}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Observación Individual Registrada */}
                      {inv.descripcionIndividual && (
                        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <strong className="text-slate-700">Observación sobre este estudiante:</strong>{' '}
                          {inv.descripcionIndividual}
                        </div>
                      )}

                      {/* Sección de Descargos y Compromisos (Debido Proceso) */}
                      <div className="pt-1">
                        {editandoDescargoId === inv.estudianteId ? (
                          <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-200 space-y-3 animate-in fade-in duration-150">
                            <h4 className="text-xs font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-1.5">
                              <Scale className="w-3.5 h-3.5 text-trujillo-sky" />
                              Registrar Versión Libre y Acciones Formativas
                            </h4>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Versión / Descargo del Estudiante (Garantía Art. 29 C.P.) *
                              </label>
                              <textarea
                                value={descargoTexto}
                                onChange={(e) => setDescargoTexto(e.target.value)}
                                placeholder="Escriba la versión libre manifestada por el estudiante en comite o indagación..."
                                rows={3}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Compromisos Formativos y Acciones Restaurativas
                              </label>
                              <textarea
                                value={compromisoTexto}
                                onChange={(e) => setCompromisoTexto(e.target.value)}
                                placeholder="Especifique acuerdos, talleres formativos, o compromisos pedagógicos suscritos..."
                                rows={2}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={cancelarEdicionDescargo}
                                disabled={guardandoDescargo}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => guardarDescargo(inv.estudianteId)}
                                disabled={guardandoDescargo}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-trujillo-navy hover:bg-trujillo-navy-light rounded-lg shadow transition disabled:opacity-50"
                              >
                                {guardandoDescargo ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Save className="w-3.5 h-3.5" />
                                )}
                                <span>Guardar Descargos</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Visualización de Descargo */}
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                                  {inv.tieneDescargo ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                  )}
                                  Descargo del Estudiante
                                </span>
                                <button
                                  type="button"
                                  onClick={() => iniciarEdicionDescargo(inv)}
                                  className="text-[11px] font-bold text-trujillo-navy hover:underline flex items-center gap-1"
                                >
                                  <FileEdit className="w-3 h-3" />
                                  {inv.tieneDescargo ? 'Editar' : 'Registrar'}
                                </button>
                              </div>
                              <p className="text-xs text-slate-700 italic">
                                {inv.descargo || 'Pendiente de registrar versión libre del estudiante.'}
                              </p>
                            </div>

                            {/* Visualización de Compromisos */}
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                                  {inv.tieneCompromisos ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                  )}
                                  Compromisos Formativos
                                </span>
                              </div>
                              <p className="text-xs text-slate-700">
                                {inv.compromisos || 'Sin compromisos pedagógicos suscritos aún.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400">
            IE Trujillo - Sistema de Convivencia Escolar
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition shadow-sm"
          >
            Cerrar Expediente
          </button>
        </div>

      </div>

      <ExpedienteEstudianteModal
        estudianteId={expedienteEstudianteId}
        isOpen={expedienteEstudianteId !== null}
        onClose={() => setExpedienteEstudianteId(null)}
      />
    </div>
  );
};

