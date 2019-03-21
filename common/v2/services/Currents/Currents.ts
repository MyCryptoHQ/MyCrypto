import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { Currents } from './types';

export default class CurrentsServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public updateCurrents = (newCurrents: Currents) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newLocalCache = parsedLocalCache;
    newLocalCache.currents = newCurrents;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newLocalCache));
  };

  public readCurrents = (): Currents => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');

    return parsedLocalCache.currents;
  };
}
