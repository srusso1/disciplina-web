import { CalendarDays, Clock3, MapPin, MessageCircleOff, UserRound } from 'lucide-react';
import { CitacionResponse } from '../types/citacion.types';
import { WaEstadoBadge } from './WaEstadoBadge';

const formatDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(year, month - 1, day));
};

const formatTime = (value: string) => value?.slice(0, 5) || '—';

export const ListaCitaciones = ({ citaciones }: { citaciones: CitacionResponse[] }) => {
  if (citaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-8 text-center">
        <div className="mb-2 rounded-full bg-slate-200/70 p-2.5 text-slate-500">
          <CalendarDays className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Aún no hay citaciones</p>
        <p className="mt-1 max-w-sm text-xs text-slate-500">Cuando programe una citación aparecerá aquí junto con su estado de envío por WhatsApp.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {citaciones.map((citacion) => (
        <article key={citacion.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900">{citacion.estudianteNombreCompleto}</p>
                <span className="text-xs font-medium text-slate-400">Citación #{citacion.id}</span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <UserRound className="h-3.5 w-3.5" />
                Acudiente: {citacion.nombreAcudiente || 'Sin nombre registrado'}
              </p>
            </div>
            <WaEstadoBadge waEstadoEnvio={citacion.waEstadoEnvio} />
          </div>

          <div className="mt-3 grid gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600 sm:grid-cols-3">
            <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-sky-600" />{formatDate(citacion.fechaCita)}</span>
            <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-sky-600" />{formatTime(citacion.horaCita)}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-sky-600" />{citacion.lugarCita.nombre}</span>
          </div>

          {citacion.asunto && <p className="mt-3 text-sm leading-relaxed text-slate-600">{citacion.asunto}</p>}

          {citacion.waEstadoEnvio === 'FALLIDO' && (
            <details className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 font-semibold">
                <MessageCircleOff className="h-3.5 w-3.5" />
                Ver motivo del fallo
              </summary>
              <p className="mt-2 break-words leading-relaxed">{citacion.waErrorDetalle || 'WhatsApp no informó un detalle adicional.'}</p>
            </details>
          )}
        </article>
      ))}
    </div>
  );
};
