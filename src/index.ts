import { useEffect, useReducer } from 'react';
import type { DispatchWithoutAction, Reducer } from 'react';
import type { StoreApi } from 'zustand';

export function useZustand<State, Slice>(
  store: StoreApi<State>,
  selector: (state: State) => Slice,
  areEqual: (a: Slice, b: Slice) => boolean = Object.is,
) {
  const state = store.getState();
  const slice = selector(state);
  const [[sliceFromReducer, storeFromReducer], rerender] = useReducer<
    Reducer<readonly [Slice, StoreApi<State>, State], boolean | undefined>,
    undefined
  >(
    (prev, fromSelf?: boolean) => {
      if (fromSelf) {
        return [slice, store, state];
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
    () => [slice, store, state],
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
