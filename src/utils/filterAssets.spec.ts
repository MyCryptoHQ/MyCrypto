import { DEFAULT_NETWORK } from '@config';
import { fAssets } from '@fixtures';

import { filterValidAssets } from './filterAssets';

describe('filterValidAssets', () => {
  it('filters assets on the same network of type erc20 and base', () => {
    const filtered = filterValidAssets(fAssets, DEFAULT_NETWORK);
    expect(filtered).toHaveLength(6);
  });
});
