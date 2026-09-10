import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Loader2,
  Pencil,
  Eye,
  EyeOff,
  X,
  Plus,
  Search,
  Download,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { configuracionApi } from '../api/configuracionApi';
import { extraerMensajeError } from '../../../core/api/apiClient';
import type {
  CatalogoFaltaItem,
  CatalogoFaltaRequest,
  DocenteItem,
  DocenteRequest,
  ImportacionDocentesResumen,
  LugarItem,
  LugarRequest,
  UsuarioItem,
  UsuarioRequest,
} from '../types/configuracion.types';

const PAGE_SIZE = 15;

type TabId = 'faltas' | 'docentes' | 'lugares' | 'usuarios';

// ---------------------------------------------------------------------------
// Shared UI helpers
// ---------------------------------------------------------------------------

const BadgeActivo: React.FC<{ activo: boolean }> = ({ activo }) =>
  activo ? (
    <span className="bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 text-xs font-medium">
      Activo
    </span>
  ) : (
    <span className="bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 text-xs font-medium">
      Inactivo
    </span>
  );

const inputClass =
  'w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500';

const labelClass = 'block text-xs font-semibold text-slate-600 mb-1';

const btnPrimary =
  'bg-[#1E3A8A] hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition-colors';

const btnSecondary =
  'border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium px-4 py-2 rounded-md transition-colors';

const btnIcon =
  'p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors';

interface ErrorBannerProps {
  message: string;
}
const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-md mb-4">
    {message}
  </div>
);

interface PaginationProps {
  pagina: number;
  totalElementos: number;
  totalPaginas: number;
  primera: boolean;
  ultima: boolean;
  onPrev: () => void;
  onNext: () => void;
  pageSize: number;
}
const Pagination: React.FC<PaginationProps> = ({
  pagina,
  totalElementos,
  primera,
  ultima,
  onPrev,
  onNext,
  pageSize,
}) => {
  const start = totalElementos === 0 ? 0 : pagina * pageSize + 1;
  const end = Math.min((pagina + 1) * pageSize, totalElementos);
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs text-slate-500">
      <span>
        Mostrando {start}–{end} de {totalElementos}
      </span>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={primera}
          className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={onNext}
          disabled={ultima}
          className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

interface ModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ title, onClose, onSubmit, submitting, error, children }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <button onClick={onClose} className={btnIcon}>
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="px-5 py-4 space-y-4">
          {error && <ErrorBanner message={error} />}
          {children}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-200">
          <button type="button" onClick={onClose} className={btnSecondary} disabled={submitting}>
            Cancelar
          </button>
          <button type="submit" className={btnPrimary} disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
              </span>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Tab: Catalogo de Faltas
// ---------------------------------------------------------------------------

