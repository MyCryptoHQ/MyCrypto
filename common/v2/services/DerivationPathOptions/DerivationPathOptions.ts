import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { DerivationPathOptions, ExtendedDerivationPathOptions } from './types';

export default class DerivationPathOptionsServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createDerivationPathOptions = (derivationPathOptions: DerivationPathOptions) => {
    this.init();
    // Handle DerivationPathOptions
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newDerivationPathOptionsCache = parsedLocalCache;
    newDerivationPathOptionsCache.derivationPathOptions[uuid] = derivationPathOptions;

    newDerivationPathOptionsCache.allDerivationPathOptions = [
      ...newDerivationPathOptionsCache.allDerivationPathOptions,
      uuid
    ];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newDerivationPathOptionsCache));
  };

  public readDerivationPathOptions = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.derivationPathOptions[uuid];
  };

  public updateDerivationPathOptions = (
    uuid: string,
    derivationPathOptions: DerivationPathOptions
  ) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newDerivationPathOptionsCache = Object.assign(
      {},
      parsedLocalCache.derivationPathOptions[uuid],
      derivationPathOptions
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newDerivationPathOptionsCache));
  };

  public deleteDerivationPathOptions = (uuid: string) => {
    this.init();
    // Handle DerivationPathOptions
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.derivationPathOptions[uuid];
    const newallDerivationPathOptions = parsedLocalCache.allDerivationPathOptions.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allDerivationPathOptions = newallDerivationPathOptions;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAllDerivationPathOptions = (): ExtendedDerivationPathOptions[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedDerivationPathOptions[] = [];
    if (
      parsedLocalCache.allDerivationPathOptions &&
      parsedLocalCache.allDerivationPathOptions.length >= 1
    ) {
      parsedLocalCache.allDerivationPathOptions.map((uuid: string) => {
        out.push({ ...parsedLocalCache.derivationPathOptions[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
