import React, { useState, useEffect } from 'react';
import { ExpedienteEstudiante } from '../types/matricula.types';
import { matriculasApi } from '../api/matriculasApi';
import {
  X,
  User,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
  Loader2,
  AlertOctagon,
  UserX,
  History,
} from 'lucide-react';

interface ExpedienteEstudianteModalProps {
  estudianteId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabExpediente = 'convivencia' | 'matriculas' | 'contacto';

export const ExpedienteEstudianteModal: React.FC<ExpedienteEstudianteModalProps> = ({
  estudianteId,
  isOpen,
  onClose,
}) => {
  const [expediente, setExpediente] = useState<ExpedienteEstudiante | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tabActiva, setTabActiva] = useState<TabExpediente>('convivencia');

  // Bloqueo de scroll en body mientras el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cargar datos al abrir modal
  useEffect(() => {
    if (isOpen && estudianteId) {
      setCargando(true);
      setError(null);
      setTabActiva('convivencia');

      matriculasApi
        .obtenerExpediente(estudianteId)
        .then((data) => {
          setExpediente(data);
        })
        .catch((err) => {
          console.error('Error al consultar expediente:', err);
          setError('No fue posible cargar el expediente histórico del estudiante.');
        })
        .finally(() => {
          setCargando(false);
        });
    } else {
      setExpediente(null);
    }
  }, [isOpen, estudianteId]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const getBadgeEstado = (estado: string) => {
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
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-expediente-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-trujillo-navy to-slate-800 text-white p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-[0.97] cursor-pointer"
            aria-label="Cerrar expediente"
          >
            <X className="w-5 h-5" />
          </button>

          {cargando ? (
            <div className="flex items-center gap-3 py-2">
              <Loader2 className="w-6 h-6 animate-spin text-trujillo-sky" />
              <span className="text-sm font-medium text-slate-300">
                Consultando expediente del estudiante...
              </span>
            </div>
          ) : expediente ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-trujillo-sky shadow-inner shrink-0 font-extrabold text-xl">
                  {(expediente.nombres?.[0] || 'E').toUpperCase()}
                  {(expediente.apellidos?.[0] || '').toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-trujillo-sky/20 text-sky-200 border border-sky-400/30 text-[10px] font-bold tracking-wide uppercase">
                      Expediente Único Escolar
                    </span>
                    {expediente.matriculaActual ? (
                      <span className="px-2 py-0.5 rounded-md bg-white/15 text-white text-xs font-bold">
                        Grado {expediente.matriculaActual.grado}° - Grupo{' '}
                        {expediente.matriculaActual.grupo} ({expediente.matriculaActual.anioLectivo})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 text-xs font-medium">
                        Sin matrícula vigente
                      </span>
                    )}
                  </div>
                  <h2
                    id="modal-expediente-title"
                    className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight"
                  >
                    {expediente.nombreCompleto}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Doc. Identidad: <span className="font-mono font-bold">{expediente.documento}</span>
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    expediente.activo
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{expediente.activo ? 'Estudiante Activo' : 'Inactivo'}</span>
                </span>
              </div>
            </div>
          ) : (
            <h2 id="modal-expediente-title" className="text-lg font-bold">
              Expediente del Estudiante
            </h2>
          )}
        </div>

        {/* Resumen Métrico de Convivencia */}
        {expediente && (
          <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total Incidentes */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Incidentes Registrados</span>
                  <FileText className="w-4 h-4 text-trujillo-navy" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-trujillo-dark">
                    {expediente.resumenConvivencia.totalIncidentes}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    en su trayectoria
                  </span>
                </div>
              </div>

              {/* Como Agresor / Partícipe */}
              <div className="bg-white border border-rose-200 rounded-xl p-3 shadow-xs">
                <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
                  <span>Como Implicado</span>
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-rose-700">
                    {expediente.resumenConvivencia.comoAgresorPrincipal +
                      expediente.resumenConvivencia.comoParticipe}
                  </span>
                  <span className="text-[10px] text-rose-500">
                    ({expediente.resumenConvivencia.comoAgresorPrincipal} directos,{' '}
                    {expediente.resumenConvivencia.comoParticipe} partícipe)
                  </span>
                </div>
              </div>

              {/* Como Víctima / Testigo */}
              <div className="bg-white border border-sky-200 rounded-xl p-3 shadow-xs">
                <div className="flex items-center justify-between text-xs text-sky-800 font-semibold mb-1">
                  <span>Víctima / Testigo</span>
                  <User className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-sky-800">
                    {expediente.resumenConvivencia.comoVictima +
                      expediente.resumenConvivencia.comoTestigo}
                  </span>
                  <span className="text-[10px] text-sky-600">
                    ({expediente.resumenConvivencia.comoVictima} víctima,{' '}
                    {expediente.resumenConvivencia.comoTestigo} testigo)
                  </span>
                </div>
              </div>

              {/* Faltas Ley 1620 */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Faltas Ley 1620</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[11px]">
                    T-I: {expediente.resumenConvivencia.faltasTipoI}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[11px]">
                    T-II: {expediente.resumenConvivencia.faltasTipoII}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px]">
                    T-III: {expediente.resumenConvivencia.faltasTipoIII}
                  </span>
                </div>
              </div>
            </div>

            {/* Banner de Reincidencia si aplica */}
            {expediente.resumenConvivencia.reincidente && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Alerta Pedagógica de Reincidencia:</span>{' '}
                  El alumno presenta faltas disciplinarias reiteradas. Según el Manual de Convivencia y
                  la Ley 1620, se requiere activación de ruta integral, citación a acudientes y diseño de
                  Plan de Intervención Pedagógica individual.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Barra de Pestañas */}
        <div className="border-b border-slate-200 px-6 bg-white flex items-center gap-6 shrink-0 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setTabActiva('convivencia')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              tabActiva === 'convivencia'
                ? 'border-trujillo-navy text-trujillo-navy font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Hoja de Vida de Convivencia</span>
            {expediente && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600">
                {expediente.historialIncidentes.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setTabActiva('matriculas')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              tabActiva === 'matriculas'
                ? 'border-trujillo-navy text-trujillo-navy font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Trayectoria de Matrículas</span>
            {expediente && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600">
                {expediente.historialMatriculas.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setTabActiva('contacto')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              tabActiva === 'contacto'
                ? 'border-trujillo-navy text-trujillo-navy font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Acudiente & Contacto</span>
          </button>
        </div>

        {/* Cuerpo del Expediente con Scroll Independiente */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-trujillo-navy mb-3" />
              <p className="text-sm font-medium">Reuniendo antecedentes y snapshots históricos...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl">
              <UserX className="w-10 h-10 mx-auto mb-2 text-rose-500" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          ) : !expediente ? null : (
            <>
              {/* Pestaña 1: Convivencia y Debido Proceso */}
              {tabActiva === 'convivencia' && (
                <div className="space-y-4">
                  {expediente.historialIncidentes.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">
                        Hoja de Vida Disciplinaria Impecable
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                        El estudiante no registra antecedentes de incidentes disciplinarios ni procesos
                        abiertos en la institución.
                      </p>
                    </div>
                  ) : (
                    expediente.historialIncidentes.map((inc) => (
                      <div
                        key={inc.incidenteId}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition space-y-3"
                      >
                        {/* Cabecera del Caso */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-trujillo-navy bg-trujillo-ice px-2 py-0.5 rounded border border-sky-200">
                              Caso #{inc.incidenteId}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {inc.fechaIncidente}
                            </span>
                            {inc.horaIncidente && (
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                                <Clock className="w-3 h-3" />
                                {inc.horaIncidente}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {inc.lugarNombre}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeEstado(
                                inc.estadoProceso
                              )}`}
                            >
                              {inc.estadoProceso}
                            </span>
                          </div>
                        </div>

                        {/* Snapshot Histórico Inmutable y Rol en el Hecho */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                            <History className="w-3.5 h-3.5 text-slate-500" />
                            <span>
                              Momento del hecho: Grado {inc.gradoMomento}°-{inc.grupoMomento} (Año{' '}
                              {inc.anioLectivoSnapshot})
                            </span>
                          </span>

                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getBadgeRol(
                              inc.rolEstudiante
                            )}`}
                          >
                            Rol: {inc.rolEstudiante}
                          </span>

                          {inc.falta && (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                              {inc.falta.codigo} ({inc.falta.clasificacionLey} -{' '}
                              {inc.falta.gravedadInstitucional})
                            </span>
                          )}
                        </div>

                        {/* Narrativa de Hechos */}
                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 text-xs text-slate-700">
                          <p className="font-semibold text-slate-800 mb-0.5">Descripción de los hechos:</p>
                          <p className="leading-relaxed">{inc.descripcionHechos}</p>
                          <p className="text-[11px] text-slate-400 mt-2">
                            Reportado por: <span className="font-semibold text-slate-600">{inc.docenteReportaNombre}</span>
                          </p>
                        </div>

                        {/* Debido Proceso: Descargos y Compromisos */}
                        <div className="bg-sky-50/50 rounded-xl p-3.5 border border-sky-200/70 space-y-2">
                          <div className="flex items-center justify-between text-xs text-trujillo-navy font-bold">
                            <div className="inline-flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-trujillo-sky" />
                              <span>Garantía de Debido Proceso & Descargos</span>
                            </div>
                            <span className="text-[11px] font-normal text-slate-500">
                              Ley 1620 / Art. 29 C.P.
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                              Versión libre del estudiante (Descargos):
                            </span>
                            {inc.descargoEstudiante ? (
                              <p className="text-xs text-slate-800 italic mt-0.5 bg-white p-2.5 rounded-lg border border-sky-200/50">
                                "{inc.descargoEstudiante}"
                              </p>
                            ) : (
                              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg mt-0.5">
                                Pendiente de rendición de versión o descargos formales.
                              </p>
                            )}
                          </div>

                          {inc.compromisoIndividual && (
                            <div>
                              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                Compromiso individual adquirido:
                              </span>
                              <p className="text-xs text-slate-800 mt-0.5 bg-white p-2.5 rounded-lg border border-sky-200/50">
                                {inc.compromisoIndividual}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Pestaña 2: Trayectoria de Matrículas */}
              {tabActiva === 'matriculas' && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">
                      Historial de Años Lectivos Cursados
                    </h4>
                    <span className="text-xs text-slate-400">
                      Inmutabilidad temporal de salones
                    </span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Año Lectivo</th>
                        <th className="py-3 px-4">Grado / Grupo</th>
                        <th className="py-3 px-4">Jornada</th>
                        <th className="py-3 px-4">Estado Matrícula</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {expediente.historialMatriculas.map((mat) => (
                        <tr key={mat.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-bold font-mono text-trujillo-navy">
                            {mat.anioLectivo}
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            <span className="px-2 py-0.5 rounded bg-sky-50 text-trujillo-navy border border-sky-200">
                              Grado {mat.grado}° - Grupo {mat.grupo}
                            </span>
                          </td>
                          <td className="py-3 px-4">{mat.jornada}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                mat.estadoMatricula === 'ACTIVO'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {mat.estadoMatricula}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pestaña 3: Acudiente & Contacto */}
              {tabActiva === 'contacto' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 max-w-xl mx-auto">
                  <h4 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-trujillo-navy" />
                    <span>Información Familiar y Notificaciones Oficiales</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Nombre del Acudiente / Representante:</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {expediente.nombreAcudiente || 'NO REGISTRADO EN MATRÍCULA'}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Teléfono de Contacto (Celular):</span>
                      <p className="text-sm font-bold font-mono text-trujillo-navy mt-0.5 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-trujillo-sky" />
                        <span>{expediente.telefonoAcudiente || 'SIN REGISTRO'}</span>
                      </p>
                    </div>

                    {expediente.emailAcudiente && (
                      <div>
                        <span className="text-slate-400 font-medium">Correo Electrónico:</span>
                        <p className="text-sm font-medium text-slate-700 mt-0.5 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{expediente.emailAcudiente}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
                    Nota: Los datos del acudiente son vinculantes para citaciones disciplinarias según el
                    decreto 1965 y la Ley 1620 de convivencia escolar.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            {expediente && `Expediente ID #${expediente.id} | Disciplina Web v3.0`}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
