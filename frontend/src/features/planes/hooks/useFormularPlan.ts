import { useState } from 'react';
import {
  CrearPlanIntervencionRequest,
  EstadoPlanIntervencion,
  PlanIntervencionResponse,
} from '../types/planes.types';
import { planesApi } from '../api/planesApi';
import { extraerMensajeError } from '../../../core/api/apiClient';
import { notify } from '../../../core/utils/notify';

export interface UseFormularPlanOptions {
  onPlanCreado?: (nuevoPlan: PlanIntervencionResponse) => void;
  estadoInicial?: EstadoPlanIntervencion;
}

export const useFormularPlan = (options: UseFormularPlanOptions = {}) => {
  const { onPlanCreado, estadoInicial = 'EN_SEGUIMIENTO' } = options;

  const [incidenteSeleccionadoId, setIncidenteSeleccionadoId] = useState<number | null>(null);
  const [diagnostico, setDiagnostico] = useState<string>('');
  const [accionesAcordadas, setAccionesAcordadas] = useState<string>('');
  const [compromisoPadres, setCompromisoPadres] = useState<string>('');
  const [fechaProximoSeguimiento, setFechaProximoSeguimiento] = useState<string>('');
  const [recomendacionesIa, setRecomendacionesIa] = useState<string>('');
  const [estado, setEstado] = useState<EstadoPlanIntervencion>(estadoInicial);

  const [guardando, setGuardando] = useState<boolean>(false);
  const [generandoIa, setGenerandoIa] = useState<boolean>(false);
  const [advertenciaIa, setAdvertenciaIa] = useState<string | null>(null);

  const resetFormulario = () => {
    setIncidenteSeleccionadoId(null);
    setDiagnostico('');
    setAccionesAcordadas('');
    setCompromisoPadres('');
    setFechaProximoSeguimiento('');
    setRecomendacionesIa('');
    setEstado(estadoInicial);
    setAdvertenciaIa(null);
  };

  const generarPropuestaIa = async (estudianteId: number, incidenteId: number) => {
    if (!estudianteId) {
      notify.formError('Estudiante requerido', 'Debe seleccionar un estudiante para generar la propuesta con IA.', '#input-busqueda-estudiante-plan');
      return false;
    }
    if (!incidenteId) {
      notify.formError('Incidente requerido', 'Debe seleccionar el incidente de origen para que la IA contextualice la propuesta en hechos reales.', '#select-incidente-origen-plan');
      return false;
    }

    setGenerandoIa(true);
    setAdvertenciaIa(null);
    try {
      const prop = await planesApi.generarPropuestaIa(estudianteId, incidenteId);
      setDiagnostico(prop.diagnosticoSituacional || '');
      setRecomendacionesIa(prop.recomendacionesIa || '');
      setAccionesAcordadas(prop.accionesAcordadasSugeridas || '');
      setCompromisoPadres(prop.compromisoPadresSugerido || '');

      if (prop.semanasSeguimientoSugeridas) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + prop.semanasSeguimientoSugeridas * 7);
        setFechaProximoSeguimiento(fecha.toISOString().split('T')[0]);
      }

      if (prop.advertenciaGobierno) {
        setAdvertenciaIa(prop.advertenciaGobierno);
      }
      notify.info('Propuesta generada', 'Se han cargado las sugerencias formativas de IA basadas en los hechos del incidente.');
      return true;
    } catch (err) {
      console.error('Error al generar propuesta IA:', err);
      const msg = extraerMensajeError(err, 'No fue posible contactar a Gemini.');
      setAdvertenciaIa(msg);
      notify.warning('Asistente IA no disponible', msg);
      return false;
    } finally {
      setGenerandoIa(false);
    }
  };

  const guardarPlan = async (
    estudianteId: number,
    incidenteId: number,
    callbackExito?: (nuevoPlan: PlanIntervencionResponse) => void
  ): Promise<PlanIntervencionResponse | null> => {
    if (!estudianteId) {
      notify.formError('Seleccione un estudiante', 'Debe buscar y seleccionar un estudiante matriculado.', '#input-busqueda-estudiante-plan');
      return null;
    }
    if (!incidenteId) {
      notify.formError('Incidente obligatorio', 'Debe asociar un incidente convivencial previo para formular el plan.', '#select-incidente-origen-plan');
      return null;
    }
    if (!diagnostico.trim()) {
      notify.formError('Diagnóstico obligatorio', 'El diagnóstico situacional es un campo obligatorio.', '#textarea-diagnostico-plan');
      return null;
    }
    if (!accionesAcordadas.trim()) {
      notify.formError('Acciones obligatorias', 'Las acciones formativas y restaurativas acordadas son obligatorias.', '#textarea-acciones-plan');
      return null;
    }

    setGuardando(true);
    try {
      const req: CrearPlanIntervencionRequest = {
        estudianteId,
        incidenteOrigenId: incidenteId,
        diagnosticoSituacional: diagnostico.trim(),
        accionesAcordadas: accionesAcordadas.trim(),
        compromisoPadres: compromisoPadres.trim() || undefined,
        recomendacionesIa: recomendacionesIa.trim() || undefined,
        fechaProximoSeguimiento: fechaProximoSeguimiento || undefined,
        estado,
      };

      const nuevoPlan = await planesApi.crearPlan(req);
      notify.success('Plan formulado', 'Plan de intervención formativa registrado exitosamente.');
      resetFormulario();
      if (callbackExito) {
        callbackExito(nuevoPlan);
      }
      if (onPlanCreado) {
        onPlanCreado(nuevoPlan);
      }
      return nuevoPlan;
    } catch (err) {
      console.error('Error al crear plan:', err);
      const msg = extraerMensajeError(err, 'Error al formular el plan de intervención.');
      notify.error('Error al formular plan', msg);
      return null;
    } finally {
      setGuardando(false);
    }
  };

  return {
    incidenteSeleccionadoId,
    setIncidenteSeleccionadoId,
    diagnostico,
    setDiagnostico,
    accionesAcordadas,
    setAccionesAcordadas,
    compromisoPadres,
    setCompromisoPadres,
    fechaProximoSeguimiento,
    setFechaProximoSeguimiento,
    recomendacionesIa,
    setRecomendacionesIa,
    estado,
    setEstado,
    guardando,
    generandoIa,
    advertenciaIa,
    setAdvertenciaIa,
    resetFormulario,
    generarPropuestaIa,
    guardarPlan,
  };
};
