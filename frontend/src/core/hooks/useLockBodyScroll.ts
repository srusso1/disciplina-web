import { useEffect } from 'react';

/**
 * Hook para bloquear el scroll tanto de `document.body` como de los contenedores
 * internos de layout cuando un modal o diálogo emergente está abierto.
 * Resuelve de forma definitiva el problema de fugas de scroll en layouts complejos.
 */
export function useLockBodyScroll(isLocked: boolean = true): void {
  useEffect(() => {
    if (!isLocked) return;

    // 1. Guardar estado original y bloquear el elemento body
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    // 2. Bloquear contenedores internos de scroll en los layouts (OrientadorLayout / RectorLayout)
    const scrollContainers = document.querySelectorAll<HTMLElement>(
      '[data-scroll-container], .layout-content-scroll, #root div.overflow-y-auto'
    );
    const originalContainerStyles: Array<{ el: HTMLElement; overflowY: string }> = [];

    scrollContainers.forEach((el) => {
      originalContainerStyles.push({ el, overflowY: el.style.overflowY });
      el.style.overflowY = 'hidden';
    });

    // 3. Restaurar estilos originales al desmontar o cerrar
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.classList.remove('modal-open');
      originalContainerStyles.forEach(({ el, overflowY }) => {
        el.style.overflowY = overflowY;
      });
    };
  }, [isLocked]);
}
