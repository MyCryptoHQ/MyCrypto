import { fAccounts, fBalances, fSettings, fStoreAssets } from '@fixtures';
import { Asset, StoreAsset, TUuid } from '@types';

import { buildBalances, buildTotalFiatValue } from './buildBalanceDisplays';

const accounts = [{ ...fAccounts[0], assets: fStoreAssets }];
const getAssetRate = (_: Asset) => 1;
const getAssetChange = (_: Asset) => 10.5;
const filterTrue = (_: TUuid[]) => (__: StoreAsset) => true;
const filterFalse = (_: TUuid[]) => (__: StoreAsset) => false;

describe('buildBalances', () => {
  it('builds balances', () => {
    const expected = fBalances;
    const actual = buildBalances(accounts, fSettings, getAssetRate, getAssetChange, filterTrue);
    expect(actual).toStrictEqual(expected);
  });
});

describe('buildTotalFiatValue', () => {
  it('builds total fiat values', () => {
    const balances = buildBalances(accounts, fSettings, getAssetRate, getAssetChange, filterFalse);
    const actual = buildTotalFiatValue(balances);
    expect(actual).toBe('0');
  });
});
