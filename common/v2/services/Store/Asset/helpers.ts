import { getCache } from '../LocalCache';
import { Asset, Network, StoreAsset } from 'v2/types';
import { generateUUID } from 'v2/utils';

export const getAllAssets = () => {
  return Object.values(getCache().assets);
};

export const getAssetByTicker = (symbol: string): Asset | undefined => {
  const assets: Asset[] = getAllAssets();
  return assets.find(asset => asset.ticker.toLowerCase() === symbol.toLowerCase());
};

export const getNewDefaultAssetTemplateByNetwork = (network: Network): Asset => {
  const baseAssetOfNetwork: Asset | undefined = getAssetByUUID(network.baseAsset);
  if (!baseAssetOfNetwork) {
    return {
      uuid: generateUUID(),
      name: network.name,
      networkId: network.id,
      type: 'base',
      ticker: network.id,
      decimal: 18
    };
  } else {
    return {
      uuid: baseAssetOfNetwork.uuid,
      name: baseAssetOfNetwork.name,
      networkId: baseAssetOfNetwork.networkId,
      type: 'base',
      ticker: baseAssetOfNetwork.ticker,
      decimal: baseAssetOfNetwork.decimal
    };
  }
};

export const getAssetByName = (name: string): Asset | undefined => {
  const allAssets = getAllAssets();
  return allAssets.find(asset => asset.name === name);
};

export const getAssetByUUID = (uuid: string): Asset | undefined => {
  const allAssets = getAllAssets();
  return allAssets.find(asset => asset.uuid === uuid);
};

export const getAssetByContractAndNetwork = (
  contractAddress: string | undefined,
  network: Network | undefined
): Asset | undefined => {
  if (!network || !contractAddress) {
    return undefined;
  }
  const allAssets = getAllAssets();
  return allAssets
    .filter(asset => asset.networkId && asset.contractAddress)
    .filter(asset => asset.networkId === network.id)
    .find(asset => asset.contractAddress === contractAddress);
};

export const getTotalByAsset = (assets: StoreAsset[]) =>
  assets.reduce(
    (dict, asset) => {
      const prev = dict[asset.name];
      if (prev) {
        dict[asset.name] = {
          ...prev,
          balance: prev.balance.add(asset.balance)
        };
      } else {
        dict[asset.name] = asset;
      }
      return dict;
    },
    {} as { [key: string]: StoreAsset }
  );
