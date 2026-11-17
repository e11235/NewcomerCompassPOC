import { DestroyRef, inject, Injectable, signal, type Signal } from '@angular/core';

/** CSS media queries as signals. */
@Injectable({ providedIn: 'root' })
export class MediaQuery {
  /** Call from an injection context (a constructor or field initializer). */
  matches(query: string): Signal<boolean> {
    const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query) : null;
    const value = signal(mql?.matches ?? true);
    if (mql) {
      const listener = (e: MediaQueryListEvent) => value.set(e.matches);
      mql.addEventListener('change', listener);
      inject(DestroyRef).onDestroy(() => mql.removeEventListener('change', listener));
    }
    return value.asReadonly();
  }
}
