import { getCache } from 'v2/services/LocalCache';
import { Asset } from 'v2/services/Asset/types';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';
import { getAssetByTicker } from '../assetOptions';
import { AssetOption } from 'v2/services/AssetOption/types';

export const getAllAssets = () => {
  return Object.values(getCache().assets);
};

export const getAssetBySymbol = (symbol: string): Asset | undefined => {
  const assets: Asset[] = getAllAssets();
  return assets.find(asset => asset.symbol.toLowerCase() === symbol.toLowerCase());
};

export const getNewDefaultAssetTemplateByNetwork = (network: NetworkOptions): Asset => {
  const baseAssetOfNetwork: AssetOption | undefined = getAssetByTicker(network.unit);
  if (!baseAssetOfNetwork) {
    return {
      option: network.name,
      amount: '0',
      network: network.unit,
      type: 'base',
      symbol: network.unit,
      decimal: 18
    };
  } else {
    return {
      option: baseAssetOfNetwork.name,
      amount: '0',
      network: baseAssetOfNetwork.network,
      type: 'base',
      symbol: baseAssetOfNetwork.ticker,
      decimal: baseAssetOfNetwork.decimal
    };
  }
};

export const getAllAssetsOptions = (): AssetOption[] => {
  return Object.values(getCache().assetOptions);
};

export const getAssetOptionByName = (name: string): AssetOption | undefined => {
  const allAssets = getAllAssetsOptions();
  return allAssets.find(asset => asset.ticker === name);
};
