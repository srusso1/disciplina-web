import React, { useMemo, useState } from 'react';
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  ExternalLink,
  Filter,
  Info,
  Loader2,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { notificacionesApi } from '../api/notificacionesApi';
import { NotificacionItem, SeveridadNotificacion, TipoNotificacion } from '../types/notificacion.types';

const formatoFecha = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

const aFechaInput = (fecha: Date) => {
  const zonaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return zonaLocal.toISOString().slice(0, 10);
};

const tiempoRelativo = (fechaIso: string) => {
  const diferencia = Date.now() - new Date(fechaIso).getTime();
  const minutos = Math.floor(diferencia / 60000);
  if (minutos < 1) return 'Hace un momento';
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return dias === 1 ? 'Ayer' : `Hace ${dias} días`;
};

const estilosSeveridad: Record<SeveridadNotificacion, { etiqueta: string; clase: string; Icono: typeof Info }> = {
  BAJA: { etiqueta: 'Baja', clase: 'border-slate-200 bg-slate-100 text-slate-700', Icono: Info },
  MEDIA: { etiqueta: 'Media', clase: 'border-blue-200 bg-blue-50 text-blue-800', Icono: Bell },
  ALTA: { etiqueta: 'Alta', clase: 'border-amber-200 bg-amber-50 text-amber-800', Icono: AlertTriangle },
  CRITICA: { etiqueta: 'Crítica', clase: 'border-red-200 bg-red-50 text-red-800', Icono: ShieldAlert },
};

const etiquetaTipo: Record<TipoNotificacion, string> = {
  CRITICA: 'Crítica', TERMINO_LEGAL: 'Término legal', SEGUIMIENTO: 'Seguimiento', INFORMATIVA: 'Informativa',
};

const rangoRapido = (rango: 'hoy' | 'semana' | 'mes' | 'todo') => {
  const hoy = new Date();
  if (rango === 'todo') return { desde: '', hasta: '' };
  const desde = new Date(hoy);
  if (rango === 'semana') desde.setDate(hoy.getDate() - 6);
  if (rango === 'mes') desde.setDate(hoy.getDate() - 29);
  return { desde: aFechaInput(desde), hasta: aFechaInput(hoy) };
};

