import { sharedCopy } from './shared-copy';

describe('sharedCopy', () => {
  it('should work', () => {
    expect(sharedCopy()).toEqual('shared-copy');
  });
});
