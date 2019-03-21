import * as utils from 'v2/libs';
import { initializeCache } from 'v2/services/LocalCache';
import { AssetOption, ExtendedAssetOption } from './types';
import { LocalCache } from '../LocalCache';

export default class AssetOptionserviceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createAssetOption = (AssetOptions: AssetOption) => {
    this.init();
    // Handle AssetOptions
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAssetOptionsCache = parsedLocalCache;
    newAssetOptionsCache.assetOptions[uuid] = AssetOptions;

    newAssetOptionsCache.allAssetOptions = [...newAssetOptionsCache.allAssetOptions, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newAssetOptionsCache));
  };

  public readAssetOption = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.assetOptions[uuid];
  };

  public updateAssetOption = (uuid: string, AssetOptions: AssetOption) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAssetOptionsCache = Object.assign(
      {},
      parsedLocalCache.assetOptions[uuid],
      AssetOptions
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newAssetOptionsCache));
  };

  public deleteAssetOption = (uuid: string) => {
    this.init();
    // Handle AssetOptions
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.assetOptions[uuid];
    const newallAssetOptions = parsedLocalCache.allAssetOptions.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allAssetOptions = newallAssetOptions;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAssetOptions = (): ExtendedAssetOption[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedAssetOption[] = [];
    if (parsedLocalCache.allAssetOptions && parsedLocalCache.allAssetOptions.length >= 1) {
      parsedLocalCache.allAssetOptions.map((uuid: string) => {
        out.push({ ...parsedLocalCache.assetOptions[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
