import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  BellOff,
  ShieldAlert,
  ClockAlert,
  CalendarCheck,
  Info,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { notificacionesApi } from '../api/notificacionesApi';
import { NotificacionItem, TipoNotificacion } from '../types/notificacion.types';

function formatTiempoTranscurrido(fechaIso: string): string {
  if (!fechaIso) return '';
  const fecha = new Date(fechaIso);
  const ahora = new Date();
  const diffSegundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

  if (diffSegundos < 60) return 'Hace un momento';
  const diffMinutos = Math.floor(diffSegundos / 60);
  if (diffMinutos < 60) return `Hace ${diffMinutos} min`;
  const diffHoras = Math.floor(diffMinutos / 60);
  if (diffHoras < 24) return `Hace ${diffHoras} h`;
  const diffDias = Math.floor(diffHoras / 24);
  if (diffDias === 1) return 'Ayer';
  if (diffDias < 7) return `Hace ${diffDias} d`;
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

function renderIconoTipo(tipo: TipoNotificacion) {
  switch (tipo) {
    case 'CRITICA':
      return <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />;
    case 'TERMINO_LEGAL':
      return <ClockAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
    case 'SEGUIMIENTO':
      return <CalendarCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />;
    case 'INFORMATIVA':
    default:
      return <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />;
  }
}

export const NotificacionesMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Consulta 1: Conteo ligero de no leídas (Smart Polling cada 30 segundos en segundo plano)
  const { data: conteoData } = useQuery({
    queryKey: ['notificaciones', 'conteo'],
    queryFn: notificacionesApi.obtenerConteoNoLeidas,
    refetchInterval: 30000,
  });

  // Consulta 2: Listado completo (Smart Polling activo ÚNICAMENTE cuando el menú está abierto)
  const { data: notificaciones = [], isLoading } = useQuery({
    queryKey: ['notificaciones', 'ultimas'],
    queryFn: () => notificacionesApi.obtenerUltimas(15),
    enabled: open,
    refetchInterval: open ? 30000 : false,
  });

  // Mutación optimista: Marcar una como leída
  const marcarLeidaMutation = useMutation({
    mutationFn: (id: number) => notificacionesApi.marcarLeida(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['notificaciones'] });
      queryClient.setQueryData(['notificaciones', 'conteo'], (old: { noLeidas: number } | undefined) => ({
        noLeidas: Math.max(0, (old?.noLeidas ?? 1) - 1),
      }));
      queryClient.setQueryData<NotificacionItem[]>(['notificaciones', 'ultimas'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
    },
  });

  // Mutación optimista: Marcar todas como leídas
  const marcarTodasLeidasMutation = useMutation({
    mutationFn: notificacionesApi.marcarTodasLeidas,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notificaciones'] });
      queryClient.setQueryData(['notificaciones', 'conteo'], { noLeidas: 0 });
      queryClient.setQueryData<NotificacionItem[]>(['notificaciones', 'ultimas'], (old = []) =>
        old.map((n) => ({ ...n, leida: true }))
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
    },
  });

  const noLeidas = conteoData?.noLeidas ?? 0;

  const handleItemClick = (item: NotificacionItem) => {
    if (!item.leida) {
      marcarLeidaMutation.mutate(item.id);
    }
    setOpen(false);
    if (item.rutaEnlace) {
      navigate(item.rutaEnlace);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:text-trujillo-navy hover:bg-slate-100 transition-all text-xs flex items-center justify-center cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20"
          title="Notificaciones Institucionales"
          aria-label="Notificaciones Institucionales"
        >
          <Bell className="w-4 h-4" />
          {noLeidas > 0 && (
            <span className="bg-red-600 text-[10px] text-white font-bold h-4 min-w-4 px-1 rounded-full absolute -top-1 -right-1 flex items-center justify-center ring-2 ring-white">
              {noLeidas > 99 ? '99+' : noLeidas}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 shadow-xl border border-slate-200 bg-white rounded-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">Notificaciones</h3>
            {noLeidas > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                {noLeidas} pendiente{noLeidas > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {noLeidas > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                marcarTodasLeidasMutation.mutate();
              }}
              disabled={marcarTodasLeidasMutation.isPending}
              className="text-[11px] font-medium text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {marcarTodasLeidasMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              <span>Marcar todas como leídas</span>
            </button>
          )}
        </div>

        {/* Lista de Notificaciones con accesibilidad por teclado (Radix MenuItem) */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {isLoading && notificaciones.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-xs">Cargando notificaciones...</span>
            </div>
          ) : notificaciones.length === 0 ? (
            <div className="py-8 px-4 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                <BellOff className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">Sin notificaciones pendientes</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                El sistema le avisará oportunamente sobre novedades y términos del debido proceso.
              </p>
            </div>
          ) : (
            notificaciones.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => handleItemClick(item)}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer text-left focus:outline-none rounded-none ${
                  !item.leida
                    ? 'bg-white focus:bg-blue-50/70 border-l-2 border-l-blue-600'
                    : 'bg-slate-50/50 focus:bg-slate-100/70'
                }`}
              >
                <div className="shrink-0">
                  {renderIconoTipo(item.tipo)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs truncate ${
                        !item.leida ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                      }`}
                    >
                      {item.titulo}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {formatTiempoTranscurrido(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.mensaje}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
