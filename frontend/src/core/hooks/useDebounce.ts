import { useState, useEffect } from 'react';

/**
 * Hook generico para retrasar la actualizacion de un valor hasta que el usuario
 * haya dejado de escribir durante el tiempo especificado (debounce).
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
