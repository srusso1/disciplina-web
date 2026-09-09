import React, { Suspense } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { PageLoader } from '../../../core/components/PageLoader';
import { 
  FileText, 
  Users, 
  LogOut, 
  Sparkles,
  Layers,
  HelpCircle,
  Bell
} from 'lucide-react';

export const OrientadorLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98] ${
      isActive
        ? 'bg-trujillo-sky/15 text-trujillo-sky border border-trujillo-sky/30 shadow-sm'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <div className="min-h-screen bg-trujillo-ice text-trujillo-dark flex flex-col md:flex-row font-sans">
      {/* Sidebar Institucional */}
      <aside className="w-full md:w-64 bg-trujillo-dark text-slate-200 border-r border-slate-800 flex flex-col justify-between shrink-0 p-4">
        <div>
          {/* Logo & Marca Institucional */}
          <div className="px-2 py-3 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shrink-0 shadow-sm ring-1 ring-white/10">
                <img 
                  src="/escudo-ie-trujillo.png" 
                  alt="Escudo IE Trujillo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight text-white leading-tight">
                  Disciplina<span className="text-trujillo-sky font-black">+</span>
                </h2>
                <p className="text-[11px] font-medium text-slate-400">
                  IE Trujillo
                </p>
              </div>
            </div>
            <div className="mt-3 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-trujillo-sky font-semibold flex items-center justify-between">
              <span>Orientacion Escolar</span>
              <span className="w-2 h-2 rounded-full bg-trujillo-laurel"></span>
            </div>
          </div>

          {/* Menú de Navegación Operativo */}
          <nav className="space-y-1.5">
            <NavLink to="/orientador/incidentes" className={navItemClass}>
              <FileText className="w-4 h-4 shrink-0" />
              <span>Bitácora de Incidentes</span>
            </NavLink>

            <NavLink to="/orientador/expedientes" className={navItemClass}>
              <Users className="w-4 h-4 shrink-0" />
              <span>Expediente Unico</span>
            </NavLink>

            <NavLink to="/orientador/planes" className={navItemClass}>
              <Layers className="w-4 h-4 shrink-0" />
              <span>Planes de Intervencion</span>
            </NavLink>

            <NavLink to="/orientador/asistente-ia" className={navItemClass}>
              <Sparkles className="w-4 h-4 shrink-0 text-trujillo-gold" />
              <span>Asistencia Pedagogica</span>
            </NavLink>
          </nav>
        </div>

        {/* Secci�n Inferior: Usuario & Acciones */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-trujillo-navy flex items-center justify-center text-white font-bold text-xs shrink-0 ring-1 ring-trujillo-sky/40">
              {user?.nombres?.charAt(0) || 'O'}{user?.apellidos?.charAt(0) || 'E'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.nombres} {user?.apellidos}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 hover:text-rose-300 text-slate-400 border border-slate-800 hover:border-rose-900/50 text-xs font-medium transition-all duration-150 cursor-pointer active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* Área Principal de Trabajo */}
      <div data-scroll-container className="flex-1 flex flex-col min-h-screen overflow-y-auto layout-content-scroll">
        {/* Barra Superior Institucional */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Institucion Educativa Trujillo
            </span>
            <span className="text-slate-300">�</span>
            <span className="text-xs font-medium text-trujillo-navy">
              Sistema de Convivencia Escolar
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-slate-500 hover:text-trujillo-navy hover:bg-slate-100 transition-all text-xs flex items-center gap-1.5" title="Notificaciones">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-slate-500 hover:text-trujillo-navy hover:bg-slate-100 transition-all text-xs flex items-center gap-1.5" title="Manual de Convivencia">
              <HelpCircle className="w-4 h-4" />
            </button>
            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-trujillo-navy text-[11px] font-bold border border-sky-200">
              Vigencia {new Date().getFullYear()}
            </span>
          </div>
        </header>

        {/* Contenido de la Pgina */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<PageLoader mensaje="Cargando módulo..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
