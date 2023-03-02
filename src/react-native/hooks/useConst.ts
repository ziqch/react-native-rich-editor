import React from 'react';
type InitFn<T> = () => T;
export function useConst<T extends any>(init: T | InitFn<T>): T {
  const ref = React.useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = typeof init === 'function' ? (init as InitFn<T>)() : init;
  }

  return ref.current as T;
}
