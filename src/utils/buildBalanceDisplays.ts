import { StoreAsset, StoreAccount, ISettings, Balance, Asset, TUuid, BalanceAccount } from '@types';
import { translateRaw } from '@translations';

import { weiToFloat, convertToFiatFromAsset } from './convert';

export const buildBalances = (
  totals: (selectedAccounts?: StoreAccount[]) => StoreAsset[],
  accounts: StoreAccount[],
  settings: ISettings,
  getAssetRate: (asset: Asset) => number | undefined,
  filter: (excludedAssetUuids: TUuid[]) => (asset: StoreAsset) => boolean
): Balance[] =>
  totals(accounts)
    .filter(filter(settings.excludedAssets))
    .map((asset: StoreAsset) => {
      const exchangeRate = getAssetRate(asset);
      return {
        id: `${asset.name}-${asset.ticker}`,
        name: asset.name || translateRaw('WALLET_BREAKDOWN_UNKNOWN'),
        ticker: asset.ticker,
        uuid: asset.uuid,
        amount: weiToFloat(asset.balance, asset.decimal),
        fiatValue: convertToFiatFromAsset(asset, exchangeRate),
        exchangeRate,
        accounts: accounts.reduce((acc, currAccount) => {
          const matchingAccAssets = currAccount.assets.filter(
            (accAsset) => accAsset.uuid === asset.uuid
          );
          if (matchingAccAssets.length) {
            return [
              ...acc,
              ...matchingAccAssets.map((accAsset) => ({
                address: currAccount.address,
                ticker: accAsset.ticker,
                amount: weiToFloat(accAsset.balance, accAsset.decimal),
                fiatValue: convertToFiatFromAsset(accAsset, exchangeRate),
                label: currAccount.label
              }))
            ];
          }
          return acc;
        }, [] as BalanceAccount[])
      };
    })
    .sort((a, b) => b.fiatValue - a.fiatValue);

export const buildTotalFiatValue = (balances: Balance[]) =>
  balances.reduce((sum, asset) => {
    return sum + asset.fiatValue;
  }, 0);
