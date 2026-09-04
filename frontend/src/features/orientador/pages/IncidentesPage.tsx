import React, { useState } from 'react';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { 
  FileText, 
  Clock, 
  PlusCircle, 
  ShieldAlert, 
  Filter, 
  Search, 
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const IncidentesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida Operativo */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-trujillo-ice text-trujillo-navy text-xs font-semibold border border-sky-200">
            <ShieldAlert className="w-3.5 h-3.5 text-trujillo-sky" />
            <span>Debido Proceso & Convivencia Escolar</span>
          </div>
          <h1 className="text-2xl font-extrabold text-trujillo-dark mt-2 tracking-tight">
            Bitacora General de Incidentes
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Bienvenido, <span className="font-semibold text-slate-700">{user?.nombres} {user?.apellidos}</span>. Registro y seguimiento formativo de casos disciplinarios.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-sm font-semibold shadow-md shadow-trujillo-navy/20 transition-all duration-150 active:scale-[0.98] cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-trujillo-sky" />
          <span>Registrar Nuevo Incidente</span>
        </button>
      </div>

      {/* Tarjetas de Semáforo de Convivencia Institucional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Casos */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-trujillo-navy mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Expedientes 2026</span>
            <div className="p-2 rounded-xl bg-trujillo-ice">
              <FileText className="w-4 h-4 text-trujillo-navy" />
            </div>
          </div>
          <p className="text-3xl font-black text-trujillo-dark">0</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-trujillo-laurel" />
            <span>Casos bajo debido proceso activo</span>
          </p>
        </div>

        {/* Tipo I - Leve */}
        <div className="bg-white border border-yellow-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-yellow-400">
          <div className="flex items-center justify-between text-yellow-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faltas Tipo I (Leve)</span>
            <div className="p-2 rounded-xl bg-yellow-100/70">
              <AlertTriangle className="w-4 h-4 text-yellow-700" />
            </div>
          </div>
          <p className="text-3xl font-black text-yellow-900">0</p>
          <p className="text-xs text-slate-500 mt-1">Manejo formativo en aula</p>
        </div>

        {/* Tipo II - Grave */}
        <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-orange-400">
          <div className="flex items-center justify-between text-orange-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faltas Tipo II (Grave)</span>
            <div className="p-2 rounded-xl bg-orange-100/70">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-orange-900">0</p>
          <p className="text-xs text-slate-500 mt-1">Citacion acudiente y descargos</p>
        </div>

        {/* Tipo III - Gravísima */}
        <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-rose-400">
          <div className="flex items-center justify-between text-rose-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faltas Tipo III</span>
            <div className="p-2 rounded-xl bg-rose-100/70">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-900">0</p>
          <p className="text-xs text-slate-500 mt-1">Ruta de Atencion Integral</p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por estudiante, documento o falta..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-trujillo-navy focus:ring-1 focus:ring-trujillo-navy/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filtrar por Tipologia</span>
          </button>

          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Vigencia 2026</span>
          </button>
        </div>
      </div>

      {/* Tabla / Bandeja de Incidentes */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-trujillo-dark">
            Casos Registrados Recientemente
          </h2>
          <span className="text-xs text-slate-400">
            Mostrando registros de la vigencia escolar
          </span>
        </div>

        {/* Estado Vacío Institucional */}
        <div className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-trujillo-ice border border-trujillo-sky/30 text-trujillo-navy flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-7 h-7 text-trujillo-laurel" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Sin incidentes pendientes de tramite
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No se registran faltas activas reportadas en esta jornada. Para abrir un expediente disciplinario o acta de descargos, utilice el boton de registro.
          </p>
        </div>
      </div>
    </div>
  );
};
