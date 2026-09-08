import { toast } from 'sonner';

/**
 * Resalta temporalmente un elemento de formulario en rojo y realiza scroll suave hacia él.
 */
export const highlightAndScrollToField = (
  target: string | HTMLElement | null | undefined,
  durationMs: number = 3000
) => {
  if (!target) return;
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;

  // Scroll suave centrado
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Foco accesible si es interactivo
  if (typeof el.focus === 'function') {
    try {
      el.focus({ preventScroll: true });
    } catch {}
  }

  // Clases visuales de resaltado temporal
  const highlightClasses = [
    'ring-2',
    'ring-rose-500',
    '!border-rose-500',
    'bg-rose-50/50',
    'transition-all',
    'duration-300'
  ];

  el.classList.add(...highlightClasses);
  setTimeout(() => {
    el.classList.remove(...highlightClasses);
  }, durationMs);
};

/**
 * Sistema Unificado de Notificaciones Institucionales (Toasts)
 * Envuelve `sonner` con diseño sobrio y tipografía institucional.
 */
export const notify = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
      duration: 4500,
    });
  },

  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
      duration: 6500,
    });
  },

  warning: (title: string, description?: string) => {
    toast.warning(title, {
      description,
      duration: 5000,
    });
  },

  info: (title: string, description?: string) => {
    toast.info(title, {
      description,
      duration: 4000,
    });
  },

  /**
   * Notifica un error de validación en formulario y dirige el foco y scroll
   * al campo correspondiente, marcándolo temporalmente en rojo.
   */
  formError: (
    title: string,
    message: string,
    targetSelectorOrElement?: string | HTMLElement | null
  ) => {
    toast.error(title, {
      description: message,
      duration: 6500,
    });
    if (targetSelectorOrElement) {
      highlightAndScrollToField(targetSelectorOrElement);
    }
  },
};

export { toast };
