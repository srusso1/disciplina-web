import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Search,
  AlertTriangle,
  UserCheck,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Shield,
  Loader2,
  GraduationCap,
  Info,
} from 'lucide-react';
import { incidentesApi } from '../api/incidentesApi';
import { matriculasApi } from '../../matriculas/api/matriculasApi';
import { EstudianteMatricula } from '../../matriculas/types/matricula.types';
import {
  DocenteCatalogo,
  LugarCatalogo,
  CatalogoFalta,
  RolEstudianteIncidente,
  RegistrarIncidenteData,
  InvolucradoRequest,
  ClasificacionLey,
} from '../types/incidente.types';

interface RegistrarIncidenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface InvolucradoFormState {
  idTemp: string;
  estudianteId: number | null;
  estudianteSeleccionado: EstudianteMatricula | null;
  busquedaEstudiante: string;
  resultadosBusqueda: EstudianteMatricula[];
  buscando: boolean;
  catalogoFaltaId: number | null;
  rolEstudiante: RolEstudianteIncidente;
  descripcionIndividual: string;
}

const getTodayLocalDate = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getCurrentLocalTime = () => {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
};

export const RegistrarIncidenteModal: React.FC<RegistrarIncidenteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Modo de caso: Individual (1 alumno) vs Colectivo (varios involucrados)
  const [modoColectivo, setModoColectivo] = useState<boolean>(false);

  const [docentes, setDocentes] = useState<DocenteCatalogo[]>([]);
  const [lugares, setLugares] = useState<LugarCatalogo[]>([]);
  const [faltas, setFaltas] = useState<CatalogoFalta[]>([]);

  // Filtro de faltas para facilitar la selección sin dropdowns gigantes
  const [filtroTipoLeyFaltas, setFiltroTipoLeyFaltas] = useState<ClasificacionLey | 'TODAS'>('TODAS');

  const [docenteReportaId, setDocenteReportaId] = useState<number | ''>('');
  const [lugarId, setLugarId] = useState<number | ''>('');
  const [fechaIncidente, setFechaIncidente] = useState<string>(getTodayLocalDate());
  const [horaIncidente, setHoraIncidente] = useState<string>(getCurrentLocalTime());
  const [descripcionHechos, setDescripcionHechos] = useState<string>('');

  const [involucrados, setInvolucrados] = useState<InvolucradoFormState[]>([
    {
      idTemp: '1',
      estudianteId: null,
      estudianteSeleccionado: null,
      busquedaEstudiante: '',
      resultadosBusqueda: [],
      buscando: false,
      catalogoFaltaId: null,
      rolEstudiante: 'AGRESOR_PRINCIPAL',
      descripcionIndividual: '',
    },
  ]);

  const [cargandoCatalogos, setCargandoCatalogos] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  // 1. Lock body scroll when modal is open and handle Escape key
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

  // 2. Load institutional catalogs
  useEffect(() => {
    if (isOpen) {
      cargarCatalogos();
      setErrorGlobal(null);
      setFechaIncidente(getTodayLocalDate());
      setHoraIncidente(getCurrentLocalTime());
    }
  }, [isOpen]);

  const cargarCatalogos = async () => {
    setCargandoCatalogos(true);
    try {
      const [docs, lugs, flts] = await Promise.all([
        incidentesApi.listarDocentes(),
        incidentesApi.listarLugares(),
        incidentesApi.listarFaltas(),
      ]);
      setDocentes(docs);
      setLugares(lugs);
      setFaltas(flts);

      if (docs.length > 0 && docenteReportaId === '') {
        setDocenteReportaId(docs[0].id);
      }
      if (lugs.length > 0 && lugarId === '') {
        setLugarId(lugs[0].id);
      }
    } catch (err: unknown) {
      const e = err as Error;
      setErrorGlobal('No se pudieron cargar los catálogos institucionales: ' + e.message);
    } finally {
      setCargandoCatalogos(false);
    }
  };

  const buscarEstudiantes = async (indice: number, busqueda: string) => {
    actualizarInvolucrado(indice, { busquedaEstudiante: busqueda });
    if (!busqueda || busqueda.trim().length < 2) {
      actualizarInvolucrado(indice, { resultadosBusqueda: [], buscando: false });
      return;
    }

    actualizarInvolucrado(indice, { buscando: true });
    try {
      const res = await matriculasApi.listarEstudiantes({ busqueda: busqueda.trim(), size: 8 });
      actualizarInvolucrado(indice, { resultadosBusqueda: res.contenido, buscando: false });
    } catch {
      actualizarInvolucrado(indice, { resultadosBusqueda: [], buscando: false });
    }
  };

  const seleccionarEstudiante = (indice: number, est: EstudianteMatricula) => {
    const yaExiste = involucrados.some(
      (inv, idx) => idx !== indice && inv.estudianteId === est.id
    );
    if (yaExiste) {
      setErrorGlobal(`El estudiante ${est.nombres} ${est.apellidos} ya está en la lista de involucrados.`);
      return;
    }

    setErrorGlobal(null);
    actualizarInvolucrado(indice, {
      estudianteId: est.id,
      estudianteSeleccionado: est,
      busquedaEstudiante: '',
      resultadosBusqueda: [],
    });
  };

  const deseleccionarEstudiante = (indice: number) => {
    actualizarInvolucrado(indice, {
      estudianteId: null,
      estudianteSeleccionado: null,
      busquedaEstudiante: '',
      resultadosBusqueda: [],
    });
  };

  const actualizarInvolucrado = (indice: number, partial: Partial<InvolucradoFormState>) => {
    setInvolucrados((prev) => {
      const clone = [...prev];
      clone[indice] = { ...clone[indice], ...partial };
      return clone;
    });
  };

  const agregarInvolucrado = () => {
    setInvolucrados((prev) => [
      ...prev,
      {
        idTemp: Date.now().toString(),
        estudianteId: null,
        estudianteSeleccionado: null,
        busquedaEstudiante: '',
        resultadosBusqueda: [],
        buscando: false,
        catalogoFaltaId: null,
        rolEstudiante: 'PARTICIPE',
        descripcionIndividual: '',
      },
    ]);
  };

  const removerInvolucrado = (indice: number) => {
    if (involucrados.length <= 1) return;
    setInvolucrados((prev) => prev.filter((_, idx) => idx !== indice));
  };

  const cambiarModoCaso = (colectivo: boolean) => {
    setModoColectivo(colectivo);
    if (!colectivo && involucrados.length > 1) {
      // Dejar únicamente el primer involucrado si vuelve a modo individual
      setInvolucrados([involucrados[0]]);
    }
  };

  const faltasFiltradas = faltas.filter((f) => {
    if (filtroTipoLeyFaltas === 'TODAS') return true;
    return f.clasificacionLey === filtroTipoLeyFaltas;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGlobal(null);

    if (!docenteReportaId) {
      setErrorGlobal('Seleccione el docente o funcionario que reporta el incidente.');
      return;
    }
    if (!lugarId) {
      setErrorGlobal('Seleccione el lugar institucional del hecho.');
      return;
    }
    if (!fechaIncidente) {
      setErrorGlobal('Indique la fecha del incidente.');
      return;
    }
    if (!descripcionHechos || descripcionHechos.trim().length < 10) {
      setErrorGlobal('La descripción fáctica de los hechos debe contener al menos 10 caracteres.');
      return;
    }

    const sinSeleccionar = involucrados.filter((inv) => !inv.estudianteId);
    if (sinSeleccionar.length > 0) {
      setErrorGlobal('Debe seleccionar un estudiante válido para cada involucrado.');
      return;
    }

    const payloadInvolucrados: InvolucradoRequest[] = involucrados.map((inv) => ({
      estudianteId: inv.estudianteId!,
      catalogoFaltaId: inv.catalogoFaltaId ? inv.catalogoFaltaId : undefined,
      rolEstudiante: inv.rolEstudiante,
      descripcionIndividual: inv.descripcionIndividual ? inv.descripcionIndividual.trim() : undefined,
    }));

    const data: RegistrarIncidenteData = {
      docenteReportaId: Number(docenteReportaId),
      lugarId: Number(lugarId),
      fechaIncidente,
      horaIncidente: horaIncidente ? (horaIncidente.length === 5 ? `${horaIncidente}:00` : horaIncidente) : '08:00:00',
      descripcionHechos: descripcionHechos.trim(),
      involucrados: payloadInvolucrados,
    };

    setGuardando(true);
    try {
      await incidentesApi.registrar(data);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const e = err as {
        response?: {
          data?: {
            message?: string;
            fieldErrors?: Record<string, string>;
          };
        };
        message?: string;
      };

      if (e.response?.data?.fieldErrors) {
        const errorList = Object.values(e.response.data.fieldErrors).join('. ');
        setErrorGlobal(`Error de validación: ${errorList}`);
      } else {
        const msg = e.response?.data?.message || e.message || 'Error al registrar el expediente disciplinario.';
        setErrorGlobal(msg);
      }
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-hidden animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal - Fixed */}
        <div className="px-6 py-4.5 bg-trujillo-navy text-white flex items-center justify-between shrink-0 border-b border-trujillo-navy-light">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/15 shadow-inner">
              <Shield className="w-5 h-5 text-trujillo-sky" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Apertura de Expediente de Convivencia
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-trujillo-sky/20 text-trujillo-sky border border-trujillo-sky/30">
                  Ley 1620
                </span>
              </div>
              <p className="text-xs text-sky-200/80">
                Garantía del debido proceso, tipificación y snapshot histórico
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-sky-200 hover:text-white hover:bg-white/10 transition-colors active:scale-95 cursor-pointer"
            title="Cerrar ventana (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Formulario - Single Scroll Container */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6"
        >
          {errorGlobal && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-in fade-in duration-150">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">No fue posible registrar el incidente</p>
                <p className="text-xs mt-0.5 leading-relaxed">{errorGlobal}</p>
              </div>
            </div>
          )}

          {/* Bloque 1: Contexto Institucional del Hecho */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-trujillo-sky" />
                1. Contexto Institucional del Suceso
              </h3>
              <span className="text-[11px] text-slate-400">Campos obligatorios marcados con *</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Docente Reporta */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  Docente o Funcionario Informante *
                </label>
                <select
                  value={docenteReportaId}
                  onChange={(e) => setDocenteReportaId(Number(e.target.value))}
                  disabled={cargandoCatalogos}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition font-medium text-slate-800"
                  required
                >
                  <option value="">Seleccione docente informante...</option>
                  {docentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombreCompleto} — {d.areaDesempeno}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lugar */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Lugar Institucional del Hecho *
                </label>
                <select
                  value={lugarId}
                  onChange={(e) => setLugarId(Number(e.target.value))}
                  disabled={cargandoCatalogos}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition font-medium text-slate-800"
                  required
                >
                  <option value="">Seleccione lugar institucional...</option>
                  {lugares.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nombre} {l.descripcion ? `(${l.descripcion})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Fecha del Hecho *
                </label>
                <input
                  type="date"
                  max={getTodayLocalDate()}
                  value={fechaIncidente}
                  onChange={(e) => setFechaIncidente(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition text-slate-800"
                  required
                />
              </div>

              {/* Hora */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Hora Aproximada *
                </label>
                <input
                  type="time"
                  value={horaIncidente}
                  onChange={(e) => setHoraIncidente(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Descripción de los Hechos */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Descripción Circunstanciada y Objetiva de los Hechos *
                </label>
                <span className={`text-[11px] font-medium ${descripcionHechos.length < 10 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {descripcionHechos.length}/5000 caracteres (mín. 10)
                </span>
              </div>
              <textarea
                value={descripcionHechos}
                onChange={(e) => setDescripcionHechos(e.target.value)}
                placeholder="Narre de manera cronológica qué sucedió, cómo se desarrolló la situación y quiénes intervinieron inicialmente..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition placeholder:text-slate-400 text-slate-800 leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Bloque 2: Tipología y Selección de Involucrados */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-trujillo-sky" />
                  2. Estudiantes Vinculados al Caso ({involucrados.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seleccione si el reporte corresponde a un único estudiante o a una situación colectiva.
                </p>
              </div>

              {/* Selector interactivo de Modo: Individual vs Colectivo */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => cambiarModoCaso(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                    !modoColectivo
                      ? 'bg-white text-trujillo-navy shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Caso Individual (1)
                </button>
                <button
                  type="button"
                  onClick={() => cambiarModoCaso(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-[0.98] flex items-center gap-1.5 ${
                    modoColectivo
                      ? 'bg-trujillo-navy text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Caso Colectivo (N)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-trujillo-sky animate-pulse"></span>
                </button>
              </div>
            </div>

            {/* Filtro rápido por tipo de falta Ley 1620 */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Catálogo Faltas:
              </span>
              {(['TODAS', 'TIPO_I', 'TIPO_II', 'TIPO_III'] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setFiltroTipoLeyFaltas(tipo)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all duration-150 active:scale-95 ${
                    filtroTipoLeyFaltas === tipo
                      ? 'bg-trujillo-navy text-white border-trujillo-navy shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tipo === 'TODAS'
                    ? 'Todas'
                    : tipo === 'TIPO_I'
                    ? 'Tipo I (Leves)'
                    : tipo === 'TIPO_II'
                    ? 'Tipo II (Graves)'
                    : 'Tipo III (Gravísimas)'}
                </button>
              ))}
            </div>

            {/* Lista de Estudiantes Involucrados */}
            <div className="space-y-4">
              {involucrados.map((inv, idx) => (
                <div
                  key={inv.idTemp}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-300 transition-colors space-y-4 relative"
                >
                  {/* Cabecera del Involucrado */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-trujillo-ice text-trujillo-navy text-xs font-black flex items-center justify-center border border-sky-200">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        {modoColectivo ? `Involucrado #${idx + 1}` : 'Estudiante del Caso'}
                      </span>
                    </div>

                    {modoColectivo && involucrados.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerInvolucrado(idx)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors active:scale-95"
                        title="Quitar estudiante de la lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Selector o Ficha del Estudiante */}
                  {inv.estudianteSeleccionado ? (
                    /* Ficha de Estudiante Seleccionado */
                    <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-trujillo-navy text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm ring-1 ring-sky-300">
                          {inv.estudianteSeleccionado.nombres.charAt(0)}
                          {inv.estudianteSeleccionado.apellidos.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-trujillo-navy">
                            {inv.estudianteSeleccionado.nombres} {inv.estudianteSeleccionado.apellidos}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                            <span>Doc: <strong>{inv.estudianteSeleccionado.documento}</strong></span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-trujillo-navy bg-white px-2 py-0.5 rounded-md border border-sky-200 text-[11px]">
                              <GraduationCap className="w-3 h-3 text-trujillo-sky" />
                              Grado {inv.estudianteSeleccionado.grado} - Grupo {inv.estudianteSeleccionado.grupo}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Matrícula 2026
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deseleccionarEstudiante(idx)}
                        className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-sm transition active:scale-95"
                      >
                        Cambiar Estudiante
                      </button>
                    </div>
                  ) : (
                    /* Buscador de Estudiante Combobox */
                    <div className="relative">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Buscar Estudiante por Nombre, Apellido o Documento *
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={inv.busquedaEstudiante}
                          onChange={(e) => buscarEstudiantes(idx, e.target.value)}
                          placeholder="Escriba apellido, nombre o documento (ej: Gomez, 1066...)"
                          className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition placeholder:text-slate-400"
                        />
                        {inv.buscando && (
                          <Loader2 className="w-4 h-4 text-trujillo-sky animate-spin absolute right-3.5 top-3" />
                        )}
                      </div>

                      {/* Dropdown de Resultados de Búsqueda */}
                      {inv.resultadosBusqueda.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-52 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-100">
                          {inv.resultadosBusqueda.map((est) => (
                            <button
                              key={est.id}
                              type="button"
                              onClick={() => seleccionarEstudiante(idx, est)}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-sky-50/70 transition flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-trujillo-ice text-trujillo-navy font-bold text-xs flex items-center justify-center shrink-0">
                                  {est.nombres.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 group-hover:text-trujillo-navy">
                                    {est.nombres} {est.apellidos}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    Doc: {est.documento} • Grado: {est.grado}-{est.grupo} ({est.jornada || 'DIURNA'})
                                  </p>
                                </div>
                              </div>
                              <span className="px-2 py-1 rounded-lg bg-slate-100 group-hover:bg-trujillo-navy group-hover:text-white text-slate-700 text-[10px] font-bold transition">
                                Seleccionar
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Campos de Rol, Falta y Observación */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                    {/* Rol */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Rol en el Hecho *
                      </label>
                      <select
                        value={inv.rolEstudiante}
                        onChange={(e) =>
                          actualizarInvolucrado(idx, {
                            rolEstudiante: e.target.value as RolEstudianteIncidente,
                          })
                        }
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky transition font-medium text-slate-800"
                      >
                        <option value="AGRESOR_PRINCIPAL">Agresor Principal / Infractor</option>
                        <option value="PARTICIPE">Partícipe / Coautor</option>
                        <option value="VICTIMA">Afectado / Víctima</option>
                        <option value="TESTIGO">Testigo Presencial</option>
                      </select>
                    </div>

                    {/* Falta del Catálogo */}
                    <div className="sm:col-span-1 lg:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        Falta Disciplinaria Tipificada
                      </label>
                      <select
                        value={inv.catalogoFaltaId || ''}
                        onChange={(e) =>
                          actualizarInvolucrado(idx, {
                            catalogoFaltaId: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky transition text-slate-800"
                      >
                        <option value="">Sin falta tipificada (Afectado, Víctima o Testigo)</option>
                        {faltasFiltradas.map((f) => (
                          <option key={f.id} value={f.id}>
                            [{f.codigo}] {f.clasificacionLey} ({f.gravedadInstitucional}) — {f.descripcion.slice(0, 65)}...
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Observación Individual Inicial */}
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Observación individual inicial sobre la participación de este alumno (opcional):
                      </label>
                      <input
                        type="text"
                        value={inv.descripcionIndividual}
                        onChange={(e) =>
                          actualizarInvolucrado(idx, { descripcionIndividual: e.target.value })
                        }
                        placeholder="Ej: Inició provocación verbal / Fue quien intervino para mediar / Sufrió daño material..."
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:bg-white transition text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón para agregar involucrado en caso colectivo */}
            {modoColectivo && (
              <button
                type="button"
                onClick={agregarInvolucrado}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-50 text-trujillo-navy text-xs font-bold flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-trujillo-sky" />
                <span>Vincular Otro Estudiante a este Mismo Expediente</span>
              </button>
            )}
          </div>
        </form>

        {/* Footer Actions - Fixed */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <Info className="w-4 h-4" />
            <span>Se generará automáticamente el folio histórico institucional.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200/70 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={guardando}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-trujillo-navy hover:bg-trujillo-navy-light rounded-xl shadow-md shadow-trujillo-navy/20 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {guardando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-trujillo-sky" />
                  <span>Guardando Expediente...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-trujillo-sky" />
                  <span>Aperturar Expediente</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
