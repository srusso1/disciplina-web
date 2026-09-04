import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { ShieldCheck, Lock, User, AlertCircle, Loader2, GraduationCap, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.rol === 'ROLE_RECTOR') {
        navigate('/rectoria/dashboard', { replace: true });
      } else {
        navigate('/orientador/incidentes', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!username.trim() || !password.trim()) {
      setFormError('Por favor ingrese su usuario institucional y contrasena.');
      return;
    }

    try {
      const rol = await login({ username: username.trim(), password });
      if (rol === 'ROLE_RECTOR') {
        navigate('/rectoria/dashboard');
      } else {
        navigate('/orientador/incidentes');
      }
    } catch {
      // El error se maneja en el store
    }
  };

  const handleQuickFill = (userType: 'rector' | 'orientador') => {
    setUsername(userType);
    setPassword('Password123!');
    setFormError(null);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-trujillo-ice via-sky-50/50 to-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Encabezado Institucional */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-trujillo-navy text-white shadow-lg shadow-trujillo-navy/20 mb-4 ring-4 ring-trujillo-sky/30">
            <GraduationCap className="w-9 h-9 text-trujillo-sky" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-white border border-slate-200 text-xs text-trujillo-navy font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-trujillo-laurel animate-pulse"></span>
            <span>Institucion Educativa Trujillo</span>
          </div>

          <h1 className="text-3xl font-extrabold text-trujillo-dark tracking-tight">
            Disciplina<span className="text-trujillo-navy font-black">+</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xs mx-auto">
            Plataforma Centralizada de Convivencia Escolar y Trazabilidad de Debido Proceso
          </p>
        </div>

        {/* Tarjeta de Inicio de Sesión */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-elevated transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-trujillo-dark">
                Acceso al Portal Directivo
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingrese sus credenciales de funcionario
              </p>
            </div>
            <div className="p-2 rounded-lg bg-trujillo-ice text-trujillo-navy">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {(formError || error) && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{formError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Usuario Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ej: rector u orientador"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-trujillo-navy focus:ring-2 focus:ring-trujillo-navy/15 transition-all duration-150"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contrasena
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ingrese su contrasena"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-trujillo-navy focus:ring-2 focus:ring-trujillo-navy/15 transition-all duration-150"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-trujillo-navy hover:bg-trujillo-navy-light active:scale-[0.98] text-white font-semibold rounded-xl shadow-md shadow-trujillo-navy/20 transition-all duration-150 flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-trujillo-sky" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <>
                  <span>Ingresar a Disciplina+</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Accesos Rapidos Institucionales */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-medium text-slate-400 text-center mb-2.5">
              Acceso rapido para demostracion institucional:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('rector')}
                className="py-2 px-3 rounded-xl bg-trujillo-ice hover:bg-sky-100/80 border border-trujillo-sky/30 text-xs font-semibold text-trujillo-navy transition-all duration-150 active:scale-[0.98] text-center"
              >
                Rector Institucional
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('orientador')}
                className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-xs font-semibold text-trujillo-laurel transition-all duration-150 active:scale-[0.98] text-center"
              >
                Orientador Escolar
              </button>
            </div>
          </div>
        </div>

        {/* Pie de Pagina */}
        <div className="text-center mt-6 text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-600">
            Institucion Educativa Trujillo | Colombia
          </p>
          <p className="text-[11px] text-slate-400">
            Marco normativo de convivencia escolar - Ley 1620 y Decreto 1965
          </p>
        </div>
      </div>
    </div>
  );
};
