import { StoreAccount, Asset, TUuid, StoreAsset } from '@types';
import { fAccounts, fStoreAssets, fSettings } from '@fixtures';
import { getTotalByAsset } from '@services/Store/Asset/helpers';
import { buildBalances, buildTotalFiatValue } from './buildBalanceDisplays';

const totals = (_: StoreAccount[]) =>
  Object.values(getTotalByAsset([...fStoreAssets, ...fStoreAssets]));
const getAssetRate = (_: Asset) => 1;
const filterTrue = (_: TUuid[]) => (__: StoreAsset) => true;
const filterFalse = (_: TUuid[]) => (__: StoreAsset) => false;

describe('buildBalances', () => {
  it('builds balances', () => {
    const balances = buildBalances(totals, fAccounts, fSettings, getAssetRate, filterTrue);
    expect(balances.length).toBe(4);
  });
});

describe('buildTotalFiatValue', () => {
  it('builds total fiat values ', () => {
    const balances = buildBalances(totals, fAccounts, fSettings, getAssetRate, filterFalse);
    const totalFiatValue = buildTotalFiatValue(balances);
    expect(totalFiatValue).toBe(0);
  });
});
