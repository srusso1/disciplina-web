import React, { useState, useEffect, useRef } from 'react';
import { EstudianteMatricula, ActualizarEstudianteData } from '../types/matricula.types';
import { matriculasApi } from '../api/matriculasApi';
import { X, Save, Phone, UserCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { useLockBodyScroll } from '../../../core/hooks/useLockBodyScroll';
import { notify } from '../../../core/utils/notify';

interface EditarEstudianteModalProps {
  estudiante: EstudianteMatricula | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (estudianteActualizado: EstudianteMatricula) => void;
}

export const EditarEstudianteModal: React.FC<EditarEstudianteModalProps> = ({
  estudiante,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [documento, setDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nombreAcudiente, setNombreAcudiente] = useState('');
  const [telefonoAcudiente, setTelefonoAcudiente] = useState('');
  const [grado, setGrado] = useState('');
  const [grupo, setGrupo] = useState('');
  const [jornada, setJornada] = useState('');
  const [estadoMatricula, setEstadoMatricula] = useState('ACTIVO');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroresCampos, setErroresCampos] = useState<Record<string, string>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const reportarError = (mensaje: string, targetSelector?: string) => {
    notify.formError('Atención al formulario', mensaje, targetSelector);
  };

  useEffect(() => {
    if (estudiante) {
      setDocumento(estudiante.documento || '');
      setNombres(estudiante.nombres || '');
      setApellidos(estudiante.apellidos || '');
      setNombreAcudiente(estudiante.nombreAcudiente ? estudiante.nombreAcudiente.toUpperCase() : '');
      
      const telInicial = estudiante.telefonoAcudiente && estudiante.telefonoAcudiente !== 'SIN REGISTRO'
        ? estudiante.telefonoAcudiente
        : '';
      setTelefonoAcudiente(telInicial);

      setGrado(estudiante.grado || '6');
      setGrupo(estudiante.grupo || '');

      let j = (estudiante.jornada || 'DIURNA').toUpperCase();
      if (j.includes('DIURNA')) j = 'DIURNA';
      else if (j.includes('MANANA') || j.includes('MAÑANA')) j = 'MANANA';
      else if (j.includes('TARDE')) j = 'TARDE';
      else if (j.includes('NOCTURNA')) j = 'NOCTURNA';
      else if (j.includes('UNICA') || j.includes('ÚNICA')) j = 'UNICA';
      else j = 'DIURNA';
      setJornada(j);

      setEstadoMatricula(estudiante.estadoMatricula || 'ACTIVO');
      setErroresCampos({});
    }
  }, [estudiante]);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !estudiante) return null;

  const handleNombreAcudienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombreAcudiente(e.target.value.toUpperCase());
    if (erroresCampos.nombreAcudiente) {
      setErroresCampos((prev) => ({ ...prev, nombreAcudiente: '' }));
    }
  };

  const validarFormulario = (): boolean => {
    const errores: Record<string, string> = {};
    let primerSelector: string | undefined;
    let primerMensaje: string | undefined;

    if (!documento.trim()) {
      errores.documento = 'El documento de identidad es obligatorio.';
      primerSelector = primerSelector || '#input-editar-documento';
      primerMensaje = primerMensaje || errores.documento;
    }

    if (!nombres.trim()) {
      errores.nombres = 'Los nombres son obligatorios.';
      primerSelector = primerSelector || '#input-editar-nombres';
      primerMensaje = primerMensaje || errores.nombres;
    }

    if (!apellidos.trim()) {
      errores.apellidos = 'Los apellidos son obligatorios.';
      primerSelector = primerSelector || '#input-editar-apellidos';
      primerMensaje = primerMensaje || errores.apellidos;
    }

    if (!nombreAcudiente.trim()) {
      errores.nombreAcudiente = 'El nombre del acudiente es obligatorio.';
      primerSelector = primerSelector || '#input-editar-nombre-acudiente';
      primerMensaje = primerMensaje || errores.nombreAcudiente;
    }

    const regexTelefono = /^3\d{9}$/;
    const telLimpio = telefonoAcudiente.trim();
    if (!telLimpio) {
      errores.telefonoAcudiente = 'El teléfono del acudiente es obligatorio.';
      primerSelector = primerSelector || '#input-editar-telefono-acudiente';
      primerMensaje = primerMensaje || errores.telefonoAcudiente;
    } else if (!regexTelefono.test(telLimpio)) {
      errores.telefonoAcudiente = 'Debe ser un número celular colombiano de 10 dígitos (ej. 3114165509).';
      primerSelector = primerSelector || '#input-editar-telefono-acudiente';
      primerMensaje = primerMensaje || errores.telefonoAcudiente;
    }

    if (!grado.trim()) {
      errores.grado = 'El grado es obligatorio.';
      primerSelector = primerSelector || '#select-editar-grado';
      primerMensaje = primerMensaje || errores.grado;
    }

    if (!grupo.trim()) {
      errores.grupo = 'El grupo es obligatorio.';
      primerSelector = primerSelector || '#input-editar-grupo';
      primerMensaje = primerMensaje || errores.grupo;
    }

    setErroresCampos(errores);

    if (primerSelector && primerMensaje) {
      reportarError(primerMensaje, primerSelector);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);

    const data: ActualizarEstudianteData = {
      documento: documento.trim(),
      nombres: nombres.trim().toUpperCase(),
      apellidos: apellidos.trim().toUpperCase(),
      nombreAcudiente: nombreAcudiente.trim().toUpperCase(),
      telefonoAcudiente: telefonoAcudiente.trim(),
      grado: grado.trim(),
      grupo: grupo.trim(),
      jornada: jornada.trim(),
      estadoMatricula,
      anioLectivo: estudiante.anioLectivo || new Date().getFullYear(),
    };

    try {
      const actualizado = await matriculasApi.actualizarEstudiante(estudiante.id, data);
      notify.success('Estudiante actualizado con éxito', `${actualizado.nombres} ${actualizado.apellidos} ha sido actualizado.`);
      onSuccess(actualizado);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number; data?: { message?: string; fieldErrors?: Record<string, string> } } };
      if (errorObj.response?.status === 409) {
        reportarError(errorObj.response.data?.message || 'Ya existe otro estudiante con este documento.', '#input-editar-documento');
      } else if (errorObj.response?.status === 400 && errorObj.response.data?.fieldErrors) {
        const fieldErrors = errorObj.response.data.fieldErrors;
        setErroresCampos(fieldErrors);
        const firstKey = Object.keys(fieldErrors)[0];
        const selectorMap: Record<string, string> = {
          documento: '#input-editar-documento',
          nombres: '#input-editar-nombres',
          apellidos: '#input-editar-apellidos',
          nombreAcudiente: '#input-editar-nombre-acudiente',
          telefonoAcudiente: '#input-editar-telefono-acudiente',
          grado: '#select-editar-grado',
          grupo: '#input-editar-grupo',
        };
        const targetSel = firstKey ? (selectorMap[firstKey] || `#input-editar-${firstKey}`) : undefined;
        reportarError(fieldErrors[firstKey] || 'Corrija los campos indicados en el formulario.', targetSel);
      } else {
        reportarError(errorObj.response?.data?.message || 'Ocurrió un error al guardar los cambios.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const esDocumentoPendiente = estudiante.documento.startsWith('PENDIENTE_');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overscroll-contain transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-estudiante-title"
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-xl shadow-lg border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh] min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-trujillo-navy/10 text-trujillo-navy flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-editar-estudiante-title" className="text-sm font-bold text-slate-900">Editar Datos del Estudiante</h2>
              <p className="text-xs text-slate-500">ID del Registro: #{estudiante.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form noValidate onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Cuerpo Scrolleable */}
          <div ref={scrollContainerRef} className="overflow-y-auto p-6 space-y-4 flex-1 min-h-0 modal-scroll-body">
          {esDocumentoPendiente && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold">Identificación Provisional Detectada:</span> Este estudiante fue importado con código <code className="px-1 py-0.5 bg-amber-100 rounded font-semibold">{estudiante.documento}</code>. Ingrese el documento de identidad real (T.I, R.C, C.C, PPT) para regularizar su expediente.
              </div>
            </div>
          )}

          {/* Sección 1: Datos Personales */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-trujillo-navy border-b border-slate-100 pb-1">
              Identificación y Nombres
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Documento <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-editar-documento"
                  type="text"
                  value={documento}
                  onChange={(e) => {
                    setDocumento(e.target.value);
                    if (erroresCampos.documento) setErroresCampos(prev => ({ ...prev, documento: '' }));
                  }}
                  placeholder="Número de documento"
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                    erroresCampos.documento
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-200 focus:border-trujillo-navy focus:ring-1 focus:ring-trujillo-navy/20'
                  }`}
                />
                {erroresCampos.documento && (
                  <p className="text-[11px] text-red-600 mt-1">{erroresCampos.documento}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-editar-nombres"
                  type="text"
                  value={nombres}
                  onChange={(e) => {
                    setNombres(e.target.value);
                    if (erroresCampos.nombres) setErroresCampos(prev => ({ ...prev, nombres: '' }));
                  }}
                  placeholder="Nombres del estudiante"
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                    erroresCampos.nombres
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-200 focus:border-trujillo-navy focus:ring-1 focus:ring-trujillo-navy/20'
                  }`}
                />
                {erroresCampos.nombres && (
                  <p className="text-[11px] text-red-600 mt-1">{erroresCampos.nombres}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-editar-apellidos"
                  type="text"
                  value={apellidos}
                  onChange={(e) => {
                    setApellidos(e.target.value);
                    if (erroresCampos.apellidos) setErroresCampos(prev => ({ ...prev, apellidos: '' }));
                  }}
                  placeholder="Apellidos del estudiante"
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                    erroresCampos.apellidos
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-200 focus:border-trujillo-navy focus:ring-1 focus:ring-trujillo-navy/20'
                  }`}
                />
                {erroresCampos.apellidos && (
                  <p className="text-[11px] text-red-600 mt-1">{erroresCampos.apellidos}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 2: Acudiente y Contacto */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-trujillo-navy border-b border-slate-100 pb-1">
              Datos del Acudiente y Contacto
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo Acudiente <span className="text-red-500">*</span>
                  <span className="text-[10px] text-slate-400 ml-1 font-normal">(Se guarda en MAYÚSCULAS)</span>
                </label>
                <input
                  id="input-editar-nombre-acudiente"
                  type="text"
                  value={nombreAcudiente}
                  onChange={handleNombreAcudienteChange}
                  placeholder="NOMBRE Y APELLIDO DEL ACUDIENTE"
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 uppercase focus:bg-white focus:outline-none transition-colors ${
                    erroresCampos.nombreAcudiente
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-200 focus:border-trujillo-navy focus:ring-1 focus:ring-trujillo-navy/20'
                  }`}
                />
                {erroresCampos.nombreAcudiente && (
                  <p className="text-[11px] text-red-600 mt-1">{erroresCampos.nombreAcudiente}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>
                    Teléfono Celular <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">10 dígitos (^3...)</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-editar-telefono-acudiente"
                    type="tel"
                    maxLength={10}
                    value={telefonoAcudiente}
                    onChange={(e) => {
                      const solonumeros = e.target.value.replace(/\D/g, '');
                      setTelefonoAcudiente(solonumeros);
                      if (erroresCampos.telefonoAcudiente) {
                        setErroresCampos(prev => ({ ...prev, telefonoAcudiente: '' }));
                      }
                    }}
                    placeholder="3114165509"
                    className={`w-full pl-8 pr-3 py-2 text-xs font-mono rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                      erroresCampos.telefonoAcudiente
                        ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-slate-200 focus:border-trujillo-navy focus:ring-1 focus:ring-trujillo-navy/20'
                    }`}
                  />
                </div>
                {erroresCampos.telefonoAcudiente && (
                  <p className="text-[11px] text-red-600 mt-1">{erroresCampos.telefonoAcudiente}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 3: Matrícula y Ubicación */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-trujillo-navy border-b border-slate-100 pb-1">
              Información de Matrícula
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grado <span className="text-red-500">*</span>
                </label>
                <select
                  id="select-editar-grado"
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-trujillo-navy"
                >
                  <option value="6">Grado 6°</option>
                  <option value="7">Grado 7°</option>
                  <option value="8">Grado 8°</option>
                  <option value="9">Grado 9°</option>
                  <option value="10">Grado 10°</option>
                  <option value="11">Grado 11°</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grupo <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-editar-grupo"
                  type="text"
                  value={grupo}
                  onChange={(e) => setGrupo(e.target.value)}
                  placeholder="ej. 0601"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-trujillo-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jornada
                </label>
                <select
                  id="select-editar-jornada"
                  value={jornada}
                  onChange={(e) => setJornada(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-trujillo-navy font-semibold text-slate-700"
                >
                  <option value="DIURNA">DIURNA</option>
                  <option value="MANANA">MAÑANA</option>
                  <option value="TARDE">TARDE</option>
                  <option value="NOCTURNA">NOCTURNA</option>
                  <option value="UNICA">ÚNICA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  id="select-editar-estado"
                  value={estadoMatricula}
                  onChange={(e) => setEstadoMatricula(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-trujillo-navy font-semibold text-slate-700"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="RETIRADO">RETIRADO</option>
                  <option value="GRADUADO">GRADUADO</option>
                </select>
              </div>
            </div>
          </div>
        </div>

          {/* Footer fijo de acciones */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-slate-400">
              Los campos marcados con asterisco (*) son obligatorios
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-trujillo-navy hover:bg-trujillo-dark rounded-lg shadow-sm transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-trujillo-sky" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
