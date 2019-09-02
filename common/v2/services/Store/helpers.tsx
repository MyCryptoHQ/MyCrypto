import { bigNumberify } from 'ethers/utils';

import {
  NetworkId,
  Network,
  AssetBalanceObject,
  Asset,
  StoreAsset,
  ExtendedAccount,
  StoreAccount
} from 'v2/types';

const getNetworkById = (targetNetwork: NetworkId, networks: Network[]): Network => {
  return networks.find(n => n.id === targetNetwork || n.name === targetNetwork) as Network;
};

const getAssetsByUuid = (accountAssets: AssetBalanceObject[], assets: Asset[]): StoreAsset[] =>
  accountAssets
    .map(asset => {
      const refAsset = assets.find(a => a.uuid === asset.uuid)!;
      return {
        ...refAsset,
        ...asset
      };
    })
    .map(asset => ({ ...asset, balance: bigNumberify(asset.balance), mtime: Date.now() }));

export const getStoreAccounts = (
  accounts: ExtendedAccount[],
  assets: Asset[],
  networks: Network[]
): StoreAccount[] => {
  return accounts.map(a => ({
    ...a,
    assets: getAssetsByUuid(a.assets, assets),
    network: getNetworkById(a.networkId, networks)
  }));
};
