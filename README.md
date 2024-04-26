# use-zustand

[![CI](https://img.shields.io/github/actions/workflow/status/zustandjs/use-zustand/ci.yml?branch=main)](https://github.com/zustandjs/use-zustand/actions?query=workflow%3ACI)
[![npm](https://img.shields.io/npm/v/use-zustand)](https://www.npmjs.com/package/use-zustand)
[![size](https://img.shields.io/bundlephobia/minzip/use-zustand)](https://bundlephobia.com/result?p=use-zustand)
[![discord](https://img.shields.io/discord/627656437971288081)](https://discord.gg/MrQdmzd)

Another custom hook to use [Zustand](https://github.com/pmndrs/zustand) vanilla store

## Install

```bash
npm install zustand use-zustand
```

## Usage

```jsx
import { createStore } from 'zustand/vanilla';
import { useZustand } from 'use-zustand';

const countStore = createStore((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

const Counter = () => {
  const count = useZustand(countStore, (state) => state.count);
  const inc = useZustand(countStore, (state) => state.inc);
  return (
    <div>
      {count} <button onClick={inc}>+1</button>
    </div>
  );
};
```

## But, why?

Zustand has `useStore` hook that can be used with vanilla store,
which is identical to `useZustand` in terms of the usage.

```jsx
import { createStore, useStore } from 'zustand';

// `createStore` is the same with:
import { createStore } from 'zustand/vanilla';
```

`useStore` is implemented with `useSyncExternalStore` which is
a recommended way to use "external stores". It solves tearing issues.

However, the "Sync" behavior doesn't work nicely with concurrent rendering.
We can't use `startTransition` as expected.

`useZustand` doesn't use `useSyncExternalStore`,
but only `useReducer` and `useEffect`.
It suffers from tearing, but works better with concurrent rendering.

After all, it's a trade-off.

## Examples

The [examples](examples) folder contains working examples.
You can run one of them with

```bash
PORT=8080 yarn run examples:01_counter
```

and open <http://localhost:8080> in your web browser.

You can also try them in codesandbox.io:
[01](https://codesandbox.io/s/github/zustandjs/use-zustand/tree/main/examples/01_counter)
[02](https://codesandbox.io/s/github/zustandjs/use-zustand/tree/main/examples/02_suspense)
