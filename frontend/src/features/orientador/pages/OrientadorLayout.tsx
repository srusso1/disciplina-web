import React, { useState, Suspense } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { PageLoader } from '../../../core/components/PageLoader';
import { 
  FileText, 
  Users, 
  LogOut, 
  Layers,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';
import { NotificacionesMenu } from '../../notificaciones/components/NotificacionesMenu';

export const OrientadorLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-trujillo-ice text-trujillo-dark flex flex-col md:flex-row font-sans">
      {/* Telón de fondo (Backdrop) oscuro en móvil */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Institucional (Drawer en Móvil / Estático en Desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-trujillo-dark text-slate-200 border-r border-slate-800 flex flex-col justify-between shrink-0 p-4 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:h-screen md:overflow-y-auto ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Marca Institucional */}
          <div className="px-2 py-3 mb-6 border-b border-slate-800 flex items-start justify-between">
            <div>
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
                <span>Orientación Escolar</span>
                <span className="w-2 h-2 rounded-full bg-trujillo-laurel"></span>
              </div>
            </div>

            {/* Botón Cerrar Drawer Móvil */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menú de Navegación Operativo */}
          <nav className="space-y-1.5">
            <NavLink to="/orientador/incidentes" className={navItemClass} onClick={() => setSidebarOpen(false)}>
              <FileText className="w-4 h-4 shrink-0" />
              <span>Bitácora de Incidentes</span>
            </NavLink>

            <NavLink to="/orientador/expedientes" className={navItemClass} onClick={() => setSidebarOpen(false)}>
              <Users className="w-4 h-4 shrink-0" />
              <span>Expediente Único</span>
            </NavLink>

            <NavLink to="/orientador/planes" className={navItemClass} onClick={() => setSidebarOpen(false)}>
              <Layers className="w-4 h-4 shrink-0" />
              <span>Planes de Intervención</span>
            </NavLink>
          </nav>
        </div>

        {/* Sección Inferior: Usuario & Acciones */}
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
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 hover:text-rose-300 text-slate-400 border border-slate-800 hover:border-rose-900/50 text-xs font-medium transition-all duration-150 cursor-pointer active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Área Principal de Trabajo */}
      <div data-scroll-container className="flex-1 flex flex-col min-h-screen md:min-h-0 md:h-screen overflow-y-auto layout-content-scroll">
        {/* Barra Superior Institucional Adaptable */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Botón Hamburguesa en Móvil */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-trujillo-navy hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-slate-900 tracking-tight sm:uppercase sm:font-semibold sm:text-slate-500 sm:tracking-wider shrink-0">
                IE Trujillo
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:inline text-xs font-medium text-trujillo-navy truncate">
                Sistema de Convivencia Escolar
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <NotificacionesMenu />
            <button
              className="hidden sm:flex p-2 rounded-lg text-slate-500 hover:text-trujillo-navy hover:bg-slate-100 transition-all text-xs items-center gap-1.5 cursor-pointer"
              title="Manual de Convivencia"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-sky-100 text-trujillo-navy text-[11px] font-bold border border-sky-200">
              Vigencia {new Date().getFullYear()}
            </span>
          </div>
        </header>

        {/* Contenido de la Página con Espaciado Responsivo */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<PageLoader mensaje="Cargando módulo..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
