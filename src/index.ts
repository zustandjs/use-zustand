import { useEffect, useReducer } from 'react';
import type { DispatchWithoutAction } from 'react';
import type { StoreApi } from 'zustand';

export function useZustand<State, Slice>(
  store: StoreApi<State>,
  selector: (state: State) => Slice,
  areEqual: (a: Slice, b: Slice) => boolean = Object.is,
) {
  const state = store.getState();
  const [[sliceFromReducer, storeFromReducer], rerender] = useReducer<
    readonly [Slice, StoreApi<State>, State],
    undefined,
    [readonly [Slice, StoreApi<State>, State] | undefined]
  >(
    (prev, fromSelf) => {
      if (fromSelf) {
        return fromSelf;
      }
      const nextState = store.getState();
      if (Object.is(prev[2], nextState) && prev[1] === store) {
        return prev;
      }
      const nextSlice = selector(nextState);
      if (areEqual(prev[0], nextSlice) && prev[1] === store) {
        return prev;
      }
      return [nextSlice, store, nextState];
    },
    undefined,
    () => [selector(state), store, state],
  );
  useEffect(() => {
    const unsubscribe = store.subscribe(() =>
      (rerender as DispatchWithoutAction)(),
    );
    (rerender as DispatchWithoutAction)();
    return unsubscribe;
  }, [store]);
  if (storeFromReducer !== store) {
    const slice = selector(state);
    rerender([slice, store, state]);
    return slice;
  }
  return sliceFromReducer;
}