export const BitacoraNotificacionesPage: React.FC = () => {
  const [pagina, setPagina] = useState(0);
  const [tipo, setTipo] = useState<TipoNotificacion | ''>('');
  const [lectura, setLectura] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [tamano, setTamano] = useState(20);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const queryClient = useQueryClient();
  const filtros = { pagina, tipo: tipo || undefined, leida: lectura === '' ? undefined : lectura === 'true',
    desde: desde || undefined, hasta: hasta || undefined, tamano };
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['notificaciones', 'historial', filtros],
    queryFn: () => notificacionesApi.obtenerHistorial(filtros),
    placeholderData: keepPreviousData,
  });
  const marcarLeida = useMutation({
    mutationFn: notificacionesApi.marcarLeida,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notificaciones'] }),
  });
  const marcarTodasLeidas = useMutation({
    mutationFn: notificacionesApi.marcarTodasLeidas,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notificaciones'] }),
  });

  const resumen = useMemo(() => {
    const contenido = data?.contenido ?? [];
    return {
      pendientes: contenido.filter((item) => !item.leida).length,
      criticas: contenido.filter((item) => !item.leida && item.severidad === 'CRITICA').length,
      terminos: contenido.filter((item) => !item.leida && item.tipo === 'TERMINO_LEGAL').length,
    };
  }, [data]);
  const hayFiltros = Boolean(tipo || lectura || desde || hasta || tamano !== 20);
  const limpiarFiltros = () => {
    setTipo(''); setLectura(''); setDesde(''); setHasta(''); setTamano(20); setPagina(0);
  };
  const seleccionarRango = (rango: 'hoy' | 'semana' | 'mes' | 'todo') => {
    const fechas = rangoRapido(rango);
    setDesde(fechas.desde); setHasta(fechas.hasta); setPagina(0);
  };

  return (
    <section className="space-y-4 pb-8">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900"><Bell className="h-5 w-5 text-trujillo-navy" strokeWidth={1.75} />Bitácora de notificaciones</h1>
          <p className="mt-1 text-sm text-slate-600">Alertas y actuaciones asignadas a tu cuenta. Los registros se conservan como historial.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => refetch()} disabled={isFetching} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy disabled:opacity-50">
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} strokeWidth={1.75} />Actualizar
          </button>
          <button type="button" onClick={() => marcarTodasLeidas.mutate()} disabled={marcarTodasLeidas.isPending} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-trujillo-navy px-3 text-xs font-semibold text-white transition-colors hover:bg-trujillo-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            {marcarTodasLeidas.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.75} />}Marcar todas como leídas
          </button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Resumen etiqueta="Pendientes visibles" valor={resumen.pendientes} descripcion="Requieren revisión" Icono={Circle} clase="border-blue-200 bg-blue-50 text-blue-800" />
        <Resumen etiqueta="Críticas visibles" valor={resumen.criticas} descripcion="Atención prioritaria" Icono={ShieldAlert} clase="border-red-200 bg-red-50 text-red-800" />
        <Resumen etiqueta="Términos legales" valor={resumen.terminos} descripcion="Pendientes en esta vista" Icono={CalendarClock} clase="border-amber-200 bg-amber-50 text-amber-800" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50/60 p-3">
          <button type="button" onClick={() => setMostrarFiltros((visible) => !visible)} aria-expanded={mostrarFiltros} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy">
            <Filter className="h-3.5 w-3.5" strokeWidth={1.75} />{mostrarFiltros ? 'Ocultar filtros' : 'Filtros'}{hayFiltros && <span className="h-1.5 w-1.5 rounded-full bg-trujillo-navy" />}
          </button>
          <div className="flex flex-wrap items-center gap-1.5">
            {(['hoy', 'semana', 'mes', 'todo'] as const).map((rango) => <button key={rango} type="button" onClick={() => seleccionarRango(rango)} className="h-8 rounded-md px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy">
              {{ hoy: 'Hoy', semana: 'Últimos 7 días', mes: 'Últimos 30 días', todo: 'Todo el historial' }[rango]}
            </button>)}
          </div>
          {hayFiltros && <button type="button" onClick={limpiarFiltros} className="ml-auto inline-flex h-8 items-center gap-1 text-xs font-semibold text-trujillo-navy hover:text-trujillo-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy"><RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />Limpiar</button>}
        </div>
        {mostrarFiltros && <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-xs font-semibold tracking-wide text-slate-700">Tipo
          <select value={tipo} onChange={e => { setTipo(e.target.value as TipoNotificacion | ''); setPagina(0); }}
            className="mt-1.5 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-trujillo-navy focus:outline-none focus:ring-2 focus:ring-trujillo-navy/20">
            <option value="">Todos</option>
            <option value="CRITICA">Crítica</option>
            <option value="TERMINO_LEGAL">Término legal</option>
            <option value="SEGUIMIENTO">Seguimiento</option>
            <option value="INFORMATIVA">Informativa</option>
          </select>
        </label>
        <label className="text-xs font-semibold tracking-wide text-slate-700">Estado
          <select value={lectura} onChange={e => { setLectura(e.target.value); setPagina(0); }}
            className="mt-1.5 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-trujillo-navy focus:outline-none focus:ring-2 focus:ring-trujillo-navy/20">
            <option value="">Todas</option><option value="false">No leídas</option><option value="true">Leídas</option>
          </select>
        </label>
        <label className="text-xs font-semibold tracking-wide text-slate-700">Desde
          <input type="date" value={desde} onChange={e => { setDesde(e.target.value); setPagina(0); }}
            className="mt-1.5 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-trujillo-navy focus:outline-none focus:ring-2 focus:ring-trujillo-navy/20" />
        </label>
        <label className="text-xs font-semibold tracking-wide text-slate-700">Hasta
          <input type="date" min={desde || undefined} value={hasta} onChange={e => { setHasta(e.target.value); setPagina(0); }}
            className="mt-1.5 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-trujillo-navy focus:outline-none focus:ring-2 focus:ring-trujillo-navy/20" />
        </label>
        <label className="text-xs font-semibold tracking-wide text-slate-700">Por página
          <select value={tamano} onChange={(e) => { setTamano(Number(e.target.value)); setPagina(0); }} className="mt-1.5 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-trujillo-navy focus:outline-none focus:ring-2 focus:ring-trujillo-navy/20"><option value={20}>20 registros</option><option value={50}>50 registros</option><option value={100}>100 registros</option></select>
        </label>
        </div>}

        {isLoading && !data ? <ListaEsqueleto /> : null}
        {isError ? <EstadoError alReintentar={() => refetch()} /> : null}
        {data && !isError && <>
          <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500"><span>{data.totalElementos} notificaciones encontradas</span>{isFetching && <span className="flex items-center gap-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin" />Actualizando</span>}</div>
          {data.contenido.length > 0 ? <ul className="divide-y divide-slate-100">{data.contenido.map((item) => <NotificacionFila key={item.id} item={item} marcando={marcarLeida.isPending && marcarLeida.variables === item.id} alMarcar={() => marcarLeida.mutate(item.id)} />)}</ul> : <EstadoVacio filtrado={hayFiltros} alLimpiar={limpiarFiltros} />}
          {data.contenido.length > 0 && <Paginacion data={data} tamano={tamano} alAnterior={() => setPagina((actual) => actual - 1)} alSiguiente={() => setPagina((actual) => actual + 1)} />}
        </>}
      </div>
    </section>
  );
};

