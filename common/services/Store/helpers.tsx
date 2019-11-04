import { bigNumberify } from 'ethers/utils';

import {
  NetworkId,
  INetwork,
  AssetBalanceObject,
  Asset,
  StoreAsset,
  ExtendedAccount,
  StoreAccount
} from 'typeFiles';

const getNetworkById = (targetNetwork: NetworkId, networks: INetwork[]): INetwork => {
  return networks.find(n => n.id === targetNetwork || n.name === targetNetwork) as INetwork;
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
  networks: INetwork[]
): StoreAccount[] => {
  return accounts.map(a => ({
    ...a,
    assets: getAssetsByUuid(a.assets, assets),
    network: getNetworkById(a.networkId, networks)
  }));
};
