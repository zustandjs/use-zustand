import { useEffect, useReducer } from 'react';
import type { ReducerWithoutAction } from 'react';
import type { StoreApi } from 'zustand';

export function useZustand<State, Slice>(
  store: StoreApi<State>,
  selector: (state: State) => Slice,
  areEqual: (a: Slice, b: Slice) => boolean = Object.is,
) {
  const getSlice = () => selector(store.getState());
  const [[sliceFromReducer, storeFromReducer], rerender] = useReducer<
    ReducerWithoutAction<readonly [Slice, StoreApi<State>]>,
    undefined
  >(
    (prev) => {
      const nextSlice = getSlice();
      if (areEqual(prev[0], nextSlice) && prev[1] === store) {
        return prev;
      }
      return [nextSlice, store];
    },
    undefined,
    () => [getSlice(), store],
  );
  useEffect(() => {
    const unsubscribe = store.subscribe(rerender);
    rerender();
    return unsubscribe;
  }, [store]);
  let slice = sliceFromReducer;
  if (storeFromReducer !== store) {
    rerender();
    slice = getSlice();
  }
  return slice;
}
