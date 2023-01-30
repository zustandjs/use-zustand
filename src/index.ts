import { useEffect, useMemo, useReducer } from 'react';
import type { DispatchWithoutAction, Reducer } from 'react';
import type { StoreApi } from 'zustand';

export function useZustand<State, Slice>(
  store: StoreApi<State>,
  selector: (state: State) => Slice,
  areEqual: (a: Slice, b: Slice) => boolean = Object.is,
) {
  const slice = useMemo(() => selector(store.getState()), [store, selector]);
  const [[sliceFromReducer, storeFromReducer], rerender] = useReducer<
    Reducer<readonly [Slice, StoreApi<State>], boolean | undefined>,
    undefined
  >(
    (prev, fromSelf?: boolean) => {
      if (fromSelf) {
        return [slice, store];
      }
      const nextSlice = selector(store.getState());
      if (areEqual(prev[0], nextSlice) && prev[1] === store) {
        return prev;
      }
      return [nextSlice, store];
    },
    undefined,
    () => [slice, store],
  );
  useEffect(() => {
    const unsubscribe = store.subscribe(rerender as DispatchWithoutAction);
    (rerender as DispatchWithoutAction)();
    return unsubscribe;
  }, [store]);
  if (storeFromReducer !== store) {
    rerender(true);
    return slice;
  }
  if (!areEqual(sliceFromReducer, slice)) {
    rerender(true);
  }
  return sliceFromReducer;
}
