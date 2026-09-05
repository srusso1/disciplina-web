import React, { useState, useEffect } from 'react';
import { ExpedienteEstudiante } from '../types/matricula.types';
import { matriculasApi } from '../api/matriculasApi';
import { extraerMensajeError } from '../../../core/api/apiClient';
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
  Copy,
  Check,
  ExternalLink,
  HeartHandshake,
} from 'lucide-react';
import { PlanesIntervencionTab } from './PlanesIntervencionTab';

interface ExpedienteEstudianteModalProps {
  estudianteId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabExpediente = 'convivencia' | 'matriculas' | 'contacto' | 'planes';


export const ExpedienteEstudianteModal: React.FC<ExpedienteEstudianteModalProps> = ({
  estudianteId,
  isOpen,
  onClose,
}) => {
  const [expediente, setExpediente] = useState<ExpedienteEstudiante | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tabActiva, setTabActiva] = useState<TabExpediente>('convivencia');
  const [telefonoCopiado, setTelefonoCopiado] = useState<boolean>(false);

  // Bloqueo total de scroll en body y contenedores de layout
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
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
          setError(extraerMensajeError(err, 'No fue posible cargar el expediente histórico del estudiante.'));
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
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopiarTelefono = (telefono: string) => {
    navigator.clipboard.writeText(telefono);
    setTelefonoCopiado(true);
    setTimeout(() => setTelefonoCopiado(false), 2000);
  };

  if (!isOpen) return null;

