import { expect, test } from 'vitest';
import { useZustand } from 'use-zustand';

test('export functions', () => {
  expect(useZustand).toBeDefined();
});
