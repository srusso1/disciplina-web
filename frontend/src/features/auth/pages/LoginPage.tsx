import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { ShieldCheck, Lock, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Encabezado Institucional con Escudo Oficial */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-3">
            <img 
              src="/escudo-ie-trujillo.png" 
              alt="Escudo Institución Educativa Trujillo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-trujillo-navy font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-trujillo-laurel"></span>
            <span>Institución Educativa Trujillo</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Disciplina<span className="text-trujillo-navy font-extrabold">+</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Plataforma Centralizada de Convivencia Escolar y Debido Proceso
          </p>
        </div>

        {/* Tarjeta de Inicio de Sesión Enterprise */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Acceso al Portal Directivo
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingrese sus credenciales de funcionario
              </p>
            </div>
            <div className="p-1.5 rounded-md bg-slate-100 text-trujillo-navy">
              <ShieldCheck size={18} strokeWidth={1.75} />
            </div>
          </div>

          {(formError || error) && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircle size={16} strokeWidth={1.75} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{formError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                Usuario Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} strokeWidth={1.75} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ej: rector u orientador"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-trujillo-navy focus:ring-2 focus:ring-trujillo-navy/20 transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} strokeWidth={1.75} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ingrese su contraseña"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-trujillo-navy focus:ring-2 focus:ring-trujillo-navy/20 transition-all"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1.5 py-2.5 px-4 bg-trujillo-navy hover:bg-trujillo-navy-dark text-white font-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy focus-visible:ring-offset-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} strokeWidth={1.75} className="animate-spin text-white" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <>
                  <span>Ingresar a Disciplina+</span>
                  <ArrowRight size={18} strokeWidth={1.75} />
                </>
              )}
            </button>
          </form>

          {/* Accesos Rápidos Institucionales */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-medium text-slate-400 text-center mb-2">
              Acceso rápido para demostración institucional:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('rector')}
                className="py-1.5 px-2.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-all text-center focus-visible:ring-2 focus-visible:ring-trujillo-navy"
              >
                Rector Institucional
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('orientador')}
                className="py-1.5 px-2.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-all text-center focus-visible:ring-2 focus-visible:ring-trujillo-navy"
              >
                Orientador Escolar
              </button>
            </div>
          </div>
        </div>

        {/* Pie de Página */}
        <div className="text-center mt-5 text-xs text-slate-500 space-y-0.5">
          <p className="font-medium text-slate-600 text-[11px]">
            Institución Educativa Trujillo | Colombia
          </p>
          <p className="text-[10px] text-slate-400">
            Marco normativo de convivencia escolar - Ley 1620 y Decreto 1965
          </p>
        </div>
      </div>
    </div>
  );
};
