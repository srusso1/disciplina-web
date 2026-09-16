import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { matriculasApi } from '../../matriculas/api/matriculasApi';
import { EstudianteMatricula } from '../../matriculas/types/matricula.types';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { ExpedienteEstudianteModal } from '../../matriculas/components/ExpedienteEstudianteModal';
import {
  Users,
  Search,
  FolderOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  X,
  FileText,
  Phone,
} from 'lucide-react';

export const ExpedienteUnicoPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Estados de datos y filtros
  const [estudiantes, setEstudiantes] = useState<EstudianteMatricula[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [busquedaAplicada, setBusquedaAplicada] = useState<string>('');
  const [filtroGrado, setFiltroGrado] = useState<string>('');
  const [filtroGrupo, setFiltroGrupo] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState<number>(0);
  const [tamanoPagina, setTamanoPagina] = useState<number>(15);
  const [totalElementos, setTotalElementos] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);

  // Expediente modal
  const [expedienteEstudianteId, setExpedienteEstudianteId] = useState<number | null>(null);

  // Leer estudianteId de query param si existe al iniciar
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam && !isNaN(Number(idParam))) {
      setExpedienteEstudianteId(Number(idParam));
    }
  }, [searchParams]);

  // Carga de estudiantes con filtros y paginación
  useEffect(() => {
    const cargarEstudiantes = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await matriculasApi.listarEstudiantes({
          page: paginaActual,
          size: tamanoPagina,
          grado: filtroGrado || undefined,
          grupo: filtroGrupo || undefined,
          busqueda: busquedaAplicada || undefined,
        });

        setEstudiantes(res.contenido);
        setTotalElementos(res.totalElementos);
        setTotalPaginas(res.totalPaginas);
      } catch (err) {
        console.error('Error al cargar lista de estudiantes:', err);
        setError(extraerMensajeError(err, 'No fue posible cargar el listado de estudiantes.'));
      } finally {
        setCargando(false);
      }
    };

    cargarEstudiantes();
  }, [paginaActual, tamanoPagina, filtroGrado, filtroGrupo, busquedaAplicada]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(0);
    setBusquedaAplicada(busqueda.trim());
  };

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setBusquedaAplicada('');
    setFiltroGrado('');
    setFiltroGrupo('');
    setPaginaActual(0);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Barra de Título Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-slate-700" />
            Expediente Único del Estudiante
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidado histórico de convivencia, antecedentes disciplinarios y debido proceso (Ley 1620).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Año Lectivo {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* Tarjetas Métricas KPI Compactas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Población Activa
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 leading-tight mt-1">
            {totalElementos}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Alumnos matriculados en vigencia escolar
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              Cobertura Curricular
            </span>
            <GraduationCap className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 leading-tight mt-1">
            Grados 6° a 11°
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Educación Básica Secundaria y Media
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Garantía Legal
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 leading-tight mt-1">
            Ley 1620 / 2013
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Debido proceso y reserva legal de la información
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contenedor de Tabla con Toolbar Integrado */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {/* Toolbar de búsqueda y filtros adaptable */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/60">
          <form onSubmit={handleBuscar} className="flex flex-col gap-2.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por documento, nombre o apellido..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-800"
                />
                {busqueda && (
                  <button
                    type="button"
                    onClick={() => setBusqueda('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <select
                  value={filtroGrado}
                  onChange={(e) => {
                    setFiltroGrado(e.target.value);
                    setPaginaActual(0);
                  }}
                  className="w-full sm:w-auto h-10 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-medium"
                >
                  <option value="">Todos los Grados</option>
                  <option value="6">Grado 6°</option>
                  <option value="7">Grado 7°</option>
                  <option value="8">Grado 8°</option>
                  <option value="9">Grado 9°</option>
                  <option value="10">Grado 10°</option>
                  <option value="11">Grado 11°</option>
                </select>

                <select
                  value={filtroGrupo}
                  onChange={(e) => {
                    setFiltroGrupo(e.target.value);
                    setPaginaActual(0);
                  }}
                  className="w-full sm:w-auto h-10 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-medium"
                >
                  <option value="">Todos los Grupos</option>
                  <option value="1">Grupo 1</option>
                  <option value="2">Grupo 2</option>
                  <option value="3">Grupo 3</option>
                  <option value="4">Grupo 4</option>
                  <option value="5">Grupo 5</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial h-10 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Filtrar</span>
                </button>

                {(busquedaAplicada || filtroGrado || filtroGrupo) && (
                  <button
                    type="button"
                    onClick={handleLimpiarFiltros}
                    className="h-10 px-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center justify-between pt-1">
              <span>Filtro activo: {filtroGrado ? `Grado ${filtroGrado}°` : 'Todos'} {filtroGrupo ? `- Grupo ${filtroGrupo}` : ''}</span>
              <span>Total: <strong className="text-slate-800">{totalElementos}</strong> estudiantes</span>
            </div>
          </form>
        </div>

        {/* Vista Móvil: Tarjetas Desacopladas Touch-Friendly */}
        <div className="sm:hidden divide-y divide-slate-100">
          {cargando ? (
            <div className="py-12 text-center text-slate-500">
              <Loader2 className="w-7 h-7 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-sm font-medium text-slate-600">Cargando directorio de estudiantes...</p>
            </div>
          ) : estudiantes.length === 0 ? (
            <div className="py-12 px-4 text-center text-slate-500">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-base font-medium text-slate-700">No se encontraron registros</p>
              <p className="text-xs text-slate-400 mt-1">
                Ajusta los filtros de búsqueda o verifica que la matrícula anual esté importada.
              </p>
            </div>
          ) : (
            estudiantes.map((est) => (
              <div key={`mob-est-${est.id}`} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {est.apellidos}, {est.nombres}
                    </h3>
                    <div className="text-xs font-mono text-slate-500 mt-0.5">
                      Doc: {est.documento}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border shrink-0 ${
                      est.estadoMatricula === 'ACTIVO'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : est.estadoMatricula === 'GRADUADO'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {est.estadoMatricula}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Grado y Grupo:</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-bold">
                    {est.grado}° - {est.grupo}
                  </span>
                </div>

                {est.nombreAcudiente && (
                  <div className="text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                    <div className="text-slate-500 text-[11px] font-medium">Información del Acudiente:</div>
                    <div className="font-semibold text-slate-800">{est.nombreAcudiente}</div>
                    {est.telefonoAcudiente && (
                      <div className="flex items-center gap-1 font-mono text-slate-700 text-xs pt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{est.telefonoAcudiente}</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setExpedienteEstudianteId(est.id)}
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-900 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-[0.99]"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Ver Expediente Integral</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Tabla Estructurada en Escritorio */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">

            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-3.5">Documento</th>
                <th className="py-3 px-3.5">Nombres y Apellidos</th>
                <th className="py-3 px-3.5 text-center">Grado-Grupo</th>
                <th className="py-3 px-3.5 text-center">Estado Matrícula</th>
                <th className="py-3 px-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {cargando ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-7 h-7 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-medium text-slate-600">Cargando directorio de estudiantes...</p>
                  </td>
                </tr>
              ) : estudiantes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="text-base font-medium text-slate-700">No se encontraron registros</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Ajusta los filtros de búsqueda o verifica que la matrícula anual esté importada.
                    </p>
                  </td>
                </tr>
              ) : (
                estudiantes.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 font-mono text-sm font-medium text-slate-800">
                      {est.documento}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-900 text-sm">
                        {est.apellidos}, {est.nombres}
                      </div>
                      {est.nombreAcudiente && (
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>Acudiente: {est.nombreAcudiente}</span>
                          {est.telefonoAcudiente && (
                            <span className="flex items-center gap-0.5 font-mono text-slate-600">
                              <Phone className="w-3 h-3" />
                              {est.telefonoAcudiente}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs">
                        {est.grado}° - {est.grupo}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                          est.estadoMatricula === 'ACTIVO'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : est.estadoMatricula === 'GRADUADO'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {est.estadoMatricula}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setExpedienteEstudianteId(est.id)}
                        className="h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-blue-900 rounded-lg shadow-2xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Ver expediente e historial integral"
                      >
                        <FileText size={15} className="text-slate-500" />
                        <span>Ver Expediente</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!cargando && totalElementos > 0 && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600 font-medium">
            <div>
              Mostrando <strong className="text-slate-800">{paginaActual * tamanoPagina + 1}</strong> a{' '}
              <strong className="text-slate-800">
                {Math.min((paginaActual + 1) * tamanoPagina, totalElementos)}
              </strong>{' '}
              de <strong className="text-slate-800">{totalElementos}</strong> estudiantes
            </div>

            <div className="flex items-center gap-2">
              <select
                value={tamanoPagina}
                onChange={(e) => {
                  setTamanoPagina(Number(e.target.value));
                  setPaginaActual(0);
                }}
                className="h-8 px-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700"
              >
                <option value={10}>10 / pág</option>
                <option value={15}>15 / pág</option>
                <option value={25}>25 / pág</option>
                <option value={50}>50 / pág</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaginaActual(0)}
                  disabled={paginaActual === 0}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:pointer-events-none text-slate-600 cursor-pointer"
                  title="Primera página"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual((p) => Math.max(0, p - 1))}
                  disabled={paginaActual === 0}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:pointer-events-none text-slate-600 cursor-pointer"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-semibold text-slate-800 font-mono">
                  {paginaActual + 1} / {totalPaginas || 1}
                </span>
                <button
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas - 1, p + 1))}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:pointer-events-none text-slate-600 cursor-pointer"
                  title="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual(totalPaginas - 1)}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:pointer-events-none text-slate-600 cursor-pointer"
                  title="Última página"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Integral de Expediente */}
      <ExpedienteEstudianteModal
        estudianteId={expedienteEstudianteId}
        isOpen={expedienteEstudianteId !== null}
        onClose={() => setExpedienteEstudianteId(null)}
      />
    </div>
  );
};
