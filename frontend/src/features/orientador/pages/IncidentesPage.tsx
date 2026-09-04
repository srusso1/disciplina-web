import React from 'react';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { FileText, Clock, PlusCircle, CheckCircle2 } from 'lucide-react';

export const IncidentesPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner de Bienvenida Operativo */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-800/40 to-slate-800/20 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Modulo de Convivencia Escolar Activo
          </span>
          <h1 className="text-2xl font-bold text-white mt-2">
            Bienvenido, {user?.nombres}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestion operativa del debido proceso, descargos y compromisos disciplinarios.
          </p>
        </div>
        <button
          type="button"
          disabled
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/50 text-emerald-200 text-sm font-medium opacity-60 cursor-not-allowed"
          title="Habilitado en Sprint 3"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar Incidente (Sprint 3)</span>
        </button>
      </div>

      {/* Tarjetas de Resumen de Estados de Debido Proceso */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reportados</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400 mt-1">Pendientes de apertura</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">En Indagacion</span>
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400 mt-1">Recoleccion de descargos</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Intervencion</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400 mt-1">Planes activos en seguimiento</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cerrados</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400 mt-1">Debido proceso concluido</p>
        </div>
      </div>

      {/* Contenedor Informativo del Sprint 1 */}
      <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          Estado del Sistema: Sprint 1 Completado
        </h2>
        <p className="text-sm text-slate-300">
          La infraestructura de persistencia, conexion con PostgreSQL 16 y el motor de autenticacion con JWT y roles directivos estan 100% operativos.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-semibold">Autenticacion Activa:</span> Sesion iniciada como Orientador con rol <code className="text-emerald-300">ROLE_ORIENTADOR</code>.
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-semibold">Base de Datos:</span> Migraciones Flyway V1 y V2 aplicadas con catalogos iniciales y reglas de snapshot.
          </div>
        </div>
      </div>
    </div>
  );
};
