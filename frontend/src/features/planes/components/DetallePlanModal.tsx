import React, { useState, useEffect, useRef } from 'react';
import {
  PlanIntervencionResponse,
  EstadoPlanIntervencion,
  RegistrarSeguimientoRequest
} from '../types/planes.types';
import { planesApi } from '../api/planesApi';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { useLockBodyScroll } from '../../../core/hooks/useLockBodyScroll';
import { notify } from '../../../core/utils/notify';
import {
  FileEdit,
  Clock,
  Plus,
  Loader2,
  Send,
  Sparkles,
  X
} from 'lucide-react';

interface DetallePlanModalProps {
  isOpen: boolean;
  plan: PlanIntervencionResponse | null;
  onClose: () => void;
  onSeguimientoRegistrado?: (planActualizado: PlanIntervencionResponse) => void;
}

export const DetallePlanModal: React.FC<DetallePlanModalProps> = ({
  isOpen,
  plan,
  onClose,
  onSeguimientoRegistrado,
}) => {
  const [planActual, setPlanActual] = useState<PlanIntervencionResponse | null>(plan);
  const [observacionSeguimiento, setObservacionSeguimiento] = useState<string>('');
  const [nuevoEstadoPlan, setNuevoEstadoPlan] = useState<EstadoPlanIntervencion>('EN_SEGUIMIENTO');
  const [nuevaFechaSeguimiento, setNuevaFechaSeguimiento] = useState<string>('');
  const [guardandoSeguimiento, setGuardandoSeguimiento] = useState<boolean>(false);

  const modalDetalleScrollRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (plan) {
      setPlanActual(plan);
      setObservacionSeguimiento('');
      setNuevoEstadoPlan(plan.estado);
      setNuevaFechaSeguimiento(plan.fechaProximoSeguimiento || '');
    }
  }, [plan, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !planActual) return null;

  const handleRegistrarSeguimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observacionSeguimiento.trim()) {
      notify.error('Campo requerido', 'La observación de seguimiento es obligatoria.');
      modalDetalleScrollRef.current?.scrollTo({ top: modalDetalleScrollRef.current.scrollHeight, behavior: 'smooth' });
      return;
    }

    setGuardandoSeguimiento(true);
    try {
      const data: RegistrarSeguimientoRequest = {
        observacion: observacionSeguimiento.trim(),
        nuevoEstadoPlan: nuevoEstadoPlan,
        nuevaFechaProximoSeguimiento: nuevaFechaSeguimiento || undefined,
      };

      const actualizado = await planesApi.registrarSeguimiento(planActual.id, data);
      setPlanActual(actualizado);
      setObservacionSeguimiento('');
      notify.success('Seguimiento registrado', 'La evolución ha sido guardada en la bitácora del plan.');
      onSeguimientoRegistrado?.(actualizado);
    } catch (err) {
      console.error('Error al guardar seguimiento:', err);
      const msg = extraerMensajeError(err, 'Error al registrar la evolución del caso.');
      notify.error('Error al registrar seguimiento', msg);
      modalDetalleScrollRef.current?.scrollTo({ top: modalDetalleScrollRef.current.scrollHeight, behavior: 'smooth' });
    } finally {
      setGuardandoSeguimiento(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl border border-slate-200/80 overflow-hidden min-h-0 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-900 rounded-md border border-blue-100">
              <FileEdit className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  Plan #{planActual.id} • {planActual.estudianteNombre}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  {planActual.estado}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Doc: {planActual.estudianteDocumento} • Seguimiento formativo institucional
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div ref={modalDetalleScrollRef} className="p-6 space-y-6 flex-1 overflow-y-auto min-h-0 modal-scroll-body">
          {/* Información del Plan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div>
              <span className="font-extrabold uppercase text-slate-500 tracking-wider text-[10px]">Diagnóstico Situacional:</span>
              <p className="text-slate-800 font-medium mt-0.5">{planActual.diagnosticoSituacional}</p>
            </div>
            <div>
              <span className="font-extrabold uppercase text-slate-500 tracking-wider text-[10px]">Acciones Acordadas:</span>
              <p className="text-slate-800 font-medium mt-0.5">{planActual.accionesAcordadas}</p>
            </div>
            {planActual.compromisoPadres && (
              <div>
                <span className="font-extrabold uppercase text-slate-500 tracking-wider text-[10px]">Compromiso Padres / Familia:</span>
                <p className="text-slate-800 font-medium mt-0.5">{planActual.compromisoPadres}</p>
              </div>
            )}
            {planActual.recomendacionesIa && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                <div className="flex items-center gap-1.5 font-bold text-[11px] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sugerencias Asistidas por IA (Gemini):</span>
                </div>
                <p className="text-[11px]">{planActual.recomendacionesIa}</p>
              </div>
            )}
          </div>

          {/* Historial de Seguimientos */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-trujillo-sky" />
              <span>Bitácora de Evoluciones ({planActual.seguimientos?.length || 0})</span>
            </h4>

            {(!planActual.seguimientos || planActual.seguimientos.length === 0) ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                Aún no se han registrado notas de seguimiento para este plan.
              </div>
            ) : (
              <div className="space-y-2.5">
                {planActual.seguimientos.map((seg) => (
                  <div key={seg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-bold text-slate-700">{seg.usuarioNombre || 'Orientador'}</span>
                      <span>{new Date(seg.fechaRegistro).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-700">{seg.observacion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario para Registrar Nuevo Seguimiento */}
          <form onSubmit={handleRegistrarSeguimiento} className="p-4 bg-trujillo-ice/50 rounded-xl border border-trujillo-sky/30 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-trujillo-navy">
              <Plus className="w-4 h-4 text-trujillo-sky" />
              <span>Registrar Nueva Evolución / Seguimiento Periódico</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones del Seguimiento *</label>
              <textarea
                rows={3}
                placeholder="Describa los avances del estudiante, entrevistas sostenidas, cumplimiento de compromisos..."
                value={observacionSeguimiento}
                onChange={(e) => setObservacionSeguimiento(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30 focus:border-trujillo-sky"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Actualizar Estado del Plan</label>
                <select
                  value={nuevoEstadoPlan}
                  onChange={(e) => setNuevoEstadoPlan(e.target.value as EstadoPlanIntervencion)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                >
                  <option value="EN_SEGUIMIENTO">EN_SEGUIMIENTO</option>
                  <option value="CUMPLIDO">CUMPLIDO</option>
                  <option value="INCUMPLIDO">INCUMPLIDO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Próxima Fecha de Revisión</label>
                <input
                  type="date"
                  value={nuevaFechaSeguimiento}
                  onChange={(e) => setNuevaFechaSeguimiento(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-trujillo-sky/30"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={guardandoSeguimiento || !observacionSeguimiento.trim()}
                className="px-4 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-dark text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                {guardandoSeguimiento ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Guardar Nota de Seguimiento</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Fijo */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Plan #{planActual.id} • Estado: <strong className="text-trujillo-navy">{planActual.estado}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 bg-white border border-slate-300 rounded-lg transition shadow-xs cursor-pointer"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};
