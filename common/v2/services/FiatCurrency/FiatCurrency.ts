import * as utils from 'v2/libs';
import { initializeCache } from 'v2/services/LocalCache';
import { FiatCurrency, ExtendedFiatCurrency } from './types';

export default class FiatCurrencyServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createFiatCurrency = (FiatCurrencies: FiatCurrency) => {
    this.init();
    // Handle FiatCurrency
    const uuid = utils.generateUUID();

    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    const newFiatCurrencyCache = parsedLocalCache;
    newFiatCurrencyCache.FiatCurrencys[uuid] = FiatCurrencies;

    newFiatCurrencyCache.allFiatCurrencies = [...newFiatCurrencyCache.allFiatCurrencies, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newFiatCurrencyCache));
  };

  public readFiatCurrency = (uuid: string) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    return parsedLocalCache.FiatCurrencys[uuid];
  };

  public updateFiatCurrency = (uuid: string, FiatCurrencies: FiatCurrency) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    const newFiatCurrencyCache = Object.assign(
      {},
      parsedLocalCache.FiatCurrencys[uuid],
      FiatCurrencies
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newFiatCurrencyCache));
  };

  public deleteFiatCurrency = (uuid: string) => {
    this.init();
    // Handle FiatCurrency
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    delete parsedLocalCache.FiatCurrencys[uuid];
    const newallFiatCurrencies = parsedLocalCache.allFiatCurrencies.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allFiatCurrencies = newallFiatCurrencies;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readFiatCurrencys = (): ExtendedFiatCurrency[] => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '[]';
    let parsedLocalCache: any;
    let out: ExtendedFiatCurrency[] = [];
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    if (parsedLocalCache.allFiatCurrencies && parsedLocalCache.allFiatCurrencies.length >= 1) {
      parsedLocalCache.allFiatCurrencies.map((uuid: string) => {
        out.push({ ...parsedLocalCache.FiatCurrencys[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
