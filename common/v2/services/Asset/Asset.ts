import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { Asset, ExtendedAsset } from './types';

export default class AssetServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createAsset = (asset: Asset) => {
    this.init();
    // Handle Asset
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAssetCache = parsedLocalCache;
    newAssetCache.assets[uuid] = asset;

    newAssetCache.allAssets = [...newAssetCache.allAssets, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newAssetCache));
  };

  public readAsset = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.assets[uuid];
  };

  public updateAsset = (uuid: string, asset: Asset) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAssetCache = Object.assign({}, parsedLocalCache.assets[uuid], asset);

    localStorage.setItem('MyCryptoCache', JSON.stringify(newAssetCache));
  };

  public deleteAsset = (uuid: string) => {
    this.init();
    // Handle Asset
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.assets[uuid];
    const newallAssets = parsedLocalCache.allAssets.filter((obj: string) => obj !== uuid);
    parsedLocalCache.allAssets = newallAssets;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAssets = (): ExtendedAsset[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedAsset[] = [];
    if (parsedLocalCache.allAssets && parsedLocalCache.allAssets.length >= 1) {
      parsedLocalCache.allAssets.map((uuid: string) => {
        out.push({ ...parsedLocalCache.assets[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
