import React from 'react';

import { createStore } from 'zustand/vanilla';
import { useZustand } from 'use-zustand';

const countStore = createStore<{
  count: number;
  inc: () => void;
}>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

const Counter = () => {
  const count = useZustand(countStore, (state) => state.count);
  const inc = useZustand(countStore, (state) => state.inc);
  return (
    <div>
      {count}{' '}
      <button type="button" onClick={inc}>
        +1
      </button>
    </div>
  );
};
const App = () => (
  <div>
    <Counter />
  </div>
);

export default App;
