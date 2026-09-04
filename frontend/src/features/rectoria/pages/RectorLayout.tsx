import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { 
  BarChart3, 
  ShieldAlert, 
  FileCheck, 
  LogOut, 
  School, 
  Award,
  ScrollText
} from 'lucide-react';

export const RectorLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar Directivo */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800/80">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">Disciplina Web</h2>
              <span className="text-xs text-indigo-400 font-medium">Rectoria & Consejo</span>
            </div>
          </div>

          {/* Navegacion */}
          <nav className="space-y-1.5">
            <Link
              to="/rectoria/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-medium text-sm transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Tablero Analitico</span>
            </Link>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 text-sm transition-all opacity-70 cursor-not-allowed">
              <ShieldAlert className="w-4 h-4" />
              <span>Faltas Graves (Tipo III)</span>
              <span className="ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Sprint 3</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 text-sm transition-all opacity-70 cursor-not-allowed">
              <ScrollText className="w-4 h-4" />
              <span>Auditoria Forense</span>
              <span className="ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Sprint 3</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 text-sm transition-all opacity-70 cursor-not-allowed">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Actas & Reportes PDF</span>
              <span className="ml-auto text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">Sprint 6</span>
            </div>
          </nav>
        </div>

        {/* Perfil y Logout */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
              <Award className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {user?.nombres} {user?.apellidos}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 text-xs font-medium transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
