import { CheckCheck, CircleAlert, Clock3, Send } from 'lucide-react';
import { WaEstadoEnvio } from '../types/citacion.types';

const config: Record<WaEstadoEnvio, { label: string; className: string; icon: typeof Send }> = {
  NO_ENVIADO: { label: 'No enviado', className: 'border-slate-200 bg-slate-100 text-slate-700', icon: Clock3 },
  ENVIADO: { label: 'Enviado', className: 'border-sky-200 bg-sky-50 text-sky-700', icon: Send },
  ENTREGADO: { label: 'Entregado', className: 'border-indigo-200 bg-indigo-50 text-indigo-700', icon: CheckCheck },
  LEIDO: { label: 'Leído', className: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: CheckCheck },
  FALLIDO: { label: 'Falló el envío', className: 'border-rose-200 bg-rose-50 text-rose-700', icon: CircleAlert },
};

export const WaEstadoBadge = ({ waEstadoEnvio }: { waEstadoEnvio: WaEstadoEnvio }) => {
  const state = config[waEstadoEnvio] ?? config.NO_ENVIADO;
  const Icon = state.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${state.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {state.label}
    </span>
  );
};
