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

export const RegistrarIncidenteModal: React.FC<RegistrarIncidenteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [docentes, setDocentes] = useState<DocenteCatalogo[]>([]);
  const [lugares, setLugares] = useState<LugarCatalogo[]>([]);
  const [faltas, setFaltas] = useState<CatalogoFalta[]>([]);

  const [docenteReportaId, setDocenteReportaId] = useState<number | ''>('');
  const [lugarId, setLugarId] = useState<number | ''>('');
  const [fechaIncidente, setFechaIncidente] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [horaIncidente, setHoraIncidente] = useState<string>(
    new Date().toTimeString().slice(0, 5)
  );
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

  useEffect(() => {
    if (isOpen) {
      cargarCatalogos();
      setErrorGlobal(null);
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
    // Validar si el estudiante ya fue agregado en otro slot
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
      busquedaEstudiante: `${est.nombres} ${est.apellidos} (${est.documento})`,
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
        rolEstudiante: prev.length === 0 ? 'AGRESOR_PRINCIPAL' : 'PARTICIPE',
        descripcionIndividual: '',
      },
    ]);
  };

  const removerInvolucrado = (indice: number) => {
    if (involucrados.length <= 1) return;
    setInvolucrados((prev) => prev.filter((_, idx) => idx !== indice));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGlobal(null);

    if (!docenteReportaId) {
      setErrorGlobal('Seleccione el docente que reporta el incidente.');
      return;
    }
    if (!lugarId) {
      setErrorGlobal('Seleccione el lugar del incidente.');
      return;
    }
    if (!fechaIncidente) {
      setErrorGlobal('Indique la fecha del incidente.');
      return;
    }
    if (!descripcionHechos || descripcionHechos.trim().length < 10) {
      setErrorGlobal('La descripción de los hechos debe tener al menos 10 caracteres.');
      return;
    }

    // Validar involucrados
    const estudiantesSinSeleccionar = involucrados.filter((inv) => !inv.estudianteId);
    if (estudiantesSinSeleccionar.length > 0) {
      setErrorGlobal('Hay involucrados sin un estudiante seleccionado.');
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
      horaIncidente: horaIncidente || '08:00',
      descripcionHechos: descripcionHechos.trim(),
      involucrados: payloadInvolucrados,
    };

    setGuardando(true);
    try {
      await incidentesApi.registrar(data);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = e.response?.data?.message || e.message || 'Error al registrar el expediente.';
      setErrorGlobal(msg);
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-trujillo-navy text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-trujillo-navy-light rounded-xl border border-sky-400/30">
              <Shield className="w-5 h-5 text-trujillo-sky" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Registrar Incidente Escolar</h2>
              <p className="text-xs text-sky-200/80">Debido Proceso & Convivencia Institucional (Ley 1620)</p>
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

        {/* Body Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorGlobal && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Atención</p>
                <p>{errorGlobal}</p>
              </div>
            </div>
          )}

          {/* Bloque 1: Datos Generales del Hecho */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-trujillo-sky" />
              1. Contexto del Incidente
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Docente Reporta */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  Docente o Funcionario que Reporta *
                </label>
                <select
                  value={docenteReportaId}
                  onChange={(e) => setDocenteReportaId(Number(e.target.value))}
                  disabled={cargandoCatalogos}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition"
                  required
                >
                  <option value="">Seleccione docente...</option>
                  {docentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombreCompleto} ({d.areaDesempeno})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lugar */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Lugar Institucional *
                </label>
                <select
                  value={lugarId}
                  onChange={(e) => setLugarId(Number(e.target.value))}
                  disabled={cargandoCatalogos}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition"
                  required
                >
                  <option value="">Seleccione lugar...</option>
                  {lugares.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Fecha del Suceso *
                </label>
                <input
                  type="date"
                  value={fechaIncidente}
                  onChange={(e) => setFechaIncidente(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition"
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
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition"
                  required
                />
              </div>
            </div>

            {/* Descripcion de los hechos */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción Objetiva y Circunstanciada de los Hechos *
              </label>
              <textarea
                value={descripcionHechos}
                onChange={(e) => setDescripcionHechos(e.target.value)}
                placeholder="Describa de manera cronológica y objetiva qué sucedió, cómo ocurrió y quiénes intervinieron inicialmente..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition placeholder:text-slate-400"
                required
              />
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mínimo 10 caracteres. Mantenga un lenguaje objetivo sin emitir juicios de valor sancionatorios.
              </p>
            </div>
          </div>

          {/* Bloque 2: Estudiantes Involucrados (Soporte Caso Individual y Colectivo N>=1) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-trujillo-navy uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-trujillo-sky" />
                  2. Estudiantes Involucrados ({involucrados.length})
                </h3>
                <p className="text-xs text-slate-500">
                  {involucrados.length === 1
                    ? 'Caso Individual: configure el estudiante infractor o afectado.'
                    : 'Caso Colectivo: asigne el rol individual y la tipificación de cada estudiante.'}
                </p>
              </div>

              <button
                type="button"
                onClick={agregarInvolucrado}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-trujillo-ice text-trujillo-navy hover:bg-sky-100 text-xs font-semibold border border-sky-200 transition"
              >
                <Plus className="w-3.5 h-3.5 text-trujillo-sky" />
                <span>Agregar Otro Estudiante</span>
              </button>
            </div>

            {involucrados.map((inv, idx) => (
              <div
                key={inv.idTemp}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 relative hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Estudiante #{idx + 1}
                  </span>

                  {involucrados.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removerInvolucrado(idx)}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                      title="Quitar estudiante de la lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Búsqueda de Estudiante */}
                  <div className="lg:col-span-3 relative">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Buscar Estudiante (Nombre, Apellido o Documento) *
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={inv.busquedaEstudiante}
                        onChange={(e) => buscarEstudiantes(idx, e.target.value)}
                        placeholder="Escriba para buscar estudiante..."
                        className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition"
                      />
                      {inv.buscando && (
                        <Loader2 className="w-4 h-4 text-trujillo-sky animate-spin absolute right-3 top-3" />
                      )}
                    </div>

                    {/* Resultados de búsqueda dropdown */}
                    {inv.resultadosBusqueda.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-slate-100">
                        {inv.resultadosBusqueda.map((est) => (
                          <button
                            key={est.id}
                            type="button"
                            onClick={() => seleccionarEstudiante(idx, est)}
                            className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-slate-50 transition flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-slate-800">
                                {est.nombres} {est.apellidos}
                              </p>
                              <p className="text-slate-500">
                                Doc: {est.documento} | Grado: {est.grado} - Grupo: {est.grupo}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-trujillo-ice text-trujillo-navy text-[10px] font-semibold">
                              Seleccionar
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {inv.estudianteSeleccionado && (
                      <div className="mt-2 p-2.5 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
                        <div className="text-xs">
                          <span className="font-bold text-trujillo-navy">
                            {inv.estudianteSeleccionado.nombres} {inv.estudianteSeleccionado.apellidos}
                          </span>
                          <span className="text-slate-500 ml-2">
                            (Doc: {inv.estudianteSeleccionado.documento} | Grado Snapshot: {inv.estudianteSeleccionado.grado}-{inv.estudianteSeleccionado.grupo})
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-trujillo-navy bg-white px-2 py-0.5 rounded-md border border-sky-300">
                          Matriculado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rol en el Incidente */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rol en el Incidente *
                    </label>
                    <select
                      value={inv.rolEstudiante}
                      onChange={(e) =>
                        actualizarInvolucrado(idx, {
                          rolEstudiante: e.target.value as RolEstudianteIncidente,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky transition font-medium"
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
                      Falta Tipificada (Ley 1620 / Manual Convivencia)
                    </label>
                    <select
                      value={inv.catalogoFaltaId || ''}
                      onChange={(e) =>
                        actualizarInvolucrado(idx, {
                          catalogoFaltaId: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky transition"
                    >
                      <option value="">Sin falta tipificada (Afectado o Testigo)</option>
                      {faltas.map((f) => (
                        <option key={f.id} value={f.id}>
                          [{f.codigo}] {f.clasificacionLey} ({f.gravedadInstitucional}) - {f.descripcion.slice(0, 60)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Detalle Individual Opcional */}
                  <div className="lg:col-span-3">
                    <input
                      type="text"
                      value={inv.descripcionIndividual}
                      onChange={(e) =>
                        actualizarInvolucrado(idx, { descripcionIndividual: e.target.value })
                      }
                      placeholder="Observación individual sobre la conducta o participación de este estudiante..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky transition"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200/70 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={guardando}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-trujillo-navy hover:bg-trujillo-navy-light rounded-xl shadow-md shadow-trujillo-navy/20 transition disabled:opacity-50"
          >
            {guardando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-trujillo-sky" />
                <span>Registrando Expediente...</span>
              </>
            ) : (
              <span>Registrar Expediente</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
