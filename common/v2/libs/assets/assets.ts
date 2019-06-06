import { getCache } from 'v2/services/LocalCache';
import { Asset } from 'v2/services/Asset/types';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';
import { generateUUID } from '../cache';

export const getAllAssets = () => {
  return Object.values(getCache().assets);
};

export const getAssetByTicker = (symbol: string): Asset | undefined => {
  const assets: Asset[] = getAllAssets();
  return assets.find(asset => asset.ticker.toLowerCase() === symbol.toLowerCase());
};

export const getNewDefaultAssetTemplateByNetwork = (network: NetworkOptions): Asset => {
  const baseAssetOfNetwork: Asset | undefined = getAssetByTicker(network.unit);
  if (!baseAssetOfNetwork) {
    return {
      uuid: generateUUID(),
      name: network.name,
      networkId: network.unit,
      type: 'base',
      ticker: network.unit,
      decimal: 18
    };
  } else {
    return {
      uuid: generateUUID(),
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
