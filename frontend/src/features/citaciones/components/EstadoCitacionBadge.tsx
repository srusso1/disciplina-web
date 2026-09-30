import { CalendarCheck2, CheckCircle2, CircleSlash2, UserCheck, UserX } from 'lucide-react';
import { EstadoCitacion } from '../types/citacion.types';

const config: Record<EstadoCitacion, { label: string; className: string; icon: typeof CalendarCheck2 }> = {
  PROGRAMADA: { label: 'Programada', className: 'border-sky-200 bg-sky-50 text-sky-700', icon: CalendarCheck2 },
  CONFIRMADA: { label: 'Confirmada', className: 'border-indigo-200 bg-indigo-50 text-indigo-700', icon: CheckCircle2 },
  ASISTIO: { label: 'Asistió', className: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: UserCheck },
  NO_ASISTIO: { label: 'No asistió', className: 'border-amber-200 bg-amber-50 text-amber-800', icon: UserX },
  CANCELADA: { label: 'Cancelada', className: 'border-slate-200 bg-slate-100 text-slate-600', icon: CircleSlash2 },
};

export const EstadoCitacionBadge = ({ estado }: { estado: EstadoCitacion }) => {
  const state = config[estado] ?? config.PROGRAMADA;
  const Icon = state.icon;
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${state.className}`}><Icon className="h-3.5 w-3.5" />{state.label}</span>;
};
