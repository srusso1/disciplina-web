import { useEffect, useState } from 'react';
import { AlertTriangle, History, Loader2, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { notify } from '../../../core/utils/notify';
import { citacionesApi } from '../api/citacionesApi';
import { CitacionResponse, EstadoCitacion, HistorialEstadoCitacion } from '../types/citacion.types';
import { EstadoCitacionBadge } from './EstadoCitacionBadge';
import { WaEstadoBadge } from './WaEstadoBadge';

interface Props {
  citacion: CitacionResponse | null;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
  onReprogramar: (citacion: CitacionResponse) => void;
}

const opciones: { value: EstadoCitacion; label: string }[] = [
  { value: 'CONFIRMADA', label: 'Confirmar asistencia' },
  { value: 'ASISTIO', label: 'Registrar que asistió' },
  { value: 'NO_ASISTIO', label: 'Registrar inasistencia' },
  { value: 'CANCELADA', label: 'Cancelar citación' },
];

export const GestionCitacionModal = ({ citacion, onClose, onUpdated, onReprogramar }: Props) => {
  const [estado, setEstado] = useState<EstadoCitacion | ''>('');
  const [motivo, setMotivo] = useState('');
  const [historial, setHistorial] = useState<HistorialEstadoCitacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!citacion) return;
    setEstado(''); setMotivo(''); setError('');
    citacionesApi.obtenerHistorial(citacion.id).then(setHistorial).catch(() => setHistorial([]));
  }, [citacion]);

  const actualizar = async () => {
    if (!citacion || !estado) return;
    if (['NO_ASISTIO', 'CANCELADA'].includes(estado) && !motivo.trim()) {
      setError('Registre el motivo de la inasistencia o cancelación.');
      return;
    }
    setLoading(true); setError('');
    try {
      await citacionesApi.actualizarEstado(citacion.id, estado, motivo.trim() || undefined);
      await onUpdated();
      notify.success('Estado actualizado', 'La trazabilidad de la citación fue registrada.');
      onClose();
    } catch (exception) {
      setError(extraerMensajeError(exception, 'No fue posible actualizar la citación.'));
    } finally { setLoading(false); }
  };

  const reenviar = async () => {
    if (!citacion) return;
    setLoading(true); setError('');
    try {
      await citacionesApi.reenviar(citacion.id);
      await onUpdated();
      notify.success('Mensaje reenviado', 'WhatsApp aceptó nuevamente la citación.');
      onClose();
    } catch (exception) {
      setError(extraerMensajeError(exception, 'No fue posible reenviar el mensaje.'));
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={citacion !== null} onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto p-0">
        {citacion && <>
          <DialogHeader className="border-b border-slate-200 bg-slate-50 px-6 py-5 pr-12">
            <DialogTitle>Gestionar citación #{citacion.id}</DialogTitle>
            <DialogDescription>{citacion.estudianteNombreCompleto}</DialogDescription>
            <div className="flex flex-wrap gap-2 pt-2"><EstadoCitacionBadge estado={citacion.estado} /><WaEstadoBadge waEstadoEnvio={citacion.waEstadoEnvio} /></div>
          </DialogHeader>
          <div className="space-y-5 px-6 py-5">
            {error && <div role="alert" className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div>}
            {!['ASISTIO', 'CANCELADA'].includes(citacion.estado) && <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Nuevo estado
                <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoCitacion)} className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm">
                  <option value="">Seleccione una acción</option>
                  {opciones.filter((item) => citacion.estado === 'NO_ASISTIO'
                    ? item.value === 'CANCELADA'
                    : item.value !== citacion.estado).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-700">Motivo u observación <span className="font-normal text-slate-400">(opcional)</span>
                <textarea maxLength={500} value={motivo} onChange={(e) => setMotivo(e.target.value)} className="mt-1.5 min-h-20 w-full rounded-lg border border-slate-300 p-3 text-sm" />
              </label>
              <button type="button" disabled={!estado || loading} onClick={actualizar} className="h-10 rounded-lg bg-trujillo-navy px-4 text-sm font-semibold text-white disabled:opacity-50">Actualizar estado</button>
            </div>}

            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {!['ASISTIO', 'CANCELADA'].includes(citacion.estado) && <button type="button" disabled={loading} onClick={() => onReprogramar(citacion)} className="rounded-lg border border-sky-300 px-3 py-2 text-xs font-semibold text-sky-700">Reprogramar</button>}
              {['FALLIDO', 'NO_ENVIADO'].includes(citacion.waEstadoEnvio) && citacion.estado !== 'CANCELADA' && <button type="button" disabled={loading} onClick={reenviar} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-700"><RefreshCw className="h-3.5 w-3.5" />Reintentar WhatsApp</button>}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"><History className="h-4 w-4" />Trazabilidad</h3>
              <div className="space-y-2">
                {historial.map((item) => <div key={item.id} className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600"><p className="font-semibold text-slate-800">{item.accion.replace(/_/g, ' ')} · {item.estadoNuevo}</p><p>{new Date(item.fechaCambio).toLocaleString('es-CO')} · {item.usuario || 'Sistema'}</p>{item.motivo && <p className="mt-1">{item.motivo}</p>}</div>)}
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-slate-200 px-6 py-4"><button type="button" disabled={loading} onClick={onClose} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cerrar'}</button></DialogFooter>
        </>}
      </DialogContent>
    </Dialog>
  );
};