const TabFaltas: React.FC = () => {
  const [items, setItems] = useState<CatalogoFaltaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(0);
  const [paginaMeta, setPaginaMeta] = useState({ totalElementos: 0, totalPaginas: 0, primera: true, ultima: true });

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogoFaltaItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CatalogoFaltaRequest>({
    codigo: '',
    clasificacionLey: 'TIPO_I',
    gravedadInstitucional: 'LEVE',
    descripcion: '',
    procedimientoSugerido: '',
  });

  const fetch = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await configuracionApi.listarCatalogoFaltas({ page, size: PAGE_SIZE });
      setItems(data.contenido);
      setPaginaMeta({ totalElementos: data.totalElementos, totalPaginas: data.totalPaginas, primera: data.primera, ultima: data.ultima });
    } catch (err) {
      setError(extraerMensajeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(pagina); }, [fetch, pagina]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ codigo: '', clasificacionLey: 'TIPO_I', gravedadInstitucional: 'LEVE', descripcion: '', procedimientoSugerido: '' });
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (item: CatalogoFaltaItem) => {
    setEditingItem(item);
    setForm({
      codigo: item.codigo,
      clasificacionLey: item.clasificacionLey,
      gravedadInstitucional: item.gravedadInstitucional,
      descripcion: item.descripcion,
      procedimientoSugerido: item.procedimientoSugerido ?? '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingItem) {
        await configuracionApi.actualizarCatalogoFalta(editingItem.id, form);
      } else {
        await configuracionApi.crearCatalogoFalta(form);
      }
      setShowForm(false);
      fetch(pagina);
    } catch (err) {
      setFormError(extraerMensajeError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await configuracionApi.toggleActivoCatalogoFalta(id);
      fetch(pagina);
    } catch (err) {
      setError(extraerMensajeError(err));
    }
  };

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <div className="flex justify-end">
        <button onClick={openCreate} className={`${btnPrimary} flex items-center gap-2`}>
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Código', 'Clasificación', 'Gravedad', 'Descripción', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
              </td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">Sin registros</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{item.codigo}</td>
                <td className="px-4 py-3">{item.clasificacionLey.replace('_', ' ')}</td>
                <td className="px-4 py-3">{item.gravedadInstitucional}</td>
                <td className="px-4 py-3 max-w-xs truncate" title={item.descripcion}>{item.descripcion}</td>
                <td className="px-4 py-3"><BadgeActivo activo={item.activo} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(item)} className={btnIcon} title="Editar">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleToggle(item.id)} className={btnIcon} title={item.activo ? 'Desactivar' : 'Activar'}>
                      {item.activo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pagina={pagina}
          totalElementos={paginaMeta.totalElementos}
          totalPaginas={paginaMeta.totalPaginas}
          primera={paginaMeta.primera}
          ultima={paginaMeta.ultima}
          onPrev={() => setPagina(p => Math.max(0, p - 1))}
          onNext={() => setPagina(p => p + 1)}
          pageSize={PAGE_SIZE}
        />
      </div>

      {showForm && (
        <Modal
          title={editingItem ? 'Editar Falta' : 'Nueva Falta'}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={formError}
        >
          <div>
            <label className={labelClass}>Código</label>
            <input className={inputClass} value={form.codigo} required onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Clasificación Ley</label>
            <select className={inputClass} value={form.clasificacionLey} onChange={e => setForm(f => ({ ...f, clasificacionLey: e.target.value }))}>
              <option value="TIPO_I">Tipo I</option>
              <option value="TIPO_II">Tipo II</option>
              <option value="TIPO_III">Tipo III</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Gravedad Institucional</label>
            <select className={inputClass} value={form.gravedadInstitucional} onChange={e => setForm(f => ({ ...f, gravedadInstitucional: e.target.value }))}>
              <option value="LEVE">Leve</option>
              <option value="GRAVE">Grave</option>
              <option value="GRAVISIMA">Gravísima</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Descripción</label>
            <textarea className={inputClass} rows={3} value={form.descripcion} required onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Procedimiento Sugerido</label>
            <textarea className={inputClass} rows={3} value={form.procedimientoSugerido ?? ''} onChange={e => setForm(f => ({ ...f, procedimientoSugerido: e.target.value }))} />
          </div>
        </Modal>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tab: Docentes
// ---------------------------------------------------------------------------

const TabDocentes: React.FC = () => {
  const [items, setItems] = useState<DocenteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(0);
  const [paginaMeta, setPaginaMeta] = useState({ totalElementos: 0, totalPaginas: 0, primera: true, ultima: true });
  const [search, setSearch] = useState('');

  // Importación Masiva Excel
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [descargandoPlantilla, setDescargandoPlantilla] = useState(false);
  const [resumenImportacion, setResumenImportacion] = useState<ImportacionDocentesResumen | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DocenteItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<DocenteRequest>({
    documento: '', nombres: '', apellidos: '', areaDesempeno: '',
  });

  const fetch = useCallback(async (page: number, q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await configuracionApi.listarDocentes({ page, size: PAGE_SIZE, q: q || undefined });
      setItems(data.contenido);
      setPaginaMeta({ totalElementos: data.totalElementos, totalPaginas: data.totalPaginas, primera: data.primera, ultima: data.ultima });
    } catch (err) {
      setError(extraerMensajeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(pagina, search); }, [fetch, pagina, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagina(0);
    fetch(0, search);
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm({ documento: '', nombres: '', apellidos: '', areaDesempeno: '' });
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (item: DocenteItem) => {
    setEditingItem(item);
    setForm({ documento: item.documento, nombres: item.nombres, apellidos: item.apellidos, areaDesempeno: item.areaDesempeno ?? '' });
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingItem) {
        await configuracionApi.actualizarDocente(editingItem.id, form);
      } else {
        await configuracionApi.crearDocente(form);
      }
      setShowForm(false);
      fetch(pagina, search);
    } catch (err) {
      setFormError(extraerMensajeError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await configuracionApi.toggleActivoDocente(id);
      fetch(pagina, search);
    } catch (err) {
      setError(extraerMensajeError(err));
    }
  };

  const handleDescargarPlantilla = async () => {
    try {
      setDescargandoPlantilla(true);
      setImportError(null);
      const blob = await configuracionApi.descargarPlantillaDocentes();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantilla_docentes_${new Date().getFullYear()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error al descargar plantilla:', err);
      setImportError('No fue posible descargar la plantilla oficial. Intente nuevamente.');
    } finally {
      setDescargandoPlantilla(false);
    }
  };

  const validarYEstablecerArchivo = (selectedFile: File) => {
    setImportError(null);
    const validExtensions = ['.xlsx', '.xls'];
    const name = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some(ext => name.endsWith(ext));

    if (!isValid) {
      setImportError('Formato no soportado. Por favor seleccione una hoja de cálculo Excel (.xlsx o .xls).');
      return;
    }

    setImportFile(selectedFile);
    setResumenImportacion(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validarYEstablecerArchivo(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validarYEstablecerArchivo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!importFile) return;
    setIsUploading(true);
    setImportError(null);
    try {
      const res = await configuracionApi.importarDocentesMasivo(importFile);
      setResumenImportacion(res);
      setPagina(0);
      fetch(0, search);
    } catch (err) {
      setImportError(extraerMensajeError(err));
    } finally {
      setIsUploading(false);
    }
  };

  const formatearTamano = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              placeholder="Buscar docente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className={btnSecondary}>Buscar</button>
        </form>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImportPanel(p => !p)}
            className={`flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-md border transition-colors cursor-pointer ${
              showImportPanel
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{showImportPanel ? 'Cerrar Importador' : 'Carga Masiva Excel'}</span>
          </button>
          <button onClick={openCreate} className={`${btnPrimary} flex items-center gap-2`}>
            <Plus className="w-4 h-4" /> Nuevo Docente
          </button>
        </div>
      </div>

      {showImportPanel && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Importación Masiva de Docentes</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cargue la nómina institucional desde una hoja de cálculo Excel (.xlsx o .xls).
              </p>
            </div>
            <button
              type="button"
              onClick={handleDescargarPlantilla}
              disabled={descargandoPlantilla}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              title="Descargar archivo Excel con la estructura requerida"
            >
              {descargandoPlantilla ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{descargandoPlantilla ? 'Generando...' : 'Descargar Plantilla Oficial (.xlsx)'}</span>
            </button>
          </div>

          {/* Guía Visual de Columnas Oficiales */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-semibold text-slate-700">Columnas reconocidas por el motor de importación:</span>
              <span className="text-[11px] text-slate-500">Compatible con listados oficiales de secretaría y nómina</span>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Obligatorias:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-medium border border-emerald-200">
                CEDULA / DOCUMENTO
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-medium border border-emerald-200">
                1NOMBRE / NOMBRES
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-medium border border-emerald-200">
                1APELLIDO / APELLIDOS
              </span>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mx-1">Opcionales:</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[11px] border border-slate-300">
                2NOMBRE
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[11px] border border-slate-300">
                2APELLIDO
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[11px] border border-slate-300" title="Si no está presente o está vacía, se asigna 'PENDIENTE POR REGISTRO'">
                AREA (defecto: PENDIENTE POR REGISTRO)
              </span>
              <span className="px-2 py-0.5 rounded-bg-slate-200 text-slate-700 font-mono text-[11px] border border-slate-300">
                CORREO
              </span>
            </div>
          </div>

          {/* Drag and Drop Container */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !importFile && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50/60'
                : importFile
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />

            {!importFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Arrastre su planilla Excel aquí o haga clic para seleccionarla
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Formatos soportados: Microsoft Excel (.xlsx, .xls) hasta 25 MB
                </p>
                <button
                  type="button"
                  className="mt-3 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Seleccionar Archivo
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-lg border border-emerald-200 max-w-md mx-auto">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">{importFile.name}</p>
                    <p className="text-[11px] text-slate-500">{formatearTamano(importFile.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImportFile(null);
                      setResumenImportacion(null);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Quitar archivo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {importError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{importError}</span>
            </div>
          )}

          {/* Botón de Iniciar Carga */}
          {importFile && !resumenImportacion && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Procesando e Importando Docentes...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4 text-white" />
                    <span>Iniciar Importación de Docentes</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Resumen de Importación */}
          {resumenImportacion && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Filas Leídas</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">{resumenImportacion.totalFilas}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{resumenImportacion.tiempoMs} ms</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 border-l-4 border-l-emerald-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Docentes Creados</span>
                  <p className="text-xl font-bold text-emerald-900 mt-1">{resumenImportacion.docentesCreados}</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Nuevos registros</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 border-l-4 border-l-blue-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Actualizados</span>
                  <p className="text-xl font-bold text-blue-900 mt-1">{resumenImportacion.docentesActualizados}</p>
                  <p className="text-[10px] text-blue-600 mt-0.5">Por cédula existente</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 border-l-4 border-l-amber-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Inconsistencias</span>
                  <p className="text-xl font-bold text-amber-900 mt-1">{resumenImportacion.advertencias.length + resumenImportacion.errores.length}</p>
                  <p className="text-[10px] text-amber-600 mt-0.5">Observaciones</p>
                </div>
              </div>

              {resumenImportacion.errores.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-red-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Filas con errores ({resumenImportacion.errores.length}):
                  </p>
                  <ul className="list-disc list-inside text-red-700 space-y-0.5">
                    {resumenImportacion.errores.slice(0, 5).map((e, idx) => (
                      <li key={idx}>Fila {e.fila} [{e.campo}]: {e.mensaje}</li>
                    ))}
                    {resumenImportacion.errores.length > 5 && (
                      <li className="italic">... y {resumenImportacion.errores.length - 5} más</li>
                    )}
                  </ul>
                </div>
              )}

              {resumenImportacion.advertencias.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Advertencias ({resumenImportacion.advertencias.length}):
                  </p>
                  <ul className="list-disc list-inside text-amber-700 space-y-0.5">
                    {resumenImportacion.advertencias.slice(0, 5).map((a, idx) => (
                      <li key={idx}>Fila {a.fila}: {a.motivo} — {a.accionTomada}</li>
                    ))}
                    {resumenImportacion.advertencias.length > 5 && (
                      <li className="italic">... y {resumenImportacion.advertencias.length - 5} más</li>
                    )}
                  </ul>
                </div>
              )}

              {resumenImportacion.docentesCreados > 0 && resumenImportacion.errores.length === 0 && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Importación completada con éxito. El listado inferior ha sido actualizado.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Documento', 'Nombres', 'Apellidos', 'Área', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
              </td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">{search ? `No se encontraron docentes para "${search}".` : 'No hay docentes registrados en la nómina institucional.'}</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{item.documento}</td>
                <td className="px-4 py-3">{item.nombres}</td>
                <td className="px-4 py-3">{item.apellidos}</td>
                <td className="px-4 py-3 text-slate-500">{item.areaDesempeno ?? '—'}</td>
                <td className="px-4 py-3"><BadgeActivo activo={item.activo} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(item)} className={btnIcon} title="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleToggle(item.id)} className={btnIcon} title={item.activo ? 'Desactivar' : 'Activar'}>
                      {item.activo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pagina={pagina}
          totalElementos={paginaMeta.totalElementos}
          totalPaginas={paginaMeta.totalPaginas}
          primera={paginaMeta.primera}
          ultima={paginaMeta.ultima}
          onPrev={() => setPagina(p => Math.max(0, p - 1))}
          onNext={() => setPagina(p => p + 1)}
          pageSize={PAGE_SIZE}
        />
      </div>

      {showForm && (
        <Modal
          title={editingItem ? 'Editar Docente' : 'Nuevo Docente'}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={formError}
        >
          <div>
            <label className={labelClass}>Documento</label>
            <input className={inputClass} value={form.documento} required onChange={e => setForm(f => ({ ...f, documento: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Nombres</label>
            <input className={inputClass} value={form.nombres} required onChange={e => setForm(f => ({ ...f, nombres: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Apellidos</label>
            <input className={inputClass} value={form.apellidos} required onChange={e => setForm(f => ({ ...f, apellidos: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Área de Desempeño</label>
            <input className={inputClass} value={form.areaDesempeno ?? ''} onChange={e => setForm(f => ({ ...f, areaDesempeno: e.target.value }))} />
          </div>
        </Modal>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tab: Lugares
// ---------------------------------------------------------------------------

const TabLugares: React.FC = () => {
  const [items, setItems] = useState<LugarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(0);
  const [paginaMeta, setPaginaMeta] = useState({ totalElementos: 0, totalPaginas: 0, primera: true, ultima: true });
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LugarItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<LugarRequest>({ nombre: '', descripcion: '' });

  const fetch = useCallback(async (page: number, q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await configuracionApi.listarLugares({ page, size: PAGE_SIZE, q: q || undefined });
      setItems(data.contenido);
      setPaginaMeta({ totalElementos: data.totalElementos, totalPaginas: data.totalPaginas, primera: data.primera, ultima: data.ultima });
    } catch (err) {
      setError(extraerMensajeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(pagina, search); }, [fetch, pagina, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagina(0);
    fetch(0, search);
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm({ nombre: '', descripcion: '' });
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (item: LugarItem) => {
    setEditingItem(item);
    setForm({ nombre: item.nombre, descripcion: item.descripcion ?? '' });
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingItem) {
        await configuracionApi.actualizarLugar(editingItem.id, form);
      } else {
        await configuracionApi.crearLugar(form);
      }
      setShowForm(false);
      fetch(pagina, search);
    } catch (err) {
      setFormError(extraerMensajeError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await configuracionApi.toggleActivoLugar(id);
      fetch(pagina, search);
    } catch (err) {
      setError(extraerMensajeError(err));
    }
  };

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              placeholder="Buscar lugar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className={btnSecondary}>Buscar</button>
        </form>
        <button onClick={openCreate} className={`${btnPrimary} flex items-center gap-2`}>
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Nombre', 'Descripción', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
              </td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-sm">{search ? `No se encontraron lugares para "${search}".` : 'No hay lugares registrados en el catálogo institucional.'}</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{item.nombre}</td>
                <td className="px-4 py-3 text-slate-500">{item.descripcion ?? '—'}</td>
                <td className="px-4 py-3"><BadgeActivo activo={item.activo} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(item)} className={btnIcon} title="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleToggle(item.id)} className={btnIcon} title={item.activo ? 'Desactivar' : 'Activar'}>
                      {item.activo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pagina={pagina}
          totalElementos={paginaMeta.totalElementos}
          totalPaginas={paginaMeta.totalPaginas}
          primera={paginaMeta.primera}
          ultima={paginaMeta.ultima}
          onPrev={() => setPagina(p => Math.max(0, p - 1))}
          onNext={() => setPagina(p => p + 1)}
          pageSize={PAGE_SIZE}
        />
      </div>

      {showForm && (
        <Modal
          title={editingItem ? 'Editar Lugar' : 'Nuevo Lugar'}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={formError}
        >
          <div>
            <label className={labelClass}>Nombre</label>
            <input className={inputClass} value={form.nombre} required onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Descripción</label>
            <input className={inputClass} value={form.descripcion ?? ''} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
        </Modal>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tab: Usuarios
// ---------------------------------------------------------------------------

const TabUsuarios: React.FC = () => {
  const [items, setItems] = useState<UsuarioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(0);
  const [paginaMeta, setPaginaMeta] = useState({ totalElementos: 0, totalPaginas: 0, primera: true, ultima: true });

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<UsuarioItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<UsuarioRequest>({
    username: '', password: '', nombres: '', apellidos: '', email: '', rol: 'ROLE_ORIENTADOR',
  });

  const fetch = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await configuracionApi.listarUsuarios({ page, size: PAGE_SIZE });
      setItems(data.contenido);
      setPaginaMeta({ totalElementos: data.totalElementos, totalPaginas: data.totalPaginas, primera: data.primera, ultima: data.ultima });
    } catch (err) {
      setError(extraerMensajeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(pagina); }, [fetch, pagina]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ username: '', password: '', nombres: '', apellidos: '', email: '', rol: 'ROLE_ORIENTADOR' });
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (item: UsuarioItem) => {
    setEditingItem(item);
    setForm({ username: item.username, password: '', nombres: item.nombres, apellidos: item.apellidos, email: item.email, rol: item.rol });
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const payload: UsuarioRequest = { ...form };
      if (editingItem && !payload.password) {
        delete payload.password;
      }
      if (editingItem) {
        await configuracionApi.actualizarUsuario(editingItem.id, payload);
      } else {
        await configuracionApi.crearUsuario(payload);
      }
      setShowForm(false);
      fetch(pagina);
    } catch (err) {
      setFormError(extraerMensajeError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await configuracionApi.toggleActivoUsuario(id);
      fetch(pagina);
    } catch (err) {
      setError(extraerMensajeError(err));
    }
  };

  const rolLabel = (rol: string) =>
    rol === 'ROLE_RECTOR' ? 'Rector' : rol === 'ROLE_ORIENTADOR' ? 'Orientador' : rol;

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <div className="flex justify-end">
        <button onClick={openCreate} className={`${btnPrimary} flex items-center gap-2`}>
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Username', 'Nombres', 'Apellidos', 'Email', 'Rol', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
              </td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">Sin registros</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{item.username}</td>
                <td className="px-4 py-3">{item.nombres}</td>
                <td className="px-4 py-3">{item.apellidos}</td>
                <td className="px-4 py-3 text-slate-500">{item.email}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">
                    {rolLabel(item.rol)}
                  </span>
                </td>
                <td className="px-4 py-3"><BadgeActivo activo={item.activo} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(item)} className={btnIcon} title="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleToggle(item.id)} className={btnIcon} title={item.activo ? 'Desactivar' : 'Activar'}>
                      {item.activo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pagina={pagina}
          totalElementos={paginaMeta.totalElementos}
          totalPaginas={paginaMeta.totalPaginas}
          primera={paginaMeta.primera}
          ultima={paginaMeta.ultima}
          onPrev={() => setPagina(p => Math.max(0, p - 1))}
          onNext={() => setPagina(p => p + 1)}
          pageSize={PAGE_SIZE}
        />
      </div>

      {showForm && (
        <Modal
          title={editingItem ? 'Editar Usuario' : 'Nuevo Usuario'}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={formError}
        >
          <div>
            <label className={labelClass}>Username</label>
            <input className={inputClass} value={form.username} required onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Contraseña</label>
            <input
              type="password"
              className={inputClass}
              value={form.password ?? ''}
              required={!editingItem}
              placeholder={editingItem ? 'Dejar vacío para no cambiar' : ''}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Nombres</label>
            <input className={inputClass} value={form.nombres} required onChange={e => setForm(f => ({ ...f, nombres: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Apellidos</label>
            <input className={inputClass} value={form.apellidos} required onChange={e => setForm(f => ({ ...f, apellidos: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={form.email} required onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Rol</label>
            <select className={inputClass} value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
              <option value="ROLE_RECTOR">Rector</option>
              <option value="ROLE_ORIENTADOR">Orientador</option>
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const TABS: { id: TabId; label: string }[] = [
  { id: 'faltas', label: 'Catálogo de Faltas' },
  { id: 'docentes', label: 'Docentes' },
  { id: 'lugares', label: 'Lugares' },
  { id: 'usuarios', label: 'Usuarios' },
];

export const ConfiguracionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('faltas');

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Configuración del Sistema</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gestión de catálogos, usuarios y datos de referencia institucional.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? 'border-b-2 border-blue-700 text-blue-700 font-semibold text-sm px-4 py-2.5 -mb-px'
                  : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800 text-sm px-4 py-2.5 -mb-px transition-colors'
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div>
        {activeTab === 'faltas' && <TabFaltas />}
        {activeTab === 'docentes' && <TabDocentes />}
        {activeTab === 'lugares' && <TabLugares />}
        {activeTab === 'usuarios' && <TabUsuarios />}
      </div>
    </div>
  );
};
