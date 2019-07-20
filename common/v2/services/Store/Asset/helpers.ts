import { getCache } from '../LocalCache';
import { Asset, Network } from 'v2/types';
import { generateUUID } from 'v2/utils';

export const getAllAssets = () => {
  return Object.values(getCache().assets);
};

export const getAssetByTicker = (symbol: string): Asset | undefined => {
  const assets: Asset[] = getAllAssets();
  return assets.find(asset => asset.ticker.toLowerCase() === symbol.toLowerCase());
};

export const getNewDefaultAssetTemplateByNetwork = (network: Network): Asset => {
  const baseAssetOfNetwork: Asset | undefined = getAssetByTicker(network.id);
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
