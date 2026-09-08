import { useEffect } from 'react';

/**
 * Hook para bloquear el scroll tanto de `document.body` como de los contenedores
 * internos de layout cuando un modal o diálogo emergente está abierto.
 * Resuelve de forma definitiva el problema de fugas de scroll en layouts complejos.
 */
let activeLocksCount = 0;
let originalBodyOverflow = '';

export function useLockBodyScroll(isLocked: boolean = true): void {
  useEffect(() => {
    if (!isLocked) return;

    if (activeLocksCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    }
    activeLocksCount++;

    const scrollContainers = document.querySelectorAll<HTMLElement>(
      '[data-scroll-container], .layout-content-scroll, #root div.overflow-y-auto'
    );
    const originalContainerStyles: Array<{ el: HTMLElement; overflowY: string }> = [];

    scrollContainers.forEach((el) => {
      originalContainerStyles.push({ el, overflowY: el.style.overflowY });
      el.style.overflowY = 'hidden';
    });

    return () => {
      activeLocksCount = Math.max(0, activeLocksCount - 1);
      if (activeLocksCount === 0) {
        document.body.style.removeProperty('overflow');
        document.body.classList.remove('modal-open');
      }
      originalContainerStyles.forEach(({ el, overflowY }) => {
        if (overflowY) {
          el.style.overflowY = overflowY;
        } else {
          el.style.removeProperty('overflow-y');
        }
      });
    };
  }, [isLocked]);
}
