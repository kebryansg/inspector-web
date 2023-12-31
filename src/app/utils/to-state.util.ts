import {Observable} from "rxjs";
import {assertInInjectionContext, DestroyRef, inject, Injector, signal, Signal} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

/**
 * The possible status of an observable command
 */
export type Status = 'pending' | 'success' | 'error';

export type State<T> = {
  /** The value (initial or produced by the observable) */
  value: T;
  /** The error, if any, produced by the observable */
  error?: any;
  /** The status of the observable */
  status: Status;
};


/**
 * Converts an observable to a state signal
 * @param source$ The observable emitting the value
 * @param value The initial value
 * @param injector Optional injector context to use to get the `DestroyRef`
 * @returns A read-only signal with the state changes
 * @see State
 */
export function toState<T>(
  source$: Observable<T>,
  value: T,
  injector?: Injector,
): Signal<State<T>> {
  const destroyRef = getDestroyRef();
  const state = signal<State<T>>({ value, status: 'pending' });
  source$.pipe(takeUntilDestroyed(destroyRef)).subscribe({
    next: (value) => state.update((s) => ({ ...s, value, status: 'success' })),
    error: (error) => state.update((s) => ({ ...s, error, status: 'error' })),
  });
  return state.asReadonly();

  /**
   * Gets the `DestroyRef` from the received or current injection context
   * @throws If not receiving or if not running in an injection context
   */
  function getDestroyRef() {
    injector || assertInInjectionContext(toState);
    return injector?.get(DestroyRef) || inject(DestroyRef);
  }
}
