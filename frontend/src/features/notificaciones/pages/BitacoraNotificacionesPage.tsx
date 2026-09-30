import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { notificacionesApi } from '../api/notificacionesApi';
import { TipoNotificacion } from '../types/notificacion.types';

export const BitacoraNotificacionesPage: React.FC = () => {
  const [pagina, setPagina] = useState(0);
  const [tipo, setTipo] = useState<TipoNotificacion | ''>('');
  const [lectura, setLectura] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const queryClient = useQueryClient();
  const filtros = { pagina, tipo: tipo || undefined, leida: lectura === '' ? undefined : lectura === 'true',
    desde: desde || undefined, hasta: hasta || undefined };
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notificaciones', 'historial', filtros],
    queryFn: () => notificacionesApi.obtenerHistorial(filtros),
  });
  const marcarLeida = useMutation({
    mutationFn: notificacionesApi.marcarLeida,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notificaciones'] }),
  });

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Bitácora de notificaciones</h1>
        <p className="text-sm text-slate-600">Historial de alertas asignadas a tu cuenta. Los registros no se eliminan al leerlos.</p>
      </header>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">Tipo
          <select value={tipo} onChange={e => { setTipo(e.target.value as TipoNotificacion | ''); setPagina(0); }}
            className="mt-1 w-full rounded-md border border-slate-300 p-2">
            <option value="">Todos</option>
            <option value="CRITICA">Crítica</option>
            <option value="TERMINO_LEGAL">Término legal</option>
            <option value="SEGUIMIENTO">Seguimiento</option>
            <option value="INFORMATIVA">Informativa</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Lectura
          <select value={lectura} onChange={e => { setLectura(e.target.value); setPagina(0); }}
            className="mt-1 w-full rounded-md border border-slate-300 p-2">
            <option value="">Todas</option><option value="false">No leídas</option><option value="true">Leídas</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Desde
          <input type="date" value={desde} onChange={e => { setDesde(e.target.value); setPagina(0); }}
            className="mt-1 w-full rounded-md border border-slate-300 p-2" />
        </label>
        <label className="text-sm font-medium text-slate-700">Hasta
          <input type="date" min={desde || undefined} value={hasta} onChange={e => { setHasta(e.target.value); setPagina(0); }}
            className="mt-1 w-full rounded-md border border-slate-300 p-2" />
        </label>
      </div>
      {isLoading && <p role="status">Cargando notificaciones...</p>}
      {isError && <p role="alert" className="text-red-700">No se pudo cargar la bitácora.</p>}
      {data && <>
        <p className="text-sm text-slate-600">{data.totalElementos} notificaciones</p>
        <ul className="space-y-3">
          {data.contenido.map(item => <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{item.titulo}</p>
                <p className="mt-1 text-sm text-slate-700">{item.mensaje}</p>
                <p className="mt-2 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString('es-CO')} · {item.tipo} · {item.leida ? 'Leída' : 'No leída'}</p>
              </div>
              <div className="flex gap-3 text-sm">
                {!item.leida && <button type="button" disabled={marcarLeida.isPending} onClick={() => marcarLeida.mutate(item.id)}
                  className="font-medium text-blue-700 disabled:opacity-50">Marcar leída</button>}
                {item.rutaEnlace && <Link to={item.rutaEnlace} className="font-medium text-blue-700">Ver recurso</Link>}
              </div>
            </div>
          </li>)}
        </ul>
        {data.contenido.length === 0 && <p className="rounded-xl bg-white p-6 text-sm text-slate-600">No hay notificaciones con estos filtros.</p>}
        <nav aria-label="Paginación de notificaciones" className="flex items-center justify-end gap-3 text-sm">
          <button type="button" disabled={data.primera} onClick={() => setPagina(p => p - 1)} className="disabled:opacity-40">Anterior</button>
          <span>Página {data.pagina + 1} de {Math.max(1, data.totalPaginas)}</span>
          <button type="button" disabled={data.ultima} onClick={() => setPagina(p => p + 1)} className="disabled:opacity-40">Siguiente</button>
        </nav>
      </>}
    </section>
  );
};
