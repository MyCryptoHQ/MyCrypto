import { Asset, ExtendedAsset, Network, StoreAsset } from '@types';
import { generateAssetUUID } from '@utils';
import { DEFAULT_ASSET_DECIMAL } from '@config';

export const getAssetByTicker = (assets: Asset[]) => (symbol: string): Asset | undefined => {
  return assets.find((asset) => asset.ticker.toLowerCase() === symbol.toLowerCase());
};

export const getNewDefaultAssetTemplateByNetwork = (assets: Asset[]) => (
  network: Network
): Asset => {
  const baseAssetOfNetwork: Asset | undefined = getAssetByUUID(assets)(network.baseAsset);
  if (!baseAssetOfNetwork) {
    return {
      uuid: generateAssetUUID(network.chainId),
      name: network.name,
      networkId: network.id,
      type: 'base',
      ticker: network.id,
      decimal: DEFAULT_ASSET_DECIMAL
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

export const getAssetByUUID = (assets: ExtendedAsset[]) => (
  uuid: string
): ExtendedAsset | undefined => {
  return assets.find((asset) => asset.uuid === uuid);
};

export const getAssetByContractAndNetwork = (
  contractAddress: string | undefined,
  network: Network | undefined
) => (assets: ExtendedAsset[]): Asset | undefined => {
  if (!network || !contractAddress) {
    return undefined;
  }
  return assets
    .filter((asset) => asset.networkId && asset.contractAddress)
    .filter((asset) => asset.networkId === network.id)
    .find((asset) => asset.contractAddress === contractAddress);
};

export const getTotalByAsset = (assets: StoreAsset[]) =>
  assets.reduce((dict, asset) => {
    const prev = dict[asset.uuid];
    if (prev) {
      dict[asset.uuid] = {
        ...prev,
        balance: prev.balance.add(asset.balance)
      };
    } else {
      dict[asset.uuid] = asset;
    }
    return dict;
  }, {} as { [key: string]: StoreAsset });
