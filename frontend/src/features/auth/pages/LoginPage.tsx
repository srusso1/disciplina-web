import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/auth/useAuthStore';
import { ShieldCheck, Lock, User, AlertCircle, Loader2, School } from 'lucide-react';

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
      setFormError('Por favor complete todos los campos obligatorios.');
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
      // El error queda en useAuthStore.error
    }
  };

  const handleQuickFill = (userType: 'rector' | 'orientador') => {
    setUsername(userType);
    setPassword('Password123!');
    setFormError(null);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Cabecera Institucional */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-xl shadow-indigo-950/50">
            <School className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Disciplina Web
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sistema de Convivencia Escolar y Analitica Disciplinaria
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ley 1620 | Protocolo de Debido Proceso</span>
          </div>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">
            Iniciar Sesion Directiva
          </h2>

          {(formError || error) && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{formError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Usuario Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ej: rector u orientador"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Contrasena
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ingrese su contrasena"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Ingresar al Sistema</span>
              )}
            </button>
          </form>

          {/* Accesos Rapidos de Demostración Semilla */}
          <div className="mt-8 pt-6 border-t border-slate-700/60">
            <p className="text-xs text-slate-400 text-center mb-3">
              Credenciales semilla preconfiguradas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('rector')}
                className="py-1.5 px-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-700/80 text-xs text-indigo-300 hover:text-indigo-200 transition-all text-center"
              >
                Rector (Dashboard)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('orientador')}
                className="py-1.5 px-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-700/80 text-xs text-emerald-300 hover:text-emerald-200 transition-all text-center"
              >
                Orientador (Casos)
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Disciplina Web v3.0 | Acceso restringido unicamente a personal autorizado
        </p>
      </div>
    </div>
  );
};
