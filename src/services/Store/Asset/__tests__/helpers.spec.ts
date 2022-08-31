import { fStoreAssets } from '@fixtures';

import { getTotalByAsset } from '../helpers';

describe('getTotalByAsset()', () => {
  it('returns a list of unique assets', () => {
    const totals = getTotalByAsset([...fStoreAssets, ...fStoreAssets]);
    expect(Object.keys(totals)).toHaveLength(fStoreAssets.length);
  });
  it('sums the balances of each asset', () => {
    const totals = getTotalByAsset([...fStoreAssets, ...fStoreAssets]);
    const targetId = '01f2d4ec-c263-6ba8-de38-01d66c86f309';
    const targetAsset = fStoreAssets.find((a) => a.uuid === targetId);
    expect(totals[targetId].balance.toString()).toEqual(targetAsset!.balance.mul('2').toString());
  });
});
