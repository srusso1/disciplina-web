import React from 'react';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { BarChart3, ShieldCheck, AlertTriangle, Users } from 'lucide-react';

export const RectorDashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabecera Directiva */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-800/40 to-slate-800/20 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            Panel de Control Estrategico
          </span>
          <h1 className="text-2xl font-bold text-white mt-2">
            Despacho de Rectoria: {user?.nombres}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Supervision institucional, mapas de convivencia y analitica de reincidencia.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Vigencia Academica: 2026</span>
        </div>
      </div>

      {/* Indicadores Directivos Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Incidentes</span>
            <BarChart3 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400 mt-1">Registrados en 2026</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-yellow-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faltas Tipo I</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400 mt-1">Leves / Manejo en aula</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-orange-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faltas Tipo II</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400 mt-1">Graves / Con acudiente</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faltas Tipo III</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400 mt-1">Ruta de Atencion Integral</p>
        </div>
      </div>

      {/* Contenedor Informativo del Sprint 1 */}
      <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          Gobernanza y Analitica de Rectoria
        </h2>
        <p className="text-sm text-slate-300">
          El modulo de Rectoria cuenta con RBAC estricto (<code className="text-indigo-300">ROLE_RECTOR</code>). Los datos analiticos consolidados se renderizaran dinamicamente en el Sprint 6 mediante visualizaciones con Recharts y streaming de reportes en PDF.
        </p>
        <div className="mt-4 flex items-center gap-3 p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
          <Users className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>
            Usuarios directivos activos: Rector Institucional y Orientador Escolar con llaves JWT criptograficas verificadas con expiracion de 8 horas.
          </span>
        </div>
      </div>
    </div>
  );
};
