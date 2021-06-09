import { fAccounts, fBalances, fSettings, fStoreAssets } from '@fixtures';
import { getTotalByAsset } from '@services/Store/Asset/helpers';
import { Asset, StoreAccount, StoreAsset, TUuid } from '@types';

import { buildBalances, buildTotalFiatValue } from './buildBalanceDisplays';

const totals = (_: StoreAccount[]) =>
  Object.values(getTotalByAsset([...fStoreAssets, ...fStoreAssets]));
const getAssetRate = (_: Asset) => 1;
const filterTrue = (_: TUuid[]) => (__: StoreAsset) => true;
const filterFalse = (_: TUuid[]) => (__: StoreAsset) => false;

describe('buildBalances', () => {
  it('builds balances', () => {
    const expected = fBalances;
    const actual = buildBalances(totals, fAccounts, fSettings, getAssetRate, filterTrue);
    expect(actual).toStrictEqual(expected);
  });
});

describe('buildTotalFiatValue', () => {
  it('builds total fiat values', () => {
    const balances = buildBalances(totals, fAccounts, fSettings, getAssetRate, filterFalse);
    const actual = buildTotalFiatValue(balances);
    expect(actual).toBe('0');
  });
});