  const getBadgeRol = (rol: string) => {
    switch (rol) {
      case 'AGRESOR_PRINCIPAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PARTICIPE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'VICTIMA':
        return 'bg-sky-50 text-trujillo-navy border-sky-200';
      case 'TESTIGO':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-150 overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-expediente-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-trujillo-navy to-slate-900 text-white p-5 sm:p-6 shrink-0 relative">
          <div className="flex items-start justify-between gap-4">
            {cargando ? (
              <div className="flex items-center gap-3 py-2">
                <Loader2 className="w-6 h-6 animate-spin text-trujillo-sky" />
                <span className="text-sm font-medium text-slate-300">
                  Consultando expediente del estudiante...
                </span>
              </div>
            ) : expediente ? (
              <div className="flex items-start gap-4 min-w-0">
                {/* Avatar con iniciales */}
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-trujillo-sky shadow-inner shrink-0 font-extrabold text-lg sm:text-xl tracking-wider">
                  {(expediente.nombres?.[0] || 'E').toUpperCase()}
                  {(expediente.apellidos?.[0] || '').toUpperCase()}
                </div>

                {/* Información de Identidad */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-trujillo-sky/20 text-sky-200 border border-sky-400/30 text-[10px] font-bold tracking-wider uppercase">
                      Expediente Único Escolar
                    </span>
                    {expediente.matriculaActual ? (
                      <span className="px-2 py-0.5 rounded-md bg-white/15 text-white text-xs font-semibold">
                        Grado {expediente.matriculaActual.grado}° - Grupo{' '}
                        {expediente.matriculaActual.grupo} ({expediente.matriculaActual.anioLectivo})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 text-xs font-medium">
                        Sin matrícula vigente
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        expediente.activo
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{expediente.activo ? 'Matriculado' : 'Inactivo'}</span>
                    </span>
                  </div>

                  <h2
                    id="modal-expediente-title"
                    className="text-lg sm:text-xl font-black text-white tracking-tight truncate"
                    title={expediente.nombreCompleto}
                  >
                    {expediente.nombreCompleto}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Documento de Identidad:{' '}
                    <span className="font-mono font-bold text-sky-200">{expediente.documento}</span>
                  </p>
                </div>
              </div>
            ) : (
              <h2 id="modal-expediente-title" className="text-lg font-bold">
                Expediente del Estudiante
              </h2>
            )}

            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-[0.97] cursor-pointer shrink-0"
              aria-label="Cerrar expediente"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resumen Métrico de Convivencia */}
        {expediente && (
          <div className="bg-slate-50/80 border-b border-slate-200 p-4 shrink-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total Incidentes */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Incidentes</span>
                  <FileText className="w-4 h-4 text-trujillo-navy" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-trujillo-dark">
                    {expediente.resumenConvivencia.totalIncidentes}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    en trayectoria
                  </span>
                </div>
              </div>

              {/* Como Agresor / Partícipe */}
              <div className="bg-white border border-rose-200 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
                  <span>Como Implicado</span>
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-rose-700">
                    {expediente.resumenConvivencia.comoAgresorPrincipal +
                      expediente.resumenConvivencia.comoParticipe}
                  </span>
                  <span className="text-[10px] text-rose-500 font-medium">
                    ({expediente.resumenConvivencia.comoAgresorPrincipal} dir,{' '}
                    {expediente.resumenConvivencia.comoParticipe} part)
                  </span>
                </div>
              </div>

              {/* Como Víctima / Testigo */}
              <div className="bg-white border border-sky-200 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-sky-800 font-semibold mb-1">
                  <span>Víctima / Testigo</span>
                  <User className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-sky-800">
                    {expediente.resumenConvivencia.comoVictima +
                      expediente.resumenConvivencia.comoTestigo}
                  </span>
                  <span className="text-[10px] text-sky-600 font-medium">
                    ({expediente.resumenConvivencia.comoVictima} víc,{' '}
                    {expediente.resumenConvivencia.comoTestigo} test)
                  </span>
                </div>
              </div>

              {/* Faltas Ley 1620 */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Faltas Ley 1620</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200 text-[10px]" title="Faltas Tipo I (Leves)">
                    T-I: {expediente.resumenConvivencia.faltasTipoI}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200 text-[10px]" title="Faltas Tipo II (Graves)">
                    T-II: {expediente.resumenConvivencia.faltasTipoII}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[10px]" title="Faltas Tipo III (Gravísimas)">
                    T-III: {expediente.resumenConvivencia.faltasTipoIII}
                  </span>
                </div>
              </div>
            </div>

            {/* Banner de Reincidencia si aplica */}
            {expediente.resumenConvivencia.reincidente && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border-l-4 border-l-rose-600 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-bold">Alerta Pedagógica de Reincidencia (Ley 1620):</strong>{' '}
                  El alumno presenta faltas disciplinarias reiteradas. Se requiere activación de ruta integral,
                  citación a acudientes y formulación de Plan de Intervención Pedagógica individual.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Barra de Pestañas (Jitter-free: peso uniforme) */}
        <div
          role="tablist"
          className="border-b border-slate-200 px-6 bg-white flex items-center gap-2 sm:gap-6 shrink-0 text-xs sm:text-sm font-semibold overflow-x-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'convivencia'}
            onClick={() => setTabActiva('convivencia')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98] shrink-0 ${
              tabActiva === 'convivencia'
                ? 'border-trujillo-navy text-trujillo-navy font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-trujillo-sky shrink-0" />
            <span>Hoja de Vida de Convivencia</span>
            {expediente && (
              <span
                className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                  tabActiva === 'convivencia'
                    ? 'bg-trujillo-ice text-trujillo-navy'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {expediente.historialIncidentes.length}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'matriculas'}
            onClick={() => setTabActiva('matriculas')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98] shrink-0 ${
              tabActiva === 'matriculas'
                ? 'border-trujillo-navy text-trujillo-navy font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-trujillo-sky shrink-0" />
            <span>Trayectoria de Matrículas</span>
            {expediente && (
              <span
                className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                  tabActiva === 'matriculas'
                    ? 'bg-trujillo-ice text-trujillo-navy'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {expediente.historialMatriculas.length}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'contacto'}
            onClick={() => setTabActiva('contacto')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98] shrink-0 ${
              tabActiva === 'contacto'
                ? 'border-trujillo-navy text-trujillo-navy font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-4 h-4 text-trujillo-sky shrink-0" />
            <span>Acudiente & Notificaciones</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'planes'}
            onClick={() => setTabActiva('planes')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98] shrink-0 ${
              tabActiva === 'planes'
                ? 'border-trujillo-navy text-trujillo-navy font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-trujillo-sky shrink-0" />
            <span>Planes & Seguimiento</span>
          </button>
        </div>

        {/* Cuerpo del Expediente con Scroll Independiente */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50 space-y-4">
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-trujillo-navy mb-3" />
              <p className="text-sm font-medium">Reuniendo antecedentes y snapshots históricos...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl">
              <UserX className="w-10 h-10 mx-auto mb-2 text-rose-500" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          ) : !expediente ? null : (
            <>
              {/* Pestaña 1: Convivencia y Debido Proceso (Timeline sin recuadros excesivos) */}
              {tabActiva === 'convivencia' && (
                <div className="space-y-4">
                  {expediente.historialIncidentes.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">
                        Hoja de Vida Disciplinaria Impecable
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        El estudiante no registra antecedentes de incidentes disciplinarios ni procesos
                        abiertos en la institución.
                      </p>
                    </div>
                  ) : (
                    expediente.historialIncidentes.map((inc) => (
                      <div
                        key={inc.incidenteId}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3.5"
                      >
                        {/* Cabecera del Caso */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-trujillo-navy bg-trujillo-ice px-2.5 py-0.5 rounded-lg border border-sky-200">
                              Caso #{inc.incidenteId}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {inc.fechaIncidente}
                            </span>
                            {inc.horaIncidente && (
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                                <Clock className="w-3 h-3" />
                                {inc.horaIncidente}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-xs text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {inc.lugarNombre}
                            </span>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeEstado(
                              inc.estadoProceso
                            )}`}
                          >
                            {inc.estadoProceso}
                          </span>
                        </div>

                        {/* Snapshot Histórico Inmutable y Rol en el Hecho */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200">
                            <History className="w-3.5 h-3.5 text-slate-400" />
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
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                              {inc.falta.codigo} ({inc.falta.clasificacionLey} -{' '}
                              {inc.falta.gravedadInstitucional})
                            </span>
                          )}
                        </div>

                        {/* Narrativa de Hechos */}
                        <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-700 space-y-1">
                          <p className="font-semibold text-slate-900">Descripción fáctica del hecho:</p>
                          <p className="leading-relaxed text-slate-700">{inc.descripcionHechos}</p>
                          <p className="text-[11px] text-slate-400 pt-1">
                            Reportado por: <span className="font-semibold text-slate-700">{inc.docenteReportaNombre}</span>
                          </p>
                        </div>

                        {/* Debido Proceso: Descargos y Compromisos */}
                        <div className="bg-sky-50/40 rounded-xl p-3.5 border border-sky-100 space-y-2.5">
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
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                              Versión libre del estudiante (Descargos):
                            </span>
                            {inc.descargoEstudiante ? (
                              <p className="text-xs text-slate-800 italic bg-white p-3 rounded-xl border border-sky-200/60 leading-relaxed shadow-2xs">
                                "{inc.descargoEstudiante}"
                              </p>
                            ) : (
                              <p className="text-xs text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60">
                                Pendiente de rendición de versión o descargos formales ante el Comité.
                              </p>
                            )}
                          </div>

                          {inc.compromisoIndividual && (
                            <div>
                              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                                Compromiso individual adquirido:
                              </span>
                              <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-sky-200/60 leading-relaxed shadow-2xs">
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
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Historial de Años Lectivos Cursados
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Inmutabilidad de cursos y salones por vigencia
                      </p>
                    </div>
                  </div>

                  {expediente.historialMatriculas.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No se registran antecedentes de matrícula histórica.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
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
                            <tr key={mat.id} className="hover:bg-slate-50/80 transition">
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
                </div>
              )}

              {/* Pestaña 3: Acudiente & Notificaciones (Con acciones de un click) */}
              {tabActiva === 'contacto' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5 max-w-xl mx-auto">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-trujillo-navy" />
                      <div>
                        <h4 className="text-base font-bold text-slate-800">
                          Representación Familiar y Notificaciones
                        </h4>
                        <p className="text-xs text-slate-500">
                          Vínculo oficial para citaciones disciplinarias
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                        Nombre del Acudiente / Tutor Legal:
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {expediente.nombreAcudiente || 'NO REGISTRADO EN MATRÍCULA'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                          Teléfono de Contacto (Celular):
                        </span>
                        <p className="text-sm font-bold font-mono text-trujillo-navy mt-1 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-trujillo-sky shrink-0" />
                          <span>{expediente.telefonoAcudiente || 'SIN REGISTRO'}</span>
                        </p>
                      </div>

                      {expediente.telefonoAcudiente && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopiarTelefono(expediente.telefonoAcudiente || '')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition active:scale-[0.97] cursor-pointer"
                            title="Copiar número al portapapeles"
                          >
                            {telefonoCopiado ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>

                          <a
                            href={`tel:${expediente.telefonoAcudiente}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-xs font-semibold shadow-2xs transition active:scale-[0.97] cursor-pointer"
                            title="Llamar directamente"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Llamar</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {expediente.emailAcudiente && (
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                            Correo Electrónico:
                          </span>
                          <p className="text-sm font-medium text-slate-700 mt-1 flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{expediente.emailAcudiente}</span>
                          </p>
                        </div>
                        <a
                          href={`mailto:${expediente.emailAcudiente}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition active:scale-[0.97] cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Redactar</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200/60 text-[11px] text-sky-900 leading-relaxed">
                    <strong>Garantía Jurídica (Ley 1620 y Decreto 1965):</strong> Las citaciones y actas enviadas a este contacto
                    constituyen prueba fehaciente de comunicación procesal ante el Comité de Convivencia Escolar.
                  </div>
                </div>
              )}

              {/* Pestaña 4: Planes de Intervención & Seguimiento de Caso (RF-06, CU-06, CU-07) */}
              {tabActiva === 'planes' && (
                <PlanesIntervencionTab
                  estudianteId={expediente.id}
                  estudianteNombre={expediente.nombreCompleto}
                  incidentes={expediente.historialIncidentes.map((inc) => ({
                    incidenteId: inc.incidenteId,
                    descripcion: inc.descripcionHechos,
                    faltaCodigo: inc.falta?.codigo,
                    fechaIncidente: inc.fechaIncidente,
                  }))}
                />
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
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition active:scale-[0.98] cursor-pointer"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
