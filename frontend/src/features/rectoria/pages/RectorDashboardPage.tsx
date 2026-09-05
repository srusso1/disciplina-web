import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { incidentesApi } from '../../incidentes/api/incidentesApi';
import { EstadisticasIncidentes } from '../../incidentes/types/incidente.types';
import { 
  BarChart3, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  FileSpreadsheet, 
  ShieldCheck, 
  Users, 
  BookOpenCheck,
  Scale
} from 'lucide-react';

export const RectorDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<EstadisticasIncidentes | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    let montado = true;
    incidentesApi.obtenerEstadisticas()
      .then((data) => {
        if (montado) setStats(data);
      })
      .catch((err) => {
        console.error('Error al cargar estadísticas en rectoría:', err);
      })
      .finally(() => {
        if (montado) setCargando(false);
      });

    return () => {
      montado = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner Directivo Institucional */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-trujillo-ice text-trujillo-navy text-xs font-semibold border border-sky-200">
            <Scale className="w-3.5 h-3.5 text-trujillo-sky" />
            <span>Debido Proceso & Supervisión Estratégica</span>
          </div>
          <h1 className="text-2xl font-extrabold text-trujillo-dark mt-2 tracking-tight">
            Despacho de Rectoría: {user?.nombres} {user?.apellidos}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Supervisión directiva, observatorio de convivencia escolar y garantías constitucionales.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-sm font-semibold shadow-md shadow-trujillo-navy/20 transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-trujillo-sky" />
            <span>Exportar Informe Ejecutivo</span>
          </button>
        </div>
      </div>

      {/* Indicadores Clave del Semáforo de Convivencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Casos */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-trujillo-navy mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Expedientes</span>
            <div className="p-2 rounded-xl bg-trujillo-ice">
              <BarChart3 className="w-4 h-4 text-trujillo-navy" />
            </div>
          </div>
          <p className="text-3xl font-black text-trujillo-dark">
            {cargando ? '...' : (stats?.totalIncidentes ?? 0)}
          </p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-trujillo-laurel" />
            <span>Vigencia escolar 2026 activa</span>
          </p>
        </div>

        {/* Faltas Tipo I */}
        <div className="bg-white border border-yellow-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-yellow-400">
          <div className="flex items-center justify-between text-yellow-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faltas Tipo I (Leves)</span>
            <div className="p-2 rounded-xl bg-yellow-100/70">
              <AlertTriangle className="w-4 h-4 text-yellow-700" />
            </div>
          </div>
          <p className="text-3xl font-black text-yellow-900">
            {cargando ? '...' : (stats?.tipoI ?? 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Acuerdos pedagógicos de aula</p>
        </div>

        {/* Faltas Tipo II */}
        <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-orange-400">
          <div className="flex items-center justify-between text-orange-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faltas Tipo II (Graves)</span>
            <div className="p-2 rounded-xl bg-orange-100/70">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-orange-900">
            {cargando ? '...' : (stats?.tipoII ?? 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Intervención de comité & acudientes</p>
        </div>

        {/* Faltas Tipo III */}
        <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-rose-400">
          <div className="flex items-center justify-between text-rose-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faltas Tipo III (Gravísimas)</span>
            <div className="p-2 rounded-xl bg-rose-100/70">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-900">
            {cargando ? '...' : (stats?.tipoIII ?? 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Activación Ruta de Atención Integral</p>
        </div>
      </div>

      {/* Gobernanza Institucional & Garantía de Debido Proceso */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo: Ruta de Atención Integral */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-trujillo-navy text-white">
                <BookOpenCheck className="w-5 h-5 text-trujillo-sky" />
              </div>
              <div>
                <h2 className="text-base font-bold text-trujillo-dark">
                  Ruta de Atención Integral para la Convivencia
                </h2>
                <p className="text-xs text-slate-500">
                  Marco legal de la Ley 1620 de 2013 y Decreto 1965 de 2013
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              Protocolo Activo
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            La plataforma <span className="font-semibold text-trujillo-navy">Disciplina+</span> garantiza la custodia probatoria de cada proceso disciplinario. Toda actuación incorpora snapshots inmutables del estudiante (matrícula, acudiente y grado) para salvaguardar el debido proceso ante el Comité Escolar de Convivencia y entidades de inspección educativa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-trujillo-dark flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-trujillo-laurel" />
                <span>Seguridad Jurídica</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Snapshots inmutables que impiden alteraciones de registros históricos ante traslados o cambios de curso.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-trujillo-dark flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-trujillo-navy" />
                <span>Debido Proceso Constitucional</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Registro obligatorio de citaciones a acudientes, descargos del estudiante y actas de conciliación.
              </p>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Estado del Comité Escolar de Convivencia */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
              <div className="p-2 rounded-xl bg-sky-50 text-trujillo-navy border border-sky-100">
                <Users className="w-5 h-5 text-trujillo-navy" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-trujillo-dark">
                  Comité de Convivencia
                </h3>
                <p className="text-[11px] text-slate-500">
                  Instancia de concertación institucional
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-600">Rector / Presidente</span>
                <span className="font-bold text-trujillo-navy">Verificado</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-600">Orientación Escolar</span>
                <span className="font-bold text-trujillo-laurel">En Línea</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-600">Personería Estudiantil</span>
                <span className="font-medium text-slate-500">Convocado</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-600">Rep. Consejo Padres</span>
                <span className="font-medium text-slate-500">Convocado</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Próxima Sesión Ordinaria</span>
            <span className="font-bold text-trujillo-navy">Marzo 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
