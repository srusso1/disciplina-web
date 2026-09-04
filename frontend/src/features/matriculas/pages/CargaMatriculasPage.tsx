import React, { useState, useRef, useEffect } from 'react';
import { matriculasApi } from '../api/matriculasApi';
import { ImportacionMatriculasResumen, EstudianteMatricula } from '../types/matricula.types';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Search, 
  Layers, 
  Clock, 
  X, 
  Loader2,
  FileCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil
} from 'lucide-react';
import { EditarEstudianteModal } from '../components/EditarEstudianteModal';

export const CargaMatriculasPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resumen, setResumen] = useState<ImportacionMatriculasResumen | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Explorador y Paginación en Base de Datos
  const [estudiantes, setEstudiantes] = useState<EstudianteMatricula[]>([]);
  const [filtroGrado, setFiltroGrado] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');
  const [busquedaAplicada, setBusquedaAplicada] = useState<string>('');
  const [recargarTrigger, setRecargarTrigger] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState<number>(0);
  const [tamanoPagina, setTamanoPagina] = useState<number>(15);
  const [totalElementos, setTotalElementos] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);
  const [isLoadingEstudiantes, setIsLoadingEstudiantes] = useState(false);

  // Estado del Modal de Edición
  const [estudianteAEditar, setEstudianteAEditar] = useState<EstudianteMatricula | null>(null);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAbrirEditar = (est: EstudianteMatricula) => {
    setEstudianteAEditar(est);
    setIsModalEditarOpen(true);
  };

  const handleCerrarEditar = () => {
    setIsModalEditarOpen(false);
    setEstudianteAEditar(null);
  };

  const handleEstudianteActualizado = (actualizado: EstudianteMatricula) => {
    setEstudiantes((prev) =>
      prev.map((e) => (e.id === actualizado.id ? actualizado : e))
    );
  };

  // Cargar estudiantes matriculados con protección contra condiciones de carrera
  useEffect(() => {
    let cancelado = false;

    const cargar = async () => {
      setIsLoadingEstudiantes(true);
      try {
        const data = await matriculasApi.listarEstudiantes({
          page: paginaActual,
          size: tamanoPagina,
          anioLectivo: 2026,
          grado: filtroGrado || undefined,
          busqueda: busquedaAplicada || undefined,
        });
        if (!cancelado) {
          setEstudiantes(data.contenido);
          setTotalElementos(data.totalElementos);
          setTotalPaginas(data.totalPaginas);
        }
      } catch (err) {
        if (!cancelado) {
          console.error('Error cargando estudiantes', err);
        }
      } finally {
        if (!cancelado) {
          setIsLoadingEstudiantes(false);
        }
      }
    };

    cargar();

    return () => {
      cancelado = true;
    };
  }, [filtroGrado, busquedaAplicada, paginaActual, tamanoPagina, recargarTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(0);
    setBusquedaAplicada(busqueda.trim());
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBusqueda(val);
    if (!val.trim() && busquedaAplicada) {
      setBusquedaAplicada('');
      setPaginaActual(0);
    }
  };

  const handleGradoChange = (g: string) => {
    setFiltroGrado(g);
    setPaginaActual(0);
  };

  const handlePageChange = (nuevaPagina: number) => {
    if (nuevaPagina >= 0 && nuevaPagina < totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validarYEstablecerArchivo(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validarYEstablecerArchivo(e.target.files[0]);
    }
  };

  const validarYEstablecerArchivo = (selectedFile: File) => {
    setErrorMessage(null);
    const validExtensions = ['.xlsx', '.xls'];
    const name = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some(ext => name.endsWith(ext));

    if (!isValid) {
      setErrorMessage('Formato no soportado. Por favor seleccione una hoja de cálculo Excel (.xlsx o .xls).');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const resultado = await matriculasApi.importarMasivo(file, 2026);
      setResumen(resultado);
      setPaginaActual(0);
      setRecargarTrigger((prev) => prev + 1);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Ocurrió un error al procesar la planilla. Verifique el formato e intente nuevamente.';
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const formatearTamano = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const gradosDisponibles = ['', '6', '7', '8', '9', '10', '11'];

  const desdeRegistro = totalElementos === 0 ? 0 : paginaActual * tamanoPagina + 1;
  const hastaRegistro = Math.min((paginaActual + 1) * tamanoPagina, totalElementos);

  return (
    <div className="space-y-6">
      {/* Cabecera Institucional */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-trujillo-ice text-trujillo-navy text-xs font-semibold border border-sky-200">
            <Layers className="w-3.5 h-3.5 text-trujillo-sky" />
            <span>Gestión Académica & Matrícula Anual</span>
          </div>
          <h1 className="text-2xl font-extrabold text-trujillo-dark mt-2 tracking-tight">
            Importador Masivo de Matrículas
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Carga de planillas oficiales Excel (.xlsx) con validación atómica y resolución automática de inconsistencias.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-sky-50 text-trujillo-navy border border-sky-200 text-xs font-bold flex items-center gap-2 shrink-0">
          <Clock className="w-4 h-4 text-trujillo-navy" />
          <span>Vigencia Escolar: 2026</span>
        </div>
      </div>

      {/* Zona Drag & Drop para Carga de Excel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h2 className="text-base font-bold text-trujillo-dark">
            Subir Planilla de Matrícula
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arrastre el archivo exportado de secretaría académica o selecciónelo desde su equipo.
          </p>
        </div>

        {/* Drag and Drop Container */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer ${
            isDragging
              ? 'border-trujillo-navy bg-trujillo-ice/60 scale-[1.01]'
              : file
              ? 'border-emerald-300 bg-emerald-50/30'
              : 'border-slate-300 hover:border-trujillo-navy/50 hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          {!file ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-trujillo-ice border border-trujillo-sky/30 text-trujillo-navy flex items-center justify-center mb-4 shadow-inner">
                <UploadCloud className="w-8 h-8 text-trujillo-navy" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Arrastre su planilla Excel aquí o haga clic para explorar
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Archivos compatibles: Microsoft Excel (.xlsx, .xls) hasta 25 MB
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                Seleccionar Archivo
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-emerald-200 shadow-xs max-w-lg mx-auto">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                  <p className="text-[11px] text-slate-500">{formatearTamano(file.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setResumen(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Eliminar archivo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Botón de Acción Principal */}
        {file && !resumen && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-trujillo-navy hover:bg-trujillo-navy-light disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-trujillo-navy/20 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-trujillo-sky" />
                  <span>Procesando e Importando en Lote...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 text-trujillo-sky" />
                  <span>Iniciar Importación de Matrículas</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Resumen de Resultados de Importación */}
      {resumen && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filas Procesadas</span>
              <p className="text-3xl font-black text-trujillo-dark mt-2">{resumen.totalFilasLeidas}</p>
              <p className="text-[11px] text-slate-400 mt-1">En {resumen.tiempoProcesamientoMs} ms</p>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-card border-l-4 border-l-emerald-500">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Estudiantes Creados</span>
              <p className="text-3xl font-black text-emerald-900 mt-2">{resumen.estudiantesCreados}</p>
              <p className="text-[11px] text-slate-500 mt-1">Nuevos en base de datos</p>
            </div>

            <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-card border-l-4 border-l-sky-500">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">Matrículas Vinculadas</span>
              <p className="text-3xl font-black text-sky-900 mt-2">{resumen.matriculasCreadas}</p>
              <p className="text-[11px] text-slate-500 mt-1">Asignadas a la vigencia 2026</p>
            </div>

            <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-card border-l-4 border-l-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Inconsistencias Resueltas</span>
              <p className="text-3xl font-black text-amber-900 mt-2">{resumen.advertencias.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Subsanadas con identificador</p>
            </div>
          </div>

          {/* Tabla de Advertencias e Inconsistencias Subsanadas */}
          {resumen.advertencias.length > 0 && (
            <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2.5 text-amber-800">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold">
                    Trazabilidad de Inconsistencias Subsanadas Automáticamente
                  </h3>
                  <p className="text-xs text-slate-500">
                    Se generaron identificadores provisorios para documentos en 0 o se actualizaron grupos duplicados.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
                  <thead className="bg-amber-50 text-amber-900 font-semibold uppercase tracking-wider border-b border-amber-100">
                    <tr>
                      <th className="px-3 py-2.5">Fila Excel</th>
                      <th className="px-3 py-2.5">Código</th>
                      <th className="px-3 py-2.5">Estudiante</th>
                      <th className="px-3 py-2.5">Inconsistencia Detectada</th>
                      <th className="px-3 py-2.5">Acción Aplicada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resumen.advertencias.map((adv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono font-bold text-slate-700">{adv.fila}</td>
                        <td className="px-3 py-2 font-mono text-slate-600">{adv.codigo}</td>
                        <td className="px-3 py-2 font-semibold text-slate-800">{adv.estudiante}</td>
                        <td className="px-3 py-2 text-amber-800 font-medium">{adv.motivo}</td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                            {adv.accionTomada}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Explorador de Estudiantes Matriculados Paginado */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-trujillo-dark flex items-center gap-2">
              <Users className="w-5 h-5 text-trujillo-navy" />
              <span>Estudiantes Matriculados en Vigencia 2026</span>
            </h2>
            <p className="text-xs text-slate-500">
              Total de alumnos activos: <span className="font-bold text-trujillo-navy">{totalElementos}</span>
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={handleBusquedaChange}
              placeholder="Buscar por nombre, documento..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-trujillo-navy focus:ring-1 focus:ring-trujillo-navy/20"
            />
          </form>
        </div>

        {/* Filtro por Grado */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filtrar Grado:</span>
          {gradosDisponibles.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGradoChange(g)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filtroGrado === g
                  ? 'bg-trujillo-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g === '' ? 'Todos' : `Grado ${g}°`}
            </button>
          ))}
        </div>

        {/* Tabla de Estudiantes */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5">Documento</th>
                <th className="px-3 py-2.5">Nombre Completo</th>
                <th className="px-3 py-2.5">Grado / Grupo</th>
                <th className="px-3 py-2.5">Jornada</th>
                <th className="px-3 py-2.5">Acudiente</th>
                <th className="px-3 py-2.5">Teléfono Contacto</th>
                <th className="px-3 py-2.5">Estado</th>
                <th className="px-3 py-2.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingEstudiantes ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-trujillo-navy" />
                    <span>Consultando base de datos...</span>
                  </td>
                </tr>
              ) : estudiantes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron estudiantes para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                estudiantes.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-mono font-medium text-slate-700">
                      {est.documento.startsWith('PENDIENTE_') ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          {est.documento}
                        </span>
                      ) : (
                        est.documento
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">
                      {est.nombreCompleto}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-trujillo-navy border border-sky-200 font-bold">
                        {est.grado}° - {est.grupo}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{est.jornada}</td>
                    <td className="px-3 py-2.5 text-slate-600">{est.nombreAcudiente}</td>
                    <td className="px-3 py-2.5 text-slate-600 font-mono">{est.telefonoAcudiente}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{est.estadoMatricula}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleAbrirEditar(est)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-trujillo-navy hover:text-white bg-sky-50 hover:bg-trujillo-navy rounded-lg border border-sky-200 hover:border-trujillo-navy transition-all duration-150 active:scale-[0.98] cursor-pointer"
                        title="Editar datos del estudiante"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Barra de Paginación Inteligente */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>
              Mostrando <span className="font-semibold text-trujillo-dark">{desdeRegistro}</span> a{' '}
              <span className="font-semibold text-trujillo-dark">{hastaRegistro}</span> de{' '}
              <span className="font-semibold text-trujillo-dark">{totalElementos}</span> estudiantes
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Por página:</span>
              <select
                value={tamanoPagina}
                onChange={(e) => {
                  setTamanoPagina(Number(e.target.value));
                  setPaginaActual(0);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-trujillo-navy"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(0)}
              disabled={paginaActual === 0 || isLoadingEstudiantes}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]"
              title="Primera página"
            >
              <ChevronsLeft className="w-4 h-4 text-slate-600" />
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(paginaActual - 1)}
              disabled={paginaActual === 0 || isLoadingEstudiantes}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>

            <span className="px-3 py-1 font-semibold text-trujillo-navy bg-trujillo-ice border border-sky-200 rounded-lg">
              Página {totalPaginas === 0 ? 0 : paginaActual + 1} de {totalPaginas}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(paginaActual + 1)}
              disabled={paginaActual >= totalPaginas - 1 || isLoadingEstudiantes}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]"
              title="Página siguiente"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(totalPaginas - 1)}
              disabled={paginaActual >= totalPaginas - 1 || isLoadingEstudiantes}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]"
              title="Última página"
            >
              <ChevronsRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Datos de Estudiante */}
      <EditarEstudianteModal
        estudiante={estudianteAEditar}
        isOpen={isModalEditarOpen}
        onClose={handleCerrarEditar}
        onSuccess={handleEstudianteActualizado}
      />
    </div>
  );
};