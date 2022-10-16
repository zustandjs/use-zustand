import { useZustand } from '../src/index';

describe('basic spec', () => {
  it('should export functions', () => {
    expect(useZustand).toBeDefined();
  });
});
