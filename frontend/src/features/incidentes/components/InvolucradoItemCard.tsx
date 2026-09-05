import React, { useState, useEffect } from 'react';
import {
  Search,
  AlertTriangle,
  GraduationCap,
  Trash2,
  Loader2,
  Info,
  Shield,
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
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all space-y-4 relative">
      {/* Cabecera del Involucrado */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-sky-50 text-trujillo-navy text-xs font-black flex items-center justify-center border border-sky-200">
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
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selector o Ficha del Estudiante */}
      {data.estudianteSeleccionado ? (
        /* Ficha de Estudiante Seleccionado */
        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-trujillo-navy text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs ring-1 ring-sky-300">
              {data.estudianteSeleccionado.nombres.charAt(0)}
              {data.estudianteSeleccionado.apellidos?.charAt(0) || ''}
            </div>
            <div>
              <p className="font-bold text-sm text-trujillo-navy">
                {data.estudianteSeleccionado.nombres} {data.estudianteSeleccionado.apellidos}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                <span>Doc: <strong>{data.estudianteSeleccionado.documento}</strong></span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-trujillo-navy bg-white px-2 py-0.5 rounded-md border border-sky-200 text-[11px]">
                  <GraduationCap className="w-3 h-3 text-trujillo-sky" />
                  Grado {data.estudianteSeleccionado.grado} - Grupo {data.estudianteSeleccionado.grupo}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Matrícula Activa
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeseleccionar}
            className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition active:scale-[0.97] cursor-pointer"
          >
            Cambiar Estudiante
          </button>
        </div>
      ) : (
        /* Buscador de Estudiante Combobox con Debounce */
        <div className="relative">
          {/* Alerta contextual cuando la IA sugirió un nombre no matriculado */}
          {searchTerm && !data.estudianteId && (
            <div className="mb-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span>Estudiante pendiente de vincular:</span>
                  <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">
                    "{searchTerm}"
                  </span>
                </p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  La IA identificó este nombre en el relato, pero <strong>no coincide con ningún estudiante matriculado</strong> en el sistema institucional. Debe seleccionar a un alumno del censo para poder guardar el caso, o quitarlo si no es un estudiante del plantel.
                </p>
              </div>
            </div>
          )}

          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Buscar Estudiante por Nombre, Apellido o Documento *
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onChange({ busquedaEstudiante: e.target.value });
              }}
              placeholder="Escriba apellido, nombre o documento (ej: Gomez, 1066...)"
              className={`w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-white border rounded-xl focus:ring-2 transition placeholder:text-slate-400 ${
                searchTerm && !data.estudianteId
                  ? 'border-amber-300 ring-1 ring-amber-200 focus:ring-amber-400 focus:border-amber-400'
                  : 'border-slate-300 focus:ring-trujillo-sky focus:border-trujillo-sky'
              }`}
            />
            {buscando && (
              <Loader2 className="w-4 h-4 text-trujillo-sky animate-spin absolute right-3.5 top-3" />
            )}
          </div>

          {/* Dropdown de Resultados de Búsqueda */}
          {resultados.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-52 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-100">
              {resultados.map((est) => (
                <button
                  key={est.id}
                  type="button"
                  onClick={() => handleSeleccionarEstudiante(est)}
                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-sky-50/70 transition flex items-center justify-between group cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-sky-100 text-trujillo-navy font-bold text-xs flex items-center justify-center shrink-0">
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

          {/* Ayuda contextual si no hay resultados */}
          {searchTerm.trim().length >= 2 && !buscando && resultados.length === 0 && !data.estudianteId && (
            <div className="mt-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>No se encontraron estudiantes con "{searchTerm}". Intente buscar por número de documento o apellido.</span>
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
            value={data.rolEstudiante}
            onChange={(e) => handleCambioRol(e.target.value as RolEstudianteIncidente)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition font-medium text-slate-800"
          >
            <option value="AGRESOR_PRINCIPAL">Agresor Principal</option>
            <option value="PARTICIPE">Partícipe / Coautor</option>
            <option value="VICTIMA">Víctima / Agredido (Protegido)</option>
            <option value="TESTIGO">Testigo Presencial (Protegido)</option>
          </select>
        </div>

        {/* Tipificación de Falta Disciplinaria */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Falta Tipificada Manual</span>
            {esVictimaOTestigo && (
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                Debido Proceso
              </span>
            )}
          </label>
          {esVictimaOTestigo ? (
            <div className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate italic">Parte protegida (sin falta disciplinaria)</span>
            </div>
          ) : (
            <select
              value={data.catalogoFaltaId || ''}
              onChange={(e) =>
                onChange({
                  catalogoFaltaId: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition text-slate-800"
            >
              <option value="">Sin falta tipificada específica...</option>
              {faltas.map((f) => (
                <option key={f.id} value={f.id}>
                  [{f.clasificacionLey}] {f.codigo} — {f.descripcion.substring(0, 55)}...
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Observación Individual o Descargo Inicial */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Observación / Justificación Individual
          </label>
          <input
            type="text"
            value={data.descripcionIndividual}
            onChange={(e) => onChange({ descripcionIndividual: e.target.value })}
            placeholder="Aclaración específica del estudiante..."
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-trujillo-sky focus:border-trujillo-sky transition placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
});

InvolucradoItemCard.displayName = 'InvolucradoItemCard';
