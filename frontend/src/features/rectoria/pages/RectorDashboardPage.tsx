import React, { useEffect, useState, useCallback } from 'react';
import { rectoriaApi } from '../api/rectoriaApi';
import { MetricasDashboardRectoria } from '../types/rectoria.types';
import { 
  BarChart3, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  FileSpreadsheet, 
  ShieldCheck, 
  Users, 
  BookOpenCheck,
  Scale,
  RefreshCw,
  MapPin,
  GraduationCap,
  PieChart as PieIcon,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

const COLORES_LEY = {
  tipoI: '#EAB308',  // Amarillo Oro
  tipoII: '#FB923C', // Naranja institucional Tipo II
  tipoIII: '#B91C1C', // Rojo sobrio Tipo III
};

const PALETA_BARRAS = [
  '#1E3A8A', // Azul Marino
  '#38BDF8', // Celeste
  '#EAB308', // Amarillo Oro
  '#15803D', // Verde Laurel
  '#0F172A', // Slate Dark
  '#854D0E', // Marrón Búho
];

export const RectorDashboardPage: React.FC = () => {
  const [metricas, setMetricas] = useState<MetricasDashboardRectoria | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recargando, setRecargando] = useState<boolean>(false);
  const [descargandoPdf, setDescargandoPdf] = useState<boolean>(false);

  const cargarDatos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRecargando(true);
    else setCargando(true);
    setError(null);

    try {
      const data = await rectoriaApi.obtenerMetricasDashboard();
      setMetricas(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'No fue posible cargar las métricas institucionales.');
    } finally {
      setCargando(false);
      setRecargando(false);
    }
  }, []);

  const handleDescargarInforme = async () => {
    setDescargandoPdf(true);
    try {
      const blob = await rectoriaApi.descargarConsolidadoPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Informe-Ejecutivo-Convivencia-${new Date().getFullYear()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      const e = err as Error;
      setError('Error al generar el informe en PDF: ' + (e.message || 'Fallo de conexión'));
    } finally {
      setDescargandoPdf(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Datos para gráfica de torta Ley 1620
  const datosLey = metricas ? [
    { name: 'Tipo I (Leves)', value: metricas.tipoI, color: COLORES_LEY.tipoI },
    { name: 'Tipo II (Graves)', value: metricas.tipoII, color: COLORES_LEY.tipoII },
    { name: 'Tipo III (Gravísimas)', value: metricas.tipoIII, color: COLORES_LEY.tipoIII },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="space-y-4 pb-8">
      {/* Barra de Título Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            Tablero Directivo de Convivencia
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisión institucional en tiempo real, mapas de criticidad y garantía de debido proceso (Ley 1620).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => cargarDatos(true)}
            disabled={cargando || recargando}
            className="flex-1 sm:flex-initial h-10 px-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Refrescar métricas en tiempo real"
          >
            <RefreshCw className={`w-4 h-4 ${recargando ? 'animate-spin text-blue-700' : 'text-slate-500'}`} />
            <span>Actualizar</span>
          </button>

          <button
            type="button"
            onClick={handleDescargarInforme}
            disabled={descargandoPdf || cargando}
            className="flex-1 sm:flex-initial h-10 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className={`w-4 h-4 ${descargandoPdf ? 'animate-pulse' : ''}`} />
            <span>{descargandoPdf ? 'Generando...' : 'Exportar Informe'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3 text-xs text-red-800 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
          <button
            onClick={() => cargarDatos()}
            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* KPI Cards: Métricas Compactas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Casos */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-700" />
              Total Casos
            </span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 leading-tight mt-1">
            {cargando ? '...' : (metricas?.totalIncidentes ?? 0)}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-between">
            <span>En trámite: <strong className="text-amber-700">{metricas?.casosEnTramite ?? 0}</strong></span>
            <span>Cerrados: <strong className="text-emerald-700">{metricas?.casosCerrados ?? 0}</strong></span>
          </p>
        </div>

        {/* Faltas Tipo I */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              Tipo I (Leves)
            </span>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 leading-tight mt-1">
            {cargando ? '...' : (metricas?.tipoI ?? 0)}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mediaciones y acuerdos
          </p>
        </div>

        {/* Faltas Tipo II */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Tipo II (Graves)
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 leading-tight mt-1">
            {cargando ? '...' : (metricas?.tipoII ?? 0)}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comité & citación acudiente
          </p>
        </div>

        {/* Faltas Tipo III */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              Tipo III (Gravísimas)
            </span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 leading-tight mt-1">
            {cargando ? '...' : (metricas?.tipoIII ?? 0)}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ruta Integral (ICBF/Policía)
          </p>
        </div>

        {/* Tasa de Resolución y Efectividad */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Efectividad
            </span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 leading-tight mt-1">
            {cargando ? '...' : `${metricas?.tasaResolucion ?? 0}%`}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-between">
            <span>Alumnos: <strong>{metricas?.totalEstudiantesInvolucrados ?? 0}</strong></span>
            <span>Reincid: <strong className="text-amber-700">{metricas?.totalEstudiantesReincidentes ?? 0}</strong></span>
          </p>
        </div>
      </div>

      {/* Grid Principal de Analítica Visual: Tipología y Focos Críticos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Gráfico 1: Proporción Ley 1620 (Donut) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-slate-700" />
                <div>
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Distribución Ley 1620</h2>
                  <p className="text-xs text-slate-500">Proporción por tipología de falta escolar</p>
                </div>
              </div>
            </div>

            <div className="h-56 w-full relative flex items-center justify-center">
              {datosLey.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosLey}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {datosLey.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: unknown) => [`${val ?? 0} expedientes`, 'Cantidad']}
                      contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={32}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-400 text-xs flex flex-col items-center">
                  <BookOpenCheck className="w-7 h-7 text-slate-300 mb-1" />
                  <span>Sin registros tipificados para este periodo</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-center">
            <div className="p-2 rounded-lg bg-yellow-50/70 border border-yellow-200/50">
              <span className="block text-xs font-semibold text-yellow-800">Tipo I</span>
              <strong className="text-sm font-bold text-yellow-900">{metricas?.tipoI ?? 0}</strong>
            </div>
            <div className="p-2 rounded-lg bg-orange-50/70 border border-orange-200/50">
              <span className="block text-xs font-semibold text-orange-800">Tipo II</span>
              <strong className="text-sm font-bold text-orange-900">{metricas?.tipoII ?? 0}</strong>
            </div>
            <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-200/50">
              <span className="block text-xs font-semibold text-rose-800">Tipo III</span>
              <strong className="text-sm font-bold text-rose-900">{metricas?.tipoIII ?? 0}</strong>
            </div>
          </div>
        </div>

        {/* Gráfico 2: Focos Críticos de Convivencia (Lugares Más Frecuentes) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-700" />
                <div>
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Mapa de Calor: Lugares Críticos</h2>
                  <p className="text-xs text-slate-500">Zonas del plantel con mayor frecuencia de incidentes</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400">Top Espacios</span>
            </div>

            <div className="h-56 w-full">
              {metricas?.focosCriticosLugares && metricas.focosCriticosLugares.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metricas.focosCriticosLugares}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis 
                      dataKey="nombreLugar" 
                      type="category" 
                      tick={{ fontSize: 11, fill: '#475569' }} 
                      width={110}
                    />
                    <Tooltip 
                      formatter={(val: unknown, _name: unknown, props: { payload?: { porcentaje?: number } }) => [
                        `${val ?? 0} casos (${props?.payload?.porcentaje ?? 0}%)`,
                        'Incidencia'
                      ]}
                      contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                    />
                    <Bar dataKey="cantidad" fill="#1E3A8A" radius={[0, 3, 3, 0]}>
                      {metricas.focosCriticosLugares.map((_, index) => (
                        <Cell key={`bar-${index}`} fill={PALETA_BARRAS[index % PALETA_BARRAS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  <span>Sin datos de localización registrados</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Recomendación: Fortalecer vigilancia docente en zonas críticas</span>
            <span className="font-semibold text-blue-700">Protocolo Preventivo</span>
          </div>
        </div>
      </div>

      {/* Grid Secundario: Tendencia Temporal, Grados e Incidentes por Hora */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Gráfico 3: Tendencia Mensual */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-700" />
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Evolución Cronológica</h2>
                <p className="text-xs text-slate-500">Comportamiento mensual en el año lectivo</p>
              </div>
            </div>
          </div>

          <div className="h-52 w-full">
            {metricas?.tendenciaMensual && metricas.tendenciaMensual.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metricas.tendenciaMensual}
                  margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCasos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip 
                    formatter={(val: unknown) => [`${val ?? 0} incidentes`, 'Casos']}
                    contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cantidad" 
                    stroke="#1E3A8A" 
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#colorCasos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                <span>Sin datos cronológicos suficientes</span>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico 4: Distribución por Grado Escolar */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-700" />
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Incidencia por Grado</h2>
                <p className="text-xs text-slate-500">Grado histórico capturado al momento de los hechos</p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400">Grados 6° a 11°</span>
          </div>

          <div className="h-52 w-full">
            {metricas?.distribucionPorGrado && metricas.distribucionPorGrado.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricas.distribucionPorGrado}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="grado" 
                    tick={{ fontSize: 11 }} 
                    tickFormatter={(g) => `${g}°`}
                  />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip 
                    formatter={(val: unknown, _name: unknown, props: { payload?: { porcentaje?: number } }) => [
                      `${val ?? 0} casos (${props?.payload?.porcentaje ?? 0}%)`,
                      'Incidentes'
                    ]}
                    contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                  />
                  <Bar dataKey="cantidad" fill="#1E3A8A" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                <span>Sin datos de grados registrados</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Terciario: Franjas Horarias Críticas & Estados del Debido Proceso */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Franjas Horarias Críticas */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-700" />
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Franjas Horarias Críticas</h2>
                <p className="text-xs text-slate-500">Distribución por periodos de la jornada escolar</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {metricas?.franjasHorariasCriticas?.map((f, i) => (
              <div key={i} className="p-2 bg-slate-50 border border-slate-100 rounded-md">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{f.franja}</span>
                  <span className="font-bold text-slate-900">{f.cantidad} casos ({f.porcentaje}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-700 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, f.porcentaje)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Embudo del Debido Proceso Institucional */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-700" />
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Fases del Debido Proceso</h2>
                <p className="text-xs text-slate-500">Trazabilidad de trámites institucionales activos</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {metricas?.casosCerrados ?? 0} cerrados
            </span>
          </div>

          <div className="space-y-2">
            {metricas?.distribucionEstados?.map((est, i) => (
              <div key={i} className="p-2 bg-slate-50 border border-slate-100 rounded-md">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-800">{est.etiqueta}</span>
                  <span className="font-bold text-slate-900">{est.cantidad} casos ({est.porcentaje}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      est.estado === 'CERRADO' ? 'bg-emerald-600' : 'bg-blue-700'
                    }`}
                    style={{ width: `${Math.min(100, est.porcentaje)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gobernanza Institucional & Marco Normativo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-slate-700" />
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Ruta de Atención Integral (Ley 1620 de 2013)
                </h2>
                <p className="text-xs text-slate-500">
                  Custodia probatoria y garantía constitucional de debido proceso
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              Protocolo Activo
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            La plataforma garantiza la custodia probatoria de cada proceso disciplinario. Toda actuación preserva el registro histórico inalterable del estudiante al momento de la falta para salvaguardar el debido proceso ante el Comité Escolar de Convivencia y entidades externas de inspección y vigilancia.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Seguridad Jurídica & Validez Histórica</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Garantiza que la promoción académica no altere retroactivamente el curso donde ocurrieron las faltas.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-blue-700" />
                <span>Debido Proceso Constitucional</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Registro inalterable de versiones libres, descargos y compromisos vinculantes.
              </p>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Estado del Comité Escolar de Convivencia */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-3">
              <Users className="w-4 h-4 text-slate-700" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Comité de Convivencia
                </h3>
                <p className="text-xs text-slate-500">
                  Instancia de concertación institucional
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">Rector (Presidente)</span>
                <span className="font-bold text-blue-700 text-xs">Verificado</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">Orientación Escolar</span>
                <span className="font-bold text-emerald-700 text-xs">En Línea</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">Personería Estudiantil</span>
                <span className="font-medium text-slate-500 text-xs">Convocado</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">Consejo de Padres</span>
                <span className="font-medium text-slate-500 text-xs">Convocado</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sesión Ordinaria:</span>
            <span className="font-semibold text-slate-800">Vigencia {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
