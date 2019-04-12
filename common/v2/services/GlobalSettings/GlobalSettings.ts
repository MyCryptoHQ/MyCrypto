import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { GlobalSettings } from './types';

export default class GlobalSettingsServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public updateGlobalSettings = (newGlobalSettings: GlobalSettings) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newLocalCache = parsedLocalCache;
    newLocalCache.globalSettings = newGlobalSettings;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newLocalCache));
  };

  public readGlobalSettings = (): GlobalSettings => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    return parsedLocalCache.globalSettings;
  };

  public readCache = () => {
    this.init();
    const localCache: string = localStorage.getItem('MyCryptoCache') || '[]';
    return localCache;
  };

  public importCache = (importedCache: string) => {
    this.init();
    localStorage.setItem('MyCryptoCache', importedCache);
  }
}
