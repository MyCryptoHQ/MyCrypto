import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { NetworkOptions, ExtendedNetworkOptions } from './types';

export default class NetworkOptionsServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createNetworkOptions = (networkOptions: NetworkOptions) => {
    this.init();
    // Handle NetworkOptions
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newNetworkOptionsCache = parsedLocalCache;
    newNetworkOptionsCache.networkOptions[uuid] = networkOptions;

    newNetworkOptionsCache.allNetworkOptions = [...newNetworkOptionsCache.allNetworkOptions, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newNetworkOptionsCache));
  };

  public readNetworkOptions = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.networkOptions[uuid];
  };

  public updateNetworkOptions = (uuid: string, networkOptions: NetworkOptions) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newNetworkOptionsCache = Object.assign(
      {},
      parsedLocalCache.networkOptions[uuid],
      networkOptions
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newNetworkOptionsCache));
  };

  public deleteNetworkOptions = (uuid: string) => {
    this.init();
    // Handle NetworkOptions
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.networkOptions[uuid];
    const newallNetworkOptions = parsedLocalCache.allNetworkOptions.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allNetworkOptions = newallNetworkOptions;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAllNetworkOptions = (): ExtendedNetworkOptions[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedNetworkOptions[] = [];
    if (parsedLocalCache.allNetworkOptions && parsedLocalCache.allNetworkOptions.length >= 1) {
      parsedLocalCache.allNetworkOptions.map((uuid: string) => {
        out.push({ ...parsedLocalCache.networkOptions[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
