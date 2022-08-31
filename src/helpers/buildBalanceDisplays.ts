import BigNumber from 'bignumber.js';

import { calculateTotals } from '@services/Store/helpers';
import { translateRaw } from '@translations';
import { Asset, Balance, BalanceAccount, ISettings, StoreAccount, StoreAsset, TUuid } from '@types';
import { bigify, convertToFiatFromAsset, weiToFloat } from '@utils';

const buildAccountDisplayBalances = (
  accounts: StoreAccount[],
  asset: StoreAsset,
  exchangeRate: number | undefined
): BalanceAccount[] =>
  accounts.reduce((acc, currAccount) => {
    const matchingAccAssets = currAccount.assets.filter((accAsset) => accAsset.uuid === asset.uuid);
    if (matchingAccAssets.length) {
      return [
        ...acc,
        ...matchingAccAssets.map((accAsset) => ({
          address: currAccount.address,
          ticker: accAsset.ticker,
          amount: weiToFloat(accAsset.balance, accAsset.decimal).toString(),
          fiatValue: convertToFiatFromAsset(accAsset, exchangeRate),
          label: currAccount.label
        }))
      ];
    }
    return acc;
  }, []);

const buildBalance = (
  accounts: StoreAccount[],
  getAssetRate: (asset: Asset) => number | undefined,
  getAssetChange: (asset: Asset) => number | undefined
) => (asset: StoreAsset): Balance => {
  const exchangeRate = getAssetRate(asset) ?? 0;
  return {
    id: `${asset.name}-${asset.ticker}`,
    name: asset.name || translateRaw('WALLET_BREAKDOWN_UNKNOWN'),
    ticker: asset.ticker,
    uuid: asset.uuid,
    amount: weiToFloat(asset.balance, asset.decimal).toString(),
    fiatValue: convertToFiatFromAsset(asset, exchangeRate),
    accounts: buildAccountDisplayBalances(accounts, asset, exchangeRate),
    exchangeRate: exchangeRate.toString(),
    change: getAssetChange(asset)
  };
};

export const buildBalances = (
  accounts: StoreAccount[],
  settings: ISettings,
  getAssetRate: (asset: Asset) => number | undefined,
  getAssetChange: (asset: Asset) => number | undefined,
  assetFilter: (excludedAssetUuids: TUuid[]) => (asset: StoreAsset) => boolean
): Balance[] =>
  calculateTotals(accounts)
    .filter(assetFilter(settings.excludedAssets))
    .map(buildBalance(accounts, getAssetRate, getAssetChange))
    .sort((a, b) => bigify(b.fiatValue).comparedTo(a.fiatValue));

export const buildTotalFiatValue = (balances: Balance[]) =>
  balances
    .reduce((sum, asset) => {
      return new BigNumber(asset.fiatValue).plus(sum);
    }, new BigNumber(0))
    .toString();
