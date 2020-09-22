import { DEFAULT_ASSET_DECIMAL } from '@config';
import { Asset, ExtendedAsset, Network, StoreAsset, TAddress, TTicker } from '@types';
import { generateAssetUUID, isSameAddress } from '@utils';

export const getAssetByTicker = (assets: Asset[]) => (ticker: TTicker): Asset | undefined => {
  return assets.find((asset) => asset.ticker.toLowerCase() === ticker.toLowerCase());
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
      ticker: assets.find((a) => a.uuid === network.baseAsset)!.ticker, // @todo: determine if baseAsset is really guaranteed to exist?
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
    .filter((asset) => asset.networkId && asset.contractAddress && asset.networkId === network.id)
    .find((asset) =>
      asset.contractAddress
        ? isSameAddress(asset.contractAddress as TAddress, contractAddress as TAddress)
        : false
    );
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
