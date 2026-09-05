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
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  X,
  Sparkles
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
    <div className="space-y-6 pb-12">
      {/* Header Institucional */}
      <div className="bg-gradient-to-r from-trujillo-dark via-slate-900 to-trujillo-navy rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-trujillo-sky/20 border border-trujillo-sky/30 text-xs font-semibold text-trujillo-sky mb-2">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Gestión de Convivencia Escolar • CU-08</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Expediente Único del Estudiante
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Consolidado histórico de convivencia, antecedentes disciplinarios, actas de descargos y planes de intervención pedagógica.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Año Lectivo</span>
              <span className="text-lg font-black text-trujillo-sky">{new Date().getFullYear()}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Alumnos</span>
              <span className="text-lg font-black text-white">{totalElementos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Información Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-trujillo-sky/10 text-trujillo-sky flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Población Activa</span>
            <p className="text-xl font-extrabold text-slate-800">{totalElementos} Estudiantes</p>
            <span className="text-xs text-slate-500">Registrados en matrículas {new Date().getFullYear()}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-trujillo-navy/10 text-trujillo-navy flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Cobertura Curricular</span>
            <p className="text-xl font-extrabold text-slate-800">Grados 6° a 11°</p>
            <span className="text-xs text-slate-500">Educación Básica y Media</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Debido Proceso</span>
            <p className="text-xl font-extrabold text-slate-800">Ley 1620 / 2013</p>
            <span className="text-xs text-slate-500">Trazabilidad inmutable por snapshot</span>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleBuscar} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por documento, nombre o apellido del estudiante..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 focus:border-trujillo-sky"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filtroGrado}
              onChange={(e) => {
                setFiltroGrado(e.target.value);
                setPaginaActual(0);
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 focus:border-trujillo-sky"
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
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 focus:border-trujillo-sky"
            >
              <option value="">Todos los Grupos</option>
              <option value="01">Grupo 01</option>
              <option value="02">Grupo 02</option>
              <option value="03">Grupo 03</option>
              <option value="04">Grupo 04</option>
              <option value="05">Grupo 05</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Filtrar</span>
            </button>

            {(busquedaAplicada || filtroGrado || filtroGrupo) && (
              <button
                type="button"
                onClick={handleLimpiarFiltros}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium flex items-center gap-1.5 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabla de Estudiantes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {cargando ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-trujillo-sky" />
            <p className="text-xs font-semibold uppercase tracking-wider">Cargando directorio de estudiantes...</p>
          </div>
        ) : estudiantes.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No se encontraron estudiantes</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Intenta modificar los filtros de búsqueda o verifica que la matrícula anual esté importada.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Documento</th>
                  <th className="px-5 py-3.5">Estudiante</th>
                  <th className="px-5 py-3.5 text-center">Grado / Grupo</th>
                  <th className="px-5 py-3.5">Acudiente</th>
                  <th className="px-5 py-3.5">Contacto</th>
                  <th className="px-5 py-3.5 text-center">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {estudiantes.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">
                      {est.documento}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-800">
                        {est.apellidos}, {est.nombres}
                      </div>
                      <div className="text-xs text-slate-400">ID #{est.id}</div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-trujillo-sky/10 border border-trujillo-sky/30 text-trujillo-navy font-black text-xs">
                        {est.grado}° - {est.grupo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      <div className="font-semibold text-slate-700">{est.nombreAcudiente || 'Sin registro'}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      {est.telefonoAcudiente ? (
                        <a
                          href={`tel:${est.telefonoAcudiente}`}
                          className="inline-flex items-center gap-1.5 text-slate-700 hover:text-trujillo-sky font-medium font-mono"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{est.telefonoAcudiente}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">Sin teléfono</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          est.estadoMatricula === 'ACTIVO'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : est.estadoMatricula === 'GRADUADO'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {est.estadoMatricula}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setExpedienteEstudianteId(est.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-trujillo-sky/10 hover:bg-trujillo-sky hover:text-white text-trujillo-navy text-xs font-bold transition-all duration-150 active:scale-95 border border-trujillo-sky/30"
                        title="Ver expediente e historial integral"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Abrir Expediente</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {!cargando && totalPaginas > 1 && (
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-medium">
            <div>
              Mostrando página <strong className="text-slate-800">{paginaActual + 1}</strong> de{' '}
              <strong className="text-slate-800">{totalPaginas}</strong> ({totalElementos} estudiantes en total)
            </div>

            <div className="flex items-center gap-2">
              <select
                value={tamanoPagina}
                onChange={(e) => {
                  setTamanoPagina(Number(e.target.value));
                  setPaginaActual(0);
                }}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
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
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700"
                  title="Primera página"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual((p) => Math.max(0, p - 1))}
                  disabled={paginaActual === 0}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-bold text-slate-800">
                  {paginaActual + 1} / {totalPaginas}
                </span>
                <button
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas - 1, p + 1))}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700"
                  title="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPaginaActual(totalPaginas - 1)}
                  disabled={paginaActual >= totalPaginas - 1}
                  className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700"
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
