import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Users,
  Shield,
  Loader2,
} from 'lucide-react';
import { incidentesApi } from '../api/incidentesApi';
import {
  DocenteCatalogo,
  LugarCatalogo,
  CatalogoFalta,
  RegistrarIncidenteData,
  InvolucradoRequest,
  NarrativaProcesada,
} from '../types/incidente.types';
import { AsistenteIaPanel } from './AsistenteIaPanel';
import { InvolucradoItemCard, InvolucradoItemData } from './InvolucradoItemCard';
import { ContextoHechosSection } from './ContextoHechosSection';
import { useLockBodyScroll } from '../../../core/hooks/useLockBodyScroll';
import { notify } from '../../../core/utils/notify';

interface RegistrarIncidenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: NarrativaProcesada | null;
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
  initialData,
}) => {
  // Modo de caso: Individual vs Colectivo
  const [modoColectivo, setModoColectivo] = useState<boolean>(false);

  // Catálogos
  const [docentes, setDocentes] = useState<DocenteCatalogo[]>([]);
  const [lugares, setLugares] = useState<LugarCatalogo[]>([]);
  const [faltas, setFaltas] = useState<CatalogoFalta[]>([]);

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const resetFormulario = () => {
    setModoColectivo(false);
    setDocenteReportaId('');
    setLugarId('');
    setFechaIncidente(getTodayLocalDate());
    setHoraIncidente(getCurrentLocalTime());
    setDescripcionHechos('');
    setSugerenciaDocentePendiente(null);
    setAlertaDocenteNoMencionado(false);
    setSugerenciaLugarPendiente(null);
    setAlertaLugarNoMencionado(false);
    setInvolucrados([
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
  };

  const handleCerrar = () => {
    resetFormulario();
    onClose();
  };

  const reportarError = (mensaje: string, targetSelector?: string) => {
    notify.formError('Atención: Formulario incompleto', mensaje, targetSelector);
  };

  useLockBodyScroll(isOpen);

  // Cierre con tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCerrar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Cargar catálogos y restablecer formulario al abrir modal
  useEffect(() => {
    if (isOpen) {
      cargarCatalogos();
      if (initialData) {
        handleAplicarResultadoIa(initialData);
      } else {
        resetFormulario();
      }
    }
  }, [isOpen, initialData]);

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
      notify.error('Error de catálogos', 'No se pudieron cargar los catálogos institucionales: ' + e.message);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!docenteReportaId) {
      const msg = sugerenciaDocentePendiente
        ? `Docente informante pendiente de vincular: "${sugerenciaDocentePendiente}". Debe seleccionar al funcionario correspondiente de la lista institucional.`
        : 'Debe seleccionar el docente o funcionario que reporta el incidente.';
      reportarError(msg, '#select-docente-reporta');
      return;
    }
    if (!lugarId) {
      const msg = sugerenciaLugarPendiente
        ? `Lugar institucional pendiente de vincular: "${sugerenciaLugarPendiente}". Debe seleccionar la ubicación oficial del catálogo.`
        : 'Debe seleccionar el lugar institucional del hecho.';
      reportarError(msg, '#select-lugar-reporta');
      return;
    }
    if (!fechaIncidente) {
      reportarError('Indique la fecha del incidente.', '#input-fecha-incidente');
      return;
    }
    if (!descripcionHechos || descripcionHechos.trim().length < 10) {
      reportarError('La descripción fáctica de los hechos debe contener al menos 10 caracteres.', '#textarea-descripcion-hechos');
      return;
    }

    const sinSeleccionar = involucrados.find((inv) => !inv.estudianteId);
    if (sinSeleccionar) {
      const nombrePendiente = sinSeleccionar.busquedaEstudiante ? `"${sinSeleccionar.busquedaEstudiante}"` : 'estudiante sin vincular';
      reportarError(
        `Debe seleccionar un estudiante válido del censo escolar para cada involucrado. Pendiente: ${nombrePendiente}.`,
        `#input-buscar-estudiante-${sinSeleccionar.idTemp}`
      );
      return;
    }

    // Validar que todo agresor o partícipe tenga su falta tipificada obligatoriamente (Punto 2)
    const agresorSinFalta = involucrados.find(
      (inv) => (inv.rolEstudiante === 'AGRESOR_PRINCIPAL' || inv.rolEstudiante === 'PARTICIPE') && !inv.catalogoFaltaId
    );
    if (agresorSinFalta) {
      const nombreEstudiante = agresorSinFalta.estudianteSeleccionado
        ? `${agresorSinFalta.estudianteSeleccionado.nombres} ${agresorSinFalta.estudianteSeleccionado.apellidos}`
        : 'el estudiante involucrado';
      reportarError(
        `Debe seleccionar la falta disciplinaria tipificada (Ley 1620) para ${nombreEstudiante}.`,
        `#select-falta-${agresorSinFalta.idTemp}`
      );
      return;
    }

    // Validar que el caso tenga al menos una falta tipificada en general
    const tieneAlgunaFalta = involucrados.some((inv) => Boolean(inv.catalogoFaltaId));
    if (!tieneAlgunaFalta) {
      reportarError(
        'Todo incidente de convivencia escolar debe tipificarse con al menos una falta según la Ley 1620.',
        `#select-falta-${involucrados[0].idTemp}`
      );
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
      notify.success('Incidente registrado oficialmente', 'El caso ha sido anexado a la bitácora y hojas de vida de convivencia.');
      resetFormulario();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      reportarError(
        e.response?.data?.message || e.message || 'Error inesperado al registrar el incidente.'
      );
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overscroll-contain transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-registro-incidente-title"
    >
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[92vh] min-h-0 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-900 rounded-md border border-blue-100">
              <Shield className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h2 id="modal-registro-incidente-title" className="text-base font-bold text-slate-900 tracking-tight leading-none">
                Registrar Incidente de Convivencia Escolar
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sistema Integral de Debido Proceso y Tipificación según Ley 1620 de 2013
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCerrar}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario Principal con Cuerpo Scrolleable y Footer Fijo */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 overflow-hidden min-h-0">
          {/* Cuerpo Scrolleable */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 p-5 space-y-5 modal-scroll-body">
            {/* Asistente IA */}
            <AsistenteIaPanel onAplicar={handleAplicarResultadoIa} />

            {/* Paso 1: Contexto Institucional y Paso 2: Hechos Fácticos */}
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

            {/* Paso 3: Estudiantes Vinculados y Debido Proceso */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-xs font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-trujillo-sky" />
                    3. Estudiantes Vinculados y Debido Proceso ({involucrados.length})
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

              {/* Subcomponente: Lista Modular de Involucrados */}
              <div className="space-y-4">
                {involucrados.map((inv, idx) => (
                  <InvolucradoItemCard
                    key={inv.idTemp}
                    index={idx}
                    data={inv}
                    faltas={faltas}
                    modoColectivo={modoColectivo}
                    totalInvolucrados={involucrados.length}
                    onChange={(updated) => actualizarInvolucrado(idx, updated)}
                    onRemover={() => removerInvolucrado(idx)}
                    onErrorGlobal={(msg) => {
                      if (msg) notify.formError('Atención al involucrado', msg);
                    }}
                  />
                ))}

                {modoColectivo && (
                  <button
                    type="button"
                    onClick={agregarInvolucrado}
                    className="w-full py-2.5 border border-dashed border-sky-300 hover:border-trujillo-navy rounded-lg text-xs font-semibold text-trujillo-navy bg-sky-50/40 hover:bg-sky-50/80 flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
                  >
                    <Plus size={16} className="text-trujillo-sky" />
                    <span>Vincular Otro Estudiante al Mismo Incidente Colectivo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Fijo con Acciones */}
          <div className="bg-slate-50/95 backdrop-blur-xs px-5 py-3 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                <Users size={16} className="text-trujillo-sky" />
                {modoColectivo
                  ? `Caso Colectivo (${involucrados.length} involucrados)`
                  : 'Caso Individual (1 estudiante)'}
              </span>
              <span>•</span>
              <span className="text-[11px] text-slate-400">Ley 1620 y Debido Proceso</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleCerrar}
                disabled={guardando}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition active:scale-[0.97] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-trujillo-navy hover:bg-slate-800 disabled:opacity-50 text-xs font-semibold text-white shadow-2xs hover:shadow-xs transition active:scale-[0.97] cursor-pointer"
              >
                {guardando ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-trujillo-sky" />
                    <span>Guardando en Expediente...</span>
                  </>
                ) : (
                  <span>Registrar Incidente Oficial</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
