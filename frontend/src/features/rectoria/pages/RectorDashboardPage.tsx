import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../../core/auth/useAuthStore';
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
  tipoI: '#EAB308',
  tipoII: '#F97316',
  tipoIII: '#EF4444',
};

const PALETA_BARRAS = [
  '#1E3A8A',
  '#2563EB',
  '#3B82F6',
  '#60A5FA',
  '#93C5FD',
  '#BFDBFE',
];

export const RectorDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [metricas, setMetricas] = useState<MetricasDashboardRectoria | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recargando, setRecargando] = useState<boolean>(false);

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
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Banner Directivo Institucional */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trujillo-ice text-trujillo-navy text-xs font-bold border border-sky-200">
            <Scale className="w-3.5 h-3.5 text-trujillo-navy" />
            <span>Despacho Directivo & Analítica de Convivencia</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            Observatorio Institucional: {user?.nombres} {user?.apellidos}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisión directiva en tiempo real, mapas de criticidad y garantía de debido proceso (Ley 1620).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => cargarDatos(true)}
            disabled={cargando || recargando}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all active:scale-[0.97]"
            title="Refrescar métricas en tiempo real"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recargando ? 'animate-spin text-trujillo-navy' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-trujillo-navy hover:bg-trujillo-navy-light text-white text-xs font-bold shadow-md shadow-trujillo-navy/20 transition-all active:scale-[0.97] cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-trujillo-sky" />
            <span>Exportar Informe</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-red-800">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
          <button
            onClick={() => cargarDatos()}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg font-bold"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* KPI Cards: Semáforo y Tasa de Resolución */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Casos */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-trujillo-navy mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Expedientes</span>
            <div className="p-2 rounded-xl bg-trujillo-ice text-trujillo-navy">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {cargando ? '...' : (metricas?.totalIncidentes ?? 0)}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>En trámite: <strong className="text-amber-700">{metricas?.casosEnTramite ?? 0}</strong></span>
            <span>Cerrados: <strong className="text-emerald-700">{metricas?.casosCerrados ?? 0}</strong></span>
          </div>
        </div>

        {/* Faltas Tipo I */}
        <div className="bg-white border border-yellow-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-yellow-400">
          <div className="flex items-center justify-between text-yellow-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tipo I (Leves)</span>
            <div className="p-2 rounded-xl bg-yellow-100/70 text-yellow-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-yellow-900">
            {cargando ? '...' : (metricas?.tipoI ?? 0)}
          </p>
          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-yellow-100">
            Mediaciones y acuerdos de aula
          </p>
        </div>

        {/* Faltas Tipo II */}
        <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-orange-400">
          <div className="flex items-center justify-between text-orange-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tipo II (Graves)</span>
            <div className="p-2 rounded-xl bg-orange-100/70 text-orange-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-orange-900">
            {cargando ? '...' : (metricas?.tipoII ?? 0)}
          </p>
          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-orange-100">
            Comité & citación de acudientes
          </p>
        </div>

        {/* Faltas Tipo III */}
        <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-rose-400">
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tipo III (Gravísimas)</span>
            <div className="p-2 rounded-xl bg-rose-100/70 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-900">
            {cargando ? '...' : (metricas?.tipoIII ?? 0)}
          </p>
          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-rose-100">
            Activación Ruta Integral (ICBF/Policía)
          </p>
        </div>

        {/* Tasa de Resolución y Efectividad */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Efectividad Proceso</span>
            <div className="p-2 rounded-xl bg-emerald-100/70 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-950">
            {cargando ? '...' : `${metricas?.tasaResolucion ?? 0}%`}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-emerald-100">
            <span>Alumnos: <strong>{metricas?.totalEstudiantesInvolucrados ?? 0}</strong></span>
            <span>Reincidencia: <strong className="text-amber-700">{metricas?.totalEstudiantesReincidentes ?? 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Grid Principal de Analítica Visual: Tipología y Focos Críticos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico 1: Proporción Ley 1620 (Donut) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-trujillo-ice text-trujillo-navy">
                  <PieIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Distribución Ley 1620 de 2013</h2>
                  <p className="text-[11px] text-slate-500">Proporción por tipología de falta escolar</p>
                </div>
              </div>
            </div>

            <div className="h-64 w-full relative flex items-center justify-center">
              {datosLey.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosLey}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {datosLey.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`${val ?? 0} expedientes`, 'Cantidad']}
                      contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-400 text-xs flex flex-col items-center">
                  <BookOpenCheck className="w-8 h-8 text-slate-300 mb-1" />
                  <span>Sin registros tipificados para este periodo</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-yellow-50">
              <span className="block text-[10px] font-bold text-yellow-800">Tipo I</span>
              <strong className="text-sm font-black text-yellow-900">{metricas?.tipoI ?? 0}</strong>
            </div>
            <div className="p-2 rounded-xl bg-orange-50">
              <span className="block text-[10px] font-bold text-orange-800">Tipo II</span>
              <strong className="text-sm font-black text-orange-900">{metricas?.tipoII ?? 0}</strong>
            </div>
            <div className="p-2 rounded-xl bg-rose-50">
              <span className="block text-[10px] font-bold text-rose-800">Tipo III</span>
              <strong className="text-sm font-black text-rose-900">{metricas?.tipoIII ?? 0}</strong>
            </div>
          </div>
        </div>

        {/* Gráfico 2: Focos Críticos de Convivencia (Lugares Más Frecuentes) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                  <MapPin className="w-4 h-4 text-trujillo-navy" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Mapa de Calor: Lugares Críticos</h2>
                  <p className="text-[11px] text-slate-500">Zonas del plantel con mayor frecuencia de reportes</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Top Espacios</span>
            </div>

            <div className="h-64 w-full">
              {metricas?.focosCriticosLugares && metricas.focosCriticosLugares.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metricas.focosCriticosLugares}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis 
                      dataKey="nombreLugar" 
                      type="category" 
                      tick={{ fontSize: 11, fill: '#475569' }} 
                      width={120}
                    />
                    <Tooltip 
                      formatter={(val: any, _name: any, props: any) => [
                        `${val ?? 0} casos (${props?.payload?.porcentaje ?? 0}%)`,
                        'Incidencia'
                      ]}
                      contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Bar dataKey="cantidad" fill="#1E3A8A" radius={[0, 8, 8, 0]}>
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

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Recomendación: Incrementar rondas docentes en las zonas con mayor concentración</span>
            <span className="font-bold text-trujillo-navy">Vigilancia Focalizada</span>
          </div>
        </div>
      </div>

      {/* Grid Secundario: Tendencia Temporal, Grados e Incidentes por Hora */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico 3: Tendencia Mensual */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 text-trujillo-navy">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Evolución Cronológica de Conflictividad</h2>
                <p className="text-[11px] text-slate-500">Comportamiento mensual a lo largo del año lectivo</p>
              </div>
            </div>
          </div>

          <div className="h-60 w-full">
            {metricas?.tendenciaMensual && metricas.tendenciaMensual.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metricas.tendenciaMensual}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCasos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip 
                    formatter={(val: any) => [`${val ?? 0} incidentes`, 'Casos registrados']}
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cantidad" 
                    stroke="#1E3A8A" 
                    strokeWidth={2.5}
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

        {/* Gráfico 4: Distribución por Grado Escolar (Snapshots Inmutables) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-100 text-trujillo-navy">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Incidencia por Grado Escolar</h2>
                <p className="text-[11px] text-slate-500">Grado histórico capturado en el momento del hecho</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Grados 6° a 11°</span>
          </div>

          <div className="h-60 w-full">
            {metricas?.distribucionPorGrado && metricas.distribucionPorGrado.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricas.distribucionPorGrado}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="grado" 
                    tick={{ fontSize: 11 }} 
                    tickFormatter={(g) => `Grado ${g}°`}
                  />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip 
                    formatter={(val: any, _name: any, props: any) => [
                      `${val ?? 0} casos (${props?.payload?.porcentaje ?? 0}%)`,
                      'Incidentes'
                    ]}
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="cantidad" fill="#2563EB" radius={[6, 6, 0, 0]} />
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Franjas Horarias Críticas */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Franjas Horarias Críticas</h2>
                <p className="text-[11px] text-slate-500">Distribución por periodos del horario escolar</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {metricas?.franjasHorariasCriticas?.map((f, i) => (
              <div key={i} className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">{f.franja}</span>
                  <span className="font-black text-trujillo-navy">{f.cantidad} casos ({f.porcentaje}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-trujillo-navy h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, f.porcentaje * 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Embudo del Debido Proceso Institucional */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Embudo del Debido Proceso</h2>
                <p className="text-[11px] text-slate-500">Trazabilidad de fases de los trámites activos</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {metricas?.casosCerrados ?? 0} cerrados
            </span>
          </div>

          <div className="space-y-3">
            {metricas?.distribucionEstados?.map((est, i) => (
              <div key={i} className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-800">{est.etiqueta}</span>
                  <span className="font-black text-slate-900">{est.cantidad} casos ({est.porcentaje}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      est.estado === 'CERRADO' ? 'bg-emerald-600' : 'bg-trujillo-navy'
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-trujillo-navy text-white">
                <BookOpenCheck className="w-5 h-5 text-trujillo-sky" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Ruta de Atención Integral para la Convivencia Escolar
                </h2>
                <p className="text-xs text-slate-500">
                  Marco legal colombiano: Ley 1620 de 2013 y Decreto 1965 de 2013
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Protocolo Activo
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            La plataforma <span className="font-bold text-trujillo-navy">Disciplina+</span> garantiza la custodia probatoria de cada proceso disciplinario. Toda actuación incorpora snapshots inmutables del estudiante (matrícula, acudiente y grado) para salvaguardar el debido proceso ante el Comité Escolar de Convivencia y entidades de inspección y vigilancia educativa (Secretaría de Educación y MEN).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Seguridad Jurídica & Snapshots</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Garantiza que la promoción académica o traslados de matrícula no alteren retroactivamente el curso donde ocurrieron las faltas.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-trujillo-navy" />
                <span>Debido Proceso Constitucional</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Registro de versiones libres, descargos y compromisos vinculantes de estudiantes y acudientes.
              </p>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Estado del Comité Escolar de Convivencia */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
              <div className="p-2 rounded-xl bg-sky-50 text-trujillo-navy border border-sky-100">
                <Users className="w-5 h-5 text-trujillo-navy" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Comité de Convivencia
                </h3>
                <p className="text-[11px] text-slate-500">
                  Instancia de concertación institucional
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-600">Rector (Presidente)</span>
                <span className="font-bold text-trujillo-navy">Verificado</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-600">Orientación Escolar</span>
                <span className="font-bold text-emerald-700">En Línea</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-600">Personería Estudiantil</span>
                <span className="font-medium text-slate-500">Convocado</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-600">Rep. Consejo de Padres</span>
                <span className="font-medium text-slate-500">Convocado</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Próxima Sesión Ordinaria:</span>
            <span className="font-bold text-trujillo-navy">Marzo 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
