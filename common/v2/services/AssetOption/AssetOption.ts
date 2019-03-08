import * as utils from 'v2/libs';
import { initializeCache } from 'v2/services/LocalCache';
import { AssetOption, ExtendedAssetOption } from './types';

export default class AssetOptionserviceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createAssetOption = (AssetOptions: AssetOption) => {
    this.init();
    // Handle AssetOptions
    const uuid = utils.generateUUID();

    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    const newAssetOptionsCache = parsedLocalCache;
    newAssetOptionsCache.AssetOptions[uuid] = AssetOptions;

    newAssetOptionsCache.allAssetOptions = [...newAssetOptionsCache.allAssetOptions, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newAssetOptionsCache));
  };

  public readAssetOption = (uuid: string) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    return parsedLocalCache.AssetOptions[uuid];
  };

  public updateAssetOption = (uuid: string, AssetOptions: AssetOption) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    const newAssetOptionsCache = Object.assign(
      {},
      parsedLocalCache.AssetOptions[uuid],
      AssetOptions
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newAssetOptionsCache));
  };

  public deleteAssetOption = (uuid: string) => {
    this.init();
    // Handle AssetOptions
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    delete parsedLocalCache.AssetOptions[uuid];
    const newallAssetOptions = parsedLocalCache.allAssetOptions.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allAssetOptions = newallAssetOptions;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAssetOptions = (): ExtendedAssetOption[] => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '[]';
    let parsedLocalCache: any;
    let out: ExtendedAssetOption[] = [];
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    if (parsedLocalCache.allAssetOptions && parsedLocalCache.allAssetOptions.length >= 1) {
      parsedLocalCache.allAssetOptions.map((uuid: string) => {
        out.push({ ...parsedLocalCache.AssetOptions[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