const Resumen = ({ etiqueta, valor, descripcion, Icono, clase }: { etiqueta: string; valor: number; descripcion: string; Icono: typeof Bell; clase: string }) => <div className={`flex items-center gap-3 rounded-xl border p-3.5 ${clase}`}><div className="rounded-md bg-white/70 p-2"><Icono className="h-4 w-4" strokeWidth={1.75} /></div><div><p className="text-xl font-bold leading-none">{valor}</p><p className="mt-1 text-xs font-semibold">{etiqueta}</p><p className="mt-0.5 text-[11px] opacity-80">{descripcion}</p></div></div>;

const NotificacionFila = ({ item, marcando, alMarcar }: { item: NotificacionItem; marcando: boolean; alMarcar: () => void }) => {
  const severidad = estilosSeveridad[item.severidad];
  const { Icono } = severidad;
  return <li className={`p-4 transition-colors hover:bg-slate-50/70 ${!item.leida ? 'border-l-2 border-l-trujillo-navy bg-blue-50/30' : 'border-l-2 border-l-transparent'}`}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${severidad.clase}`}><Icono className="h-3.5 w-3.5" strokeWidth={1.75} />{severidad.etiqueta}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{etiquetaTipo[item.tipo]}</span>{!item.leida && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-trujillo-navy"><Circle className="h-2 w-2 fill-current" />Nueva</span>}</div><p className={`mt-2 text-sm ${!item.leida ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>{item.titulo}</p><p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">{item.mensaje}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" strokeWidth={1.75} /><span>{tiempoRelativo(item.createdAt)}</span><span aria-hidden="true">·</span><span>{formatoFecha.format(new Date(item.createdAt))}</span></p></div><div className="flex shrink-0 items-center gap-2">{!item.leida && <button type="button" disabled={marcando} onClick={alMarcar} className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-semibold text-trujillo-navy hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy disabled:opacity-50">{marcando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" strokeWidth={1.75} />}Marcar leída</button>}{item.rutaEnlace && <Link to={item.rutaEnlace} className="inline-flex h-8 items-center gap-1 rounded-md bg-trujillo-navy px-2.5 text-xs font-semibold text-white hover:bg-trujillo-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy focus-visible:ring-offset-2">Ver recurso<ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} /></Link>}</div></div>
  </li>;
};

const ListaEsqueleto = () => <div className="animate-pulse divide-y divide-slate-100">{Array.from({ length: 4 }, (_, indice) => <div key={indice} className="space-y-3 p-4"><div className="h-5 w-24 rounded bg-slate-200" /><div className="h-4 w-2/5 rounded bg-slate-200" /><div className="h-4 w-4/5 rounded bg-slate-100" /></div>)}</div>;
const EstadoError = ({ alReintentar }: { alReintentar: () => void }) => <div role="alert" className="m-4 rounded-lg border border-red-200 bg-red-50 p-5 text-center"><ShieldAlert className="mx-auto h-6 w-6 text-red-700" strokeWidth={1.75} /><p className="mt-2 text-sm font-semibold text-red-900">No se pudo cargar la bitácora</p><p className="mt-1 text-xs text-red-700">Verifica tu conexión e inténtalo de nuevo.</p><button type="button" onClick={alReintentar} className="mt-3 h-8 rounded-md border border-red-300 bg-white px-3 text-xs font-semibold text-red-800 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy">Reintentar</button></div>;
const EstadoVacio = ({ filtrado, alLimpiar }: { filtrado: boolean; alLimpiar: () => void }) => <div className="p-10 text-center"><Bell className="mx-auto h-8 w-8 text-slate-400" strokeWidth={1.75} /><p className="mt-3 text-sm font-semibold text-slate-800">{filtrado ? 'No hay resultados para estos filtros' : 'Aún no tienes notificaciones'}</p><p className="mt-1 text-xs text-slate-500">{filtrado ? 'Prueba con un rango de fechas o estado diferente.' : 'Las novedades y términos del debido proceso aparecerán aquí.'}</p>{filtrado && <button type="button" onClick={alLimpiar} className="mt-3 text-xs font-semibold text-trujillo-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy">Limpiar filtros</button>}</div>;
const Paginacion = ({ data, tamano, alAnterior, alSiguiente }: { data: { pagina: number; totalPaginas: number; totalElementos: number; primera: boolean; ultima: boolean }; tamano: number; alAnterior: () => void; alSiguiente: () => void }) => { const inicio = data.totalElementos === 0 ? 0 : data.pagina * tamano + 1; const fin = Math.min((data.pagina + 1) * tamano, data.totalElementos); return <nav aria-label="Paginación de notificaciones" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3"><span className="text-xs text-slate-500">Mostrando {inicio}–{fin} de {data.totalElementos}</span><div className="flex items-center gap-2"><button type="button" aria-label="Página anterior" disabled={data.primera} onClick={alAnterior} className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />Anterior</button><span className="text-xs font-medium text-slate-600">Página {data.pagina + 1} de {Math.max(1, data.totalPaginas)}</span><button type="button" aria-label="Página siguiente" disabled={data.ultima} onClick={alSiguiente} className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trujillo-navy disabled:opacity-40">Siguiente<ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} /></button></div></nav>; };
