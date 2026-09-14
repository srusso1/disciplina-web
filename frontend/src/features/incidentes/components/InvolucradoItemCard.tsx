import React, { useState, useEffect } from 'react';
import {
  Search,
  AlertTriangle,
  GraduationCap,
  Trash2,
  Loader2,
  Shield,
  Users,
} from 'lucide-react';
import { matriculasApi } from '../../matriculas/api/matriculasApi';
import { EstudianteMatricula } from '../../matriculas/types/matricula.types';
import { CatalogoFalta, RolEstudianteIncidente } from '../types/incidente.types';
import { useDebounce } from '../../../core/hooks/useDebounce';

export interface InvolucradoItemData {
  idTemp: string;
  estudianteId: number | null;
  estudianteSeleccionado: EstudianteMatricula | null;
  busquedaEstudiante: string;
  catalogoFaltaId: number | null;
  rolEstudiante: RolEstudianteIncidente;
  descripcionIndividual: string;
}

interface InvolucradoItemCardProps {
  index: number;
  data: InvolucradoItemData;
  faltas: CatalogoFalta[];
  modoColectivo: boolean;
  totalInvolucrados: number;
  onChange: (updated: Partial<InvolucradoItemData>) => void;
  onRemover: () => void;
  onErrorGlobal: (msg: string | null) => void;
}

