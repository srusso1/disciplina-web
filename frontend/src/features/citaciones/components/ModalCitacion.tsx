import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, Loader2, MessageCircle, ShieldCheck } from 'lucide-react';
import { InvolucradoResponse } from '../../incidentes/types/incidente.types';
import { incidentesApi } from '../../incidentes/api/incidentesApi';
import { citacionesApi } from '../api/citacionesApi';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { notify } from '../../../core/utils/notify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidenteId: number;
  involucrados: InvolucradoResponse[];
  descripcionHechos?: string;
  onSuccess: () => void;
}

const hoyLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
};

export const ModalCitacion: React.FC<Props> = ({
  open,
  onOpenChange,
  incidenteId,
  involucrados,
  descripcionHechos,
  onSuccess,
}) => {
  const [lugares, setLugares] = useState<{ id: number; nombre: string }[]>([]);
  const [estudianteId, setEstudianteId] = useState('');
  const [lugarCitaId, setLugarCitaId] = useState('');
  const [fechaCita, setFechaCita] = useState('');
  const [horaCita, setHoraCita] = useState('');
  const [asunto, setAsunto] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingLugares, setLoadingLugares] = useState(false);
  const [error, setError] = useState('');

  const elegibles = useMemo(
    () => involucrados.filter(
      (item) => item.rolEstudiante === 'AGRESOR_PRINCIPAL' || item.rolEstudiante === 'PARTICIPE',
    ),
    [involucrados],
  );
  const selected = elegibles.find((item) => String(item.estudianteId) === estudianteId);

  useEffect(() => {
    if (!open) return;
    setEstudianteId('');
    setLugarCitaId('');
    setFechaCita(hoyLocal());
    setHoraCita('');
    setAsunto(
      descripcionHechos
        ? `Citación relacionada con: ${descripcionHechos.slice(0, 180)}`
        : 'Citación para tratar el incidente de convivencia escolar.',
    );
    setObservaciones('');
    setError('');
    setLoadingLugares(true);
    incidentesApi.listarLugares()
      .then(setLugares)
      .catch((exception) => setError(extraerMensajeError(exception, 'No fue posible cargar los lugares.')))
      .finally(() => setLoadingLugares(false));
  }, [open, descripcionHechos]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!selected || !lugarCitaId || !fechaCita || !horaCita || !asunto.trim()) {
      setError('Complete todos los campos obligatorios antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await citacionesApi.crear({
        incidenteId,
        estudianteId: selected.estudianteId,
        lugarCitaId: Number(lugarCitaId),
        fechaCita,
        horaCita,
        asunto: asunto.trim(),
        observaciones: observaciones.trim() || undefined,
      });
      await onSuccess();
      onOpenChange(false);

      if (result.waEstadoEnvio === 'FALLIDO') {
        notify.error(
          'Citación registrada, envío pendiente',
          result.waErrorDetalle || 'Meta no aceptó el envío por WhatsApp. Consulte el historial para ver el estado.',
        );
        return;
      }
      notify.success('Citación enviada por WhatsApp', `Se notificó a ${result.nombreAcudiente}.`);
    } catch (exception) {
      setError(extraerMensajeError(exception, 'No fue posible programar la citación.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isSubmitting && onOpenChange(nextOpen)}>
      <DialogContent
        className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto border-0 p-0 shadow-2xl"
        onEscapeKeyDown={(event) => {
          event.stopPropagation();
          if (isSubmitting) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
      >
        <form onSubmit={submit}>
          <DialogHeader className="border-b border-slate-200 bg-slate-50/80 px-5 py-4 pr-12 sm:px-6">
            <div className="flex items-start gap-3 text-left">
              <div className="mt-0.5 rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg text-slate-900">Programar citación</DialogTitle>
                <DialogDescription className="mt-1">
                  Incidente #{incidenteId}. La citación se registrará y se intentará notificar por WhatsApp.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            {error && (
              <div role="alert" className="flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Estudiante <span className="text-rose-500">*</span>
                <select
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-trujillo-sky focus:ring-2 focus:ring-sky-100"
                  value={estudianteId}
                  onChange={(event) => setEstudianteId(event.target.value)}
                  required
                >
                  <option value="">Seleccione un estudiante</option>
                  {elegibles.map((item) => (
                    <option key={item.id} value={item.estudianteId}>
                      {item.estudianteNombreCompleto || item.nombreCompleto || `Estudiante ${item.estudianteId}`}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Lugar de la cita <span className="text-rose-500">*</span>
                <select
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-trujillo-sky focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                  value={lugarCitaId}
                  onChange={(event) => setLugarCitaId(event.target.value)}
                  disabled={loadingLugares}
                  required
                >
                  <option value="">{loadingLugares ? 'Cargando lugares…' : 'Seleccione un lugar'}</option>
                  {lugares.map((lugar) => <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>)}
                </select>
              </label>
            </div>

            {selected && (
              <div className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-slate-600">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                <span>Se notificará al acudiente registrado. El sistema validará que su teléfono tenga formato internacional.</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Fecha <span className="text-rose-500">*</span>
                <input className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-trujillo-sky focus:ring-2 focus:ring-sky-100" type="date" min={hoyLocal()} value={fechaCita} onChange={(event) => setFechaCita(event.target.value)} required />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Hora <span className="text-rose-500">*</span>
                <input className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-trujillo-sky focus:ring-2 focus:ring-sky-100" type="time" value={horaCita} onChange={(event) => setHoraCita(event.target.value)} required />
              </label>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              Motivo de la citación <span className="text-rose-500">*</span>
              <textarea className="mt-1.5 min-h-24 w-full resize-y rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-trujillo-sky focus:ring-2 focus:ring-sky-100" maxLength={500} value={asunto} onChange={(event) => setAsunto(event.target.value)} required />
              <span className="mt-1 block text-right text-xs font-normal text-slate-400">{asunto.length}/500</span>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Indicaciones adicionales <span className="font-normal text-slate-400">(opcional)</span>
              <textarea className="mt-1.5 min-h-20 w-full resize-y rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-trujillo-sky focus:ring-2 focus:ring-sky-100" placeholder="Ej. Presentarse con documento de identidad." value={observaciones} onChange={(event) => setObservaciones(event.target.value)} />
            </label>
          </div>

          <DialogFooter className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
            <button type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={isSubmitting || loadingLugares} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-trujillo-navy px-4 text-sm font-semibold text-white transition hover:bg-trujillo-dark disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4 text-emerald-300" />}
              {isSubmitting ? 'Registrando y enviando…' : 'Registrar y enviar'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
