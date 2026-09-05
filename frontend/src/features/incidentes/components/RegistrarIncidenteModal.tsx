import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  AlertTriangle,
  BookOpen,
  Users,
  Shield,
  Loader2,
} from 'lucide-react';
import { incidentesApi } from '../api/incidentesApi';
import {
  DocenteCatalogo,
  LugarCatalogo,
  CatalogoFalta,
  ClasificacionLey,
  RegistrarIncidenteData,
  InvolucradoRequest,
  NarrativaProcesada,
} from '../types/incidente.types';
import { AsistenteIaPanel } from './AsistenteIaPanel';
import { InvolucradoItemCard, InvolucradoItemData } from './InvolucradoItemCard';
import { ContextoHechosSection } from './ContextoHechosSection';

interface RegistrarIncidenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
  // Modo de caso: Individual vs Colectivo
  const [modoColectivo, setModoColectivo] = useState<boolean>(false);

  // Catálogos
  const [docentes, setDocentes] = useState<DocenteCatalogo[]>([]);
  const [lugares, setLugares] = useState<LugarCatalogo[]>([]);
  const [faltas, setFaltas] = useState<CatalogoFalta[]>([]);
  const [filtroTipoLeyFaltas, setFiltroTipoLeyFaltas] = useState<ClasificacionLey | 'TODAS'>('TODAS');

  // Campos principales
  const [docenteReportaId, setDocenteReportaId] = useState<number | ''>('');
  const [lugarId, setLugarId] = useState<number | ''>('');
  const [fechaIncidente, setFechaIncidente] = useState<string>(getTodayLocalDate());
  const [horaIncidente, setHoraIncidente] = useState<string>(getCurrentLocalTime());
  const [descripcionHechos, setDescripcionHechos] = useState<string>('');

  // Estados de sugerencias / alertas de IA para Docente y Lugar
  const [sugerenciaDocentePendiente, setSugerenciaDocentePendiente] = useState<string | null>(null);
  const [alertaDocenteNoMencionado, setAlertaDocenteNoMencionado] = useState<boolean>(false);
  const [sugerenciaLugarPendiente, setSugerenciaLugarPendiente] = useState<string | null>(null);
  const [alertaLugarNoMencionado, setAlertaLugarNoMencionado] = useState<boolean>(false);

  // Estudiantes involucrados
  const [involucrados, setInvolucrados] = useState<InvolucradoItemData[]>([
    {
      idTemp: '1',
      estudianteId: null,
      estudianteSeleccionado: null,
      busquedaEstudiante: '',
      catalogoFaltaId: null,
      rolEstudiante: 'AGRESOR_PRINCIPAL',
      descripcionIndividual: '',
    },
  ]);

  const [cargandoCatalogos, setCargandoCatalogos] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  // Bloqueo de scroll y cierre con Escape
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

  // Cargar catálogos al abrir modal
  useEffect(() => {
    if (isOpen) {
      cargarCatalogos();
      setErrorGlobal(null);
      setFechaIncidente(getTodayLocalDate());
      setHoraIncidente(getCurrentLocalTime());
      setDocenteReportaId('');
      setLugarId('');
      setSugerenciaDocentePendiente(null);
      setAlertaDocenteNoMencionado(false);
      setSugerenciaLugarPendiente(null);
      setAlertaLugarNoMencionado(false);
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
      // No autoseleccionar docs[0] ni lugs[0] para evitar asignaciones erróneas por omisión
    } catch (err: unknown) {
      const e = err as Error;
      setErrorGlobal('No se pudieron cargar los catálogos institucionales: ' + e.message);
    } finally {
      setCargandoCatalogos(false);
    }
  };

  const handleAplicarResultadoIa = (resultado: NarrativaProcesada) => {
    if (resultado.hechosEstandarizados) {
      setDescripcionHechos(resultado.hechosEstandarizados);
    }
    if (resultado.fechaSugerida) {
      setFechaIncidente(resultado.fechaSugerida);
    }
    if (resultado.horaSugerida) {
      setHoraIncidente(resultado.horaSugerida);
    }

    // Manejo de Docente Informante
    if (resultado.docenteReportaId) {
      setDocenteReportaId(resultado.docenteReportaId);
      setSugerenciaDocentePendiente(null);
      setAlertaDocenteNoMencionado(false);
    } else if (resultado.docenteReportaNombre && resultado.docenteReportaNombre.trim() !== '') {
      setDocenteReportaId('');
      setSugerenciaDocentePendiente(resultado.docenteReportaNombre.trim());
      setAlertaDocenteNoMencionado(false);
    } else {
      setDocenteReportaId('');
      setSugerenciaDocentePendiente(null);
      setAlertaDocenteNoMencionado(true);
    }

    // Manejo de Lugar Institucional
    if (resultado.lugarSugeridoId) {
      setLugarId(resultado.lugarSugeridoId);
      setSugerenciaLugarPendiente(null);
      setAlertaLugarNoMencionado(false);
    } else if (resultado.lugarNombre && resultado.lugarNombre.trim() !== '') {
      setLugarId('');
      setSugerenciaLugarPendiente(resultado.lugarNombre.trim());
      setAlertaLugarNoMencionado(false);
    } else {
      setLugarId('');
      setSugerenciaLugarPendiente(null);
      setAlertaLugarNoMencionado(true);
    }

    if (resultado.estudiantes && resultado.estudiantes.length > 0) {
      if (resultado.estudiantes.length > 1) {
        setModoColectivo(true);
      }

      const nuevos: InvolucradoItemData[] = resultado.estudiantes.map((estIa, idx) => {
        const esAfectadoSinFalta = estIa.rolSugerido === 'VICTIMA' || estIa.rolSugerido === 'TESTIGO';

        return {
          idTemp: `${Date.now()}_${idx}`,
          estudianteId: estIa.estudianteId || null,
          estudianteSeleccionado: estIa.estudianteId ? {
            id: estIa.estudianteId,
            documento: estIa.documento || '',
            nombres: estIa.nombreCompleto || estIa.nombreMencionado || 'Estudiante',
            apellidos: '',
            nombreCompleto: estIa.nombreCompleto || estIa.nombreMencionado || 'Estudiante',
            nombreAcudiente: '',
            telefonoAcudiente: '',
            grado: estIa.gradoMomento || '',
            grupo: estIa.grupoMomento || '',
            jornada: 'MANANA',
            anioLectivo: new Date().getFullYear(),
            estadoMatricula: 'ACTIVO',
          } : null,
          busquedaEstudiante: estIa.estudianteId ? '' : (estIa.nombreMencionado || ''),
          catalogoFaltaId: esAfectadoSinFalta ? null : (estIa.catalogoFaltaId || null),
          rolEstudiante: estIa.rolSugerido || 'PARTICIPE',
          descripcionIndividual: estIa.justificacionRol || '',
        };
      });

      setInvolucrados(nuevos);
    }
  };

  const actualizarInvolucrado = (index: number, updated: Partial<InvolucradoItemData>) => {
    setInvolucrados((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
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
      if (sugerenciaDocentePendiente) {
        setErrorGlobal(`Docente informante pendiente de vincular: "${sugerenciaDocentePendiente}". Debe seleccionar al funcionario correspondiente de la lista institucional.`);
      } else {
        setErrorGlobal('Debe seleccionar el docente o funcionario que reporta el incidente.');
      }
      return;
    }
    if (!lugarId) {
      if (sugerenciaLugarPendiente) {
        setErrorGlobal(`Lugar institucional pendiente de vincular: "${sugerenciaLugarPendiente}". Debe seleccionar la ubicación oficial del catálogo.`);
      } else {
        setErrorGlobal('Debe seleccionar el lugar institucional del hecho.');
      }
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
      const nombresPendientes = sinSeleccionar
        .map((inv) => (inv.busquedaEstudiante ? `"${inv.busquedaEstudiante}"` : 'estudiante sin seleccionar'))
        .join(', ');
      setErrorGlobal(`Debe seleccionar un estudiante válido del censo escolar para cada involucrado. Pendiente(s) de vincular: ${nombresPendientes}.`);
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
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorGlobal(
        e.response?.data?.message || e.message || 'Error inesperado al registrar el incidente.'
      );
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-registro-incidente-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="bg-gradient-to-r from-trujillo-navy via-slate-900 to-trujillo-navy text-white px-6 py-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-trujillo-sky/20 border border-trujillo-sky/30 flex items-center justify-center text-trujillo-sky shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-registro-incidente-title" className="text-base font-bold text-white tracking-tight">
                Registrar Incidente de Convivencia Escolar
              </h2>
              <p className="text-xs text-sky-200/80">
                Sistema Integral de Debido Proceso y Tipificación según Ley 1620 de 2013
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition active:scale-[0.97] cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorGlobal && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-3 shadow-xs animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-800">No fue posible registrar el incidente</p>
                <p className="text-rose-600 leading-relaxed">{errorGlobal}</p>
              </div>
            </div>
          )}

          {/* Subcomponente 1: Panel de IA */}
          <AsistenteIaPanel onAplicar={handleAplicarResultadoIa} />

          {/* Subcomponente 2: Contexto Institucional (Docente, Lugar, Fecha, Hora, Hechos) */}
          <ContextoHechosSection
            docentes={docentes}
            lugares={lugares}
            cargandoCatalogos={cargandoCatalogos}
            docenteReportaId={docenteReportaId}
            setDocenteReportaId={setDocenteReportaId}
            lugarId={lugarId}
            setLugarId={setLugarId}
            fechaIncidente={fechaIncidente}
            setFechaIncidente={setFechaIncidente}
            horaIncidente={horaIncidente}
            setHoraIncidente={setHoraIncidente}
            descripcionHechos={descripcionHechos}
            setDescripcionHechos={setDescripcionHechos}
            sugerenciaDocentePendiente={sugerenciaDocentePendiente}
            alertaDocenteNoMencionado={alertaDocenteNoMencionado}
            onLimpiarAlertaDocente={() => {
              setSugerenciaDocentePendiente(null);
              setAlertaDocenteNoMencionado(false);
            }}
            sugerenciaLugarPendiente={sugerenciaLugarPendiente}
            alertaLugarNoMencionado={alertaLugarNoMencionado}
            onLimpiarAlertaLugar={() => {
              setSugerenciaLugarPendiente(null);
              setAlertaLugarNoMencionado(false);
            }}
          />

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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-[0.97] cursor-pointer ${
                    !modoColectivo
                      ? 'bg-white text-trujillo-navy shadow-xs border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Caso Individual (1)
                </button>
                <button
                  type="button"
                  onClick={() => cambiarModoCaso(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-[0.97] flex items-center gap-1.5 cursor-pointer ${
                    modoColectivo
                      ? 'bg-trujillo-navy text-white shadow-xs'
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
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition active:scale-[0.97] cursor-pointer ${
                    filtroTipoLeyFaltas === tipo
                      ? 'bg-trujillo-navy text-white border-trujillo-navy shadow-xs'
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

            {/* Subcomponente 3: Lista Modular de Involucrados */}
            <div className="space-y-4">
              {involucrados.map((inv, idx) => (
                <InvolucradoItemCard
                  key={inv.idTemp}
                  index={idx}
                  data={inv}
                  faltas={faltasFiltradas}
                  modoColectivo={modoColectivo}
                  totalInvolucrados={involucrados.length}
                  onChange={(updated) => actualizarInvolucrado(idx, updated)}
                  onRemover={() => removerInvolucrado(idx)}
                  onErrorGlobal={setErrorGlobal}
                />
              ))}

              {modoColectivo && (
                <button
                  type="button"
                  onClick={agregarInvolucrado}
                  className="w-full py-3 border-2 border-dashed border-sky-300 hover:border-trujillo-sky rounded-2xl text-xs sm:text-sm font-bold text-trujillo-navy bg-sky-50/40 hover:bg-sky-50 flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-trujillo-sky" />
                  <span>Vincular Otro Estudiante al Mismo Incidente Colectivo</span>
                </button>
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-[0.97] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-trujillo-navy hover:bg-slate-800 disabled:opacity-50 text-xs sm:text-sm font-bold text-white shadow-md transition active:scale-[0.97] cursor-pointer"
            >
              {guardando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-trujillo-sky" />
                  <span>Guardando en Expediente...</span>
                </>
              ) : (
                <span>Registrar Incidente Oficial</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
