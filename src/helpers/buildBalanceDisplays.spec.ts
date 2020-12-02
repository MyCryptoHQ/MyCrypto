import { fAccounts, fSettings, fStoreAssets } from '@fixtures';
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
    const expected = [
      {
        accounts: [],
        amount: '4.2e-17',
        exchangeRate: '1',
        fiatValue: '4.2e-17',
        id: 'RopstenETH-RopstenETH',
        name: 'RopstenETH',
        ticker: 'RopstenETH',
        uuid: '01f2d4ec-c263-6ba8-de38-01d66c86f309'
      },
      {
        accounts: [],
        amount: '2e-18',
        exchangeRate: '1',
        fiatValue: '2e-18',
        id: 'WrappedETH-WETH',
        name: 'WrappedETH',
        ticker: 'WETH',
        uuid: '10e14757-78bb-4bb2-a17a-8333830f6698'
      },
      {
        accounts: [],
        amount: '2e-18',
        exchangeRate: '1',
        fiatValue: '2e-18',
        id: 'Ether-ETH',
        name: 'Ether',
        ticker: 'ETH',
        uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702'
      },
      {
        accounts: [],
        amount: '2e-18',
        exchangeRate: '1',
        fiatValue: '2e-18',
        id: 'GoerliETH-GoerliETH',
        name: 'GoerliETH',
        ticker: 'GoerliETH',
        uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a'
      }
    ];
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
