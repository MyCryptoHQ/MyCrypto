import * as R from 'ramda';
import {
  LocalStorage,
  Asset,
  TUuid,
  IAccount,
  TTicker,
  NetworkId,
  AssetBalanceObject
} from 'v2/types';

// Migration from v0.0.1 to v1.0.0
// We can expect the previous values to be valid, so we only need to address
// the difference.

export function migrate(prev: LocalStorage, curr: LocalStorage) {
  // Update asset uuids
  const getAssetByTickerAndNetworkID = (
    assets: Record<TUuid, Asset>,
    networkId: NetworkId,
    ticker: TTicker
  ) =>
    R.find(
      R.allPass([R.propEq('ticker', ticker), R.propEq('networkId', networkId)]),
      R.values(assets)
    );

  const updateAccountAssetsUUID = ({ networkId, assets = [], ...rest }: IAccount) => {
    const getTicker = (uuid: TUuid) => {
      //@ts-ignore
      const asset = prev.assets[uuid] || {};
      return asset && asset.ticker ? asset.ticker : undefined;
    };
    const getUUID = (ticker: TTicker) => {
      const asset = R.curry(getAssetByTickerAndNetworkID)(curr.assets)(networkId)(ticker);
      //@ts-ignore
      return R.prop('uuid', asset);
    };

    const updateUUID = (assetBalance: AssetBalanceObject) => ({
      ...assetBalance,
      uuid: getUUID(getTicker(assetBalance.uuid))
    });

    return {
      ...rest,
      networkId,
      assets: R.map(updateUUID, assets)
    };
  };

  // Merge accounts
  const accounts = Object.assign(
    {},
    curr.accounts,
    R.map(updateAccountAssetsUUID, (prev.accounts as R.Functor<IAccount>) || {})
  );

  // Add labels to address book
  const { dashboardAccounts = [] } = prev.settings;
  //@ts-ignore
  const accountUUIDs = R.map(R.prop('uuid'), R.values(accounts));

  const settings = {
    ...curr.settings,
    dashboardAccounts: R.uniq([...accountUUIDs, ...dashboardAccounts]).filter(Boolean)
  };

  return Object.assign({}, curr, { accounts, settings });
}
