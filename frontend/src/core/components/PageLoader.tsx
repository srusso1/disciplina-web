import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  mensaje?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ mensaje = 'Cargando módulo...' }) => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-sky-500 animate-spin" />
        <Loader2 className="w-5 h-5 text-sky-600 absolute animate-pulse" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{mensaje}</p>
      <p className="text-xs text-slate-400 mt-0.5">Sincronizando vistas y recursos...</p>
    </div>
  );
};