export const InvolucradoItemCard: React.FC<InvolucradoItemCardProps> = React.memo(({
  index,
  data,
  faltas,
  modoColectivo,
  totalInvolucrados,
  onChange,
  onRemover,
  onErrorGlobal,
}) => {
  const [searchTerm, setSearchTerm] = useState(data.busquedaEstudiante);
  const [resultados, setResultados] = useState<EstudianteMatricula[]>([]);
  const [buscando, setBuscando] = useState(false);

  // Debounce de 250ms para la búsqueda en servidor
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Sincronizar si cambia desde afuera (ej: cuando la IA aplica sugerencia)
  useEffect(() => {
    setSearchTerm(data.busquedaEstudiante);
  }, [data.busquedaEstudiante]);

  // Ejecutar búsqueda debounced
  useEffect(() => {
    if (data.estudianteId || !debouncedSearch || debouncedSearch.trim().length < 2) {
      setResultados([]);
      setBuscando(false);
      return;
    }

    let isMounted = true;
    setBuscando(true);

    matriculasApi
      .listarEstudiantes({ busqueda: debouncedSearch.trim(), size: 8 })
      .then((res) => {
        if (isMounted) {
          setResultados(res.contenido || []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setResultados([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setBuscando(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, data.estudianteId]);

  const handleSeleccionarEstudiante = (est: EstudianteMatricula) => {
    onErrorGlobal(null);
    setSearchTerm('');
    setResultados([]);
    onChange({
      estudianteId: est.id,
      estudianteSeleccionado: est,
      busquedaEstudiante: '',
    });
  };

  const handleDeseleccionar = () => {
    setSearchTerm('');
    setResultados([]);
    onChange({
      estudianteId: null,
      estudianteSeleccionado: null,
      busquedaEstudiante: '',
    });
  };

  const handleCambioRol = (nuevoRol: RolEstudianteIncidente) => {
    const esAfectado = nuevoRol === 'VICTIMA' || nuevoRol === 'TESTIGO';
    onChange({
      rolEstudiante: nuevoRol,
      catalogoFaltaId: esAfectado ? null : data.catalogoFaltaId,
    });
  };

  const esVictimaOTestigo = data.rolEstudiante === 'VICTIMA' || data.rolEstudiante === 'TESTIGO';

  return (
    <div id={`involucrado-card-${data.idTemp}`} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm space-y-3.5 relative">
      {/* Cabecera del Involucrado */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-trujillo-ice text-trujillo-navy text-xs font-bold flex items-center justify-center border border-sky-200">
            {index + 1}
          </div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            {modoColectivo ? `Involucrado #${index + 1}` : 'Estudiante del Caso'}
          </span>
        </div>

        {modoColectivo && totalInvolucrados > 1 && (
          <button
            type="button"
            onClick={onRemover}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition active:scale-[0.97] cursor-pointer"
            title="Quitar estudiante de la lista"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Selector o Ficha del Estudiante */}
      {data.estudianteSeleccionado ? (
        /* Ficha de Estudiante Seleccionado */
        <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-trujillo-navy text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {data.estudianteSeleccionado.nombres.charAt(0)}
              {data.estudianteSeleccionado.apellidos?.charAt(0) || ''}
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-trujillo-navy">
                {data.estudianteSeleccionado.nombres} {data.estudianteSeleccionado.apellidos}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                <span>Doc: <strong className="text-slate-700">{data.estudianteSeleccionado.documento}</strong></span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-trujillo-navy bg-white px-2 py-0.5 rounded border border-sky-200 text-xs">
                  <GraduationCap size={14} className="text-trujillo-sky" />
                  Grado {data.estudianteSeleccionado.grado}-{data.estudianteSeleccionado.grupo}
                </span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Matrícula Activa
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeseleccionar}
            className="self-start sm:self-auto px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition active:scale-[0.97] cursor-pointer"
          >
            Cambiar Estudiante
          </button>
        </div>
      ) : (
        /* Buscador de Estudiante Combobox con Debounce */
        <div className="relative">
          {/* Alerta contextual cuando la IA sugirió un nombre no matriculado */}
          {searchTerm && !data.estudianteId && (
            <div className="mb-2 bg-amber-50/80 border border-amber-200/90 rounded-lg p-3.5 flex gap-3 animate-in fade-in duration-150">
              <AlertTriangle className="text-amber-700 w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                  <span>Estudiante pendiente de vincular:</span>
                  <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 normal-case font-normal">
                    "{searchTerm}"
                  </span>
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                  La IA identificó este nombre en el relato, pero <strong>no coincide con ningún estudiante matriculado</strong> en el sistema institucional. Debe seleccionar a un alumno del censo para poder guardar el caso, o quitarlo si no es un estudiante del plantel.
                </p>
              </div>
            </div>
          )}

          <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
            Buscar Estudiante por Nombre, Apellido o Documento *
          </label>
          <div className="relative">
            <Search size={16} className="text-slate-400 absolute left-3 top-2.5" />
            <input
              id={`input-buscar-estudiante-${data.idTemp}`}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onChange({ busquedaEstudiante: e.target.value });
              }}
              autoComplete="off"
              spellCheck={false}
              name="student-search-query-no-autofill"
              placeholder="Escriba apellido, nombre o documento (ej: Gomez, 1066...)"
              className={`w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:ring-2 transition placeholder:text-slate-400 ${
                searchTerm && !data.estudianteId
                  ? 'border-amber-300 ring-1 ring-amber-200 focus:ring-amber-400 focus:border-amber-400'
                  : 'border-slate-300 focus:ring-blue-500/30 focus:border-blue-500'
              }`}
            />
            {buscando && (
              <Loader2 size={16} className="text-trujillo-sky animate-spin absolute right-3 top-2.5" />
            )}
          </div>

          {/* Dropdown de Búsqueda en Curso */}
          {buscando && searchTerm.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 text-center text-xs text-slate-500 flex items-center justify-center gap-2 animate-in fade-in duration-100">
              <Loader2 size={14} className="animate-spin text-blue-600" />
              <span>Buscando en el censo escolar...</span>
            </div>
          )}

          {/* Dropdown de Resultados de Búsqueda */}
          {!buscando && resultados.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-52 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-100">
              {resultados.map((est) => (
                <button
                  key={est.id}
                  type="button"
                  onClick={() => handleSeleccionarEstudiante(est)}
                  className="w-full px-3.5 py-2 text-left text-xs hover:bg-sky-50/70 transition flex items-center justify-between group cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-sky-100 text-trujillo-navy font-bold text-xs flex items-center justify-center shrink-0">
                      {est.nombres.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-trujillo-navy">
                        {est.nombres} {est.apellidos}
                      </p>
                      <p className="text-xs text-slate-500">
                        Doc: {est.documento} • Grado: {est.grado}-{est.grupo} ({est.jornada || 'DIURNA'})
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-trujillo-navy group-hover:text-white text-slate-700 text-xs font-semibold transition">
                    Seleccionar
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Dropdown flotante cuando no hay resultados */}
          {searchTerm.trim().length >= 2 && !buscando && resultados.length === 0 && !data.estudianteId && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-30 p-4 text-center animate-in fade-in duration-100">
              <Users size={22} className="mx-auto text-slate-300 mb-1.5 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-700">No se encontraron estudiantes</p>
              <p className="text-xs text-slate-500 mt-0.5">
                No hay coincidencias para &quot;{searchTerm}&quot;.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Verifique documento o apellidos, o confirme que la matrícula institucional esté importada en el sistema.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fila 1: Rol en el Hecho y Tipificación de Falta (2 columnas balanceadas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* Rol */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
            Rol en el Hecho *
          </label>
          <select
            value={data.rolEstudiante}
            onChange={(e) => handleCambioRol(e.target.value as RolEstudianteIncidente)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-trujillo-navy/20 focus:border-trujillo-navy transition font-medium text-slate-800"
          >
            <option value="AGRESOR_PRINCIPAL">Agresor Principal</option>
            <option value="PARTICIPE">Partícipe / Coautor</option>
            <option value="VICTIMA">Víctima / Agredido (Protegido)</option>
            <option value="TESTIGO">Testigo Presencial (Protegido)</option>
          </select>
        </div>

        {/* Tipificación de Falta Disciplinaria */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5 flex items-center justify-between">
            <span>
              Falta Tipificada (Ley 1620) {!esVictimaOTestigo && <span className="text-rose-500 font-bold">*</span>}
            </span>
            {esVictimaOTestigo && (
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Debido Proceso
              </span>
            )}
          </label>
          {esVictimaOTestigo ? (
            <div className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 flex items-center gap-2">
              <Shield size={16} className="text-sky-600 shrink-0" />
              <span className="truncate italic">Parte protegida (exenta de falta disciplinaria)</span>
            </div>
          ) : (
            <select
              id={`select-falta-${data.idTemp}`}
              value={data.catalogoFaltaId || ''}
              onChange={(e) =>
                onChange({
                  catalogoFaltaId: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-trujillo-navy/20 focus:border-trujillo-navy transition text-slate-800"
            >
              <option value="">Seleccione falta tipificada *...</option>
              {faltas.filter((f) => f.clasificacionLey === 'TIPO_I').length > 0 && (
                <optgroup label="Faltas Tipo I (Leves / Conflictos Cotidianos)">
                  {faltas
                    .filter((f) => f.clasificacionLey === 'TIPO_I')
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.codigo} — {f.descripcion}
                      </option>
                    ))}
                </optgroup>
              )}
              {faltas.filter((f) => f.clasificacionLey === 'TIPO_II').length > 0 && (
                <optgroup label="Faltas Tipo II (Graves / Agresiones y Riñas)">
                  {faltas
                    .filter((f) => f.clasificacionLey === 'TIPO_II')
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.codigo} — {f.descripcion}
                      </option>
                    ))}
                </optgroup>
              )}
              {faltas.filter((f) => f.clasificacionLey === 'TIPO_III').length > 0 && (
                <optgroup label="Faltas Tipo III (Gravísimas / Presuntos Delitos)">
                  {faltas
                    .filter((f) => f.clasificacionLey === 'TIPO_III')
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.codigo} — {f.descripcion}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          )}
          {!esVictimaOTestigo && faltas.length === 0 && (
            <p className="text-xs text-amber-700 mt-1 flex items-center gap-1 font-medium">
              <AlertTriangle size={13} className="text-amber-600 shrink-0" />
              <span>No hay faltas registradas en el catálogo. Debe configurarlas en Rectoría &gt; Configuración.</span>
            </p>
          )}
        </div>
      </div>

      {/* Fila 2: Observación / Justificación Individual en Textarea */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Observación / Justificación Individual del Estudiante
          </label>
          <span className="text-xs text-slate-400">
            {data.descripcionIndividual?.length
              ? `${data.descripcionIndividual.length} caracteres`
              : 'Opcional (descargo o versión preliminar)'}
          </span>
        </div>
        <textarea
          rows={3}
          value={data.descripcionIndividual}
          onChange={(e) => onChange({ descripcionIndividual: e.target.value })}
          placeholder="Registre aquí el descargo preliminar, versión del estudiante o circunstancias atenuantes/agravantes particulares..."
          className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-trujillo-navy/20 focus:border-trujillo-navy transition placeholder:text-slate-400 resize-none leading-relaxed text-slate-800"
        />
      </div>
    </div>
  );
});

InvolucradoItemCard.displayName = 'InvolucradoItemCard';
