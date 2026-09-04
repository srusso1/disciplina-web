import React, { useState, useEffect } from 'react';
import { EstudianteMatricula, ActualizarEstudianteData } from '../types/matricula.types';
import { matriculasApi } from '../api/matriculasApi';
import { X, Save, AlertCircle, Phone, UserCheck, ShieldAlert, Loader2 } from 'lucide-react';

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
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [erroresCampos, setErroresCampos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (estudiante) {
      setDocumento(estudiante.documento || '');
      setNombres(estudiante.nombres || '');
      setApellidos(estudiante.apellidos || '');
      setNombreAcudiente(estudiante.nombreAcudiente ? estudiante.nombreAcudiente.toUpperCase() : '');
      setTelefonoAcudiente(estudiante.telefonoAcudiente || '');
      setGrado(estudiante.grado || '');
      setGrupo(estudiante.grupo || '');
      setJornada(estudiante.jornada || 'JORNADA SECUNDARIA DIURNA');
      setEstadoMatricula(estudiante.estadoMatricula || 'ACTIVO');
      setErrorGlobal(null);
      setErroresCampos({});
    }
  }, [estudiante]);

  if (!isOpen || !estudiante) return null;

  const handleNombreAcudienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombreAcudiente(e.target.value.toUpperCase());
    if (erroresCampos.nombreAcudiente) {
      setErroresCampos((prev) => ({ ...prev, nombreAcudiente: '' }));
    }
  };

  const validarFormulario = (): boolean => {
    const errores: Record<string, string> = {};

    if (!documento.trim()) {
      errores.documento = 'El documento de identidad es obligatorio.';
    }

    if (!nombres.trim()) {
      errores.nombres = 'Los nombres son obligatorios.';
    }

    if (!apellidos.trim()) {
      errores.apellidos = 'Los apellidos son obligatorios.';
    }

    if (!nombreAcudiente.trim()) {
      errores.nombreAcudiente = 'El nombre del acudiente es obligatorio.';
    }

    const regexTelefono = /^3\d{9}$/;
    const telLimpio = telefonoAcudiente.trim();
    if (!telLimpio) {
      errores.telefonoAcudiente = 'El teléfono del acudiente es obligatorio.';
    } else if (!regexTelefono.test(telLimpio)) {
      errores.telefonoAcudiente = 'Debe ser un número celular colombiano de 10 dígitos (ej. 3114165509).';
    }

    if (!grado.trim()) {
      errores.grado = 'El grado es obligatorio.';
    }

    if (!grupo.trim()) {
      errores.grupo = 'El grupo es obligatorio.';
    }

    setErroresCampos(errores);
    return Object.keys(errores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setIsSubmitting(true);
    setErrorGlobal(null);

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
      anioLectivo: estudiante.anioLectivo || 2026,
    };

    try {
      const actualizado = await matriculasApi.actualizarEstudiante(estudiante.id, data);
      onSuccess(actualizado);
      onClose();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrorGlobal(err.response.data?.message || 'Ya existe otro estudiante con este documento.');
      } else if (err.response?.status === 400 && err.response.data?.fieldErrors) {
        setErroresCampos(err.response.data.fieldErrors);
        setErrorGlobal('Corrija los campos indicados a continuación.');
      } else {
        setErrorGlobal(err.response?.data?.message || 'Ocurrió un error al guardar los cambios.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const esDocumentoPendiente = estudiante.documento.startsWith('PENDIENTE_');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-trujillo-navy/10 text-trujillo-navy flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Editar Datos del Estudiante</h2>
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
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {errorGlobal && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorGlobal}</span>
            </div>
          )}

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
                <input
                  type="text"
                  value={jornada}
                  onChange={(e) => setJornada(e.target.value)}
                  placeholder="Jornada"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-trujillo-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  value={estadoMatricula}
                  onChange={(e) => setEstadoMatricula(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-trujillo-navy font-semibold text-slate-700"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="RETIRADO">RETIRADO</option>
                  <option value="TRASLADADO">TRASLADADO</option>
                  <option value="GRADUADO">GRADUADO</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer de botones */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-trujillo-navy hover:bg-slate-900 rounded-xl shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
        </form>
      </div>
    </div>
  );
};
