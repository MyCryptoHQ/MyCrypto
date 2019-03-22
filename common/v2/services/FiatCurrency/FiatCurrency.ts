import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
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

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newFiatCurrencyCache = parsedLocalCache;
    newFiatCurrencyCache.fiatCurrencies[uuid] = FiatCurrencies;

    newFiatCurrencyCache.allFiatCurrencies = [...newFiatCurrencyCache.allFiatCurrencies, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newFiatCurrencyCache));
  };

  public readFiatCurrency = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.fiatCurrencies[uuid];
  };

  public updateFiatCurrency = (uuid: string, FiatCurrencies: FiatCurrency) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newFiatCurrencyCache = Object.assign(
      {},
      parsedLocalCache.fiatCurrencies[uuid],
      FiatCurrencies
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newFiatCurrencyCache));
  };

  public deleteFiatCurrency = (uuid: string) => {
    this.init();
    // Handle FiatCurrency
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.fiatCurrencies[uuid];
    const newallFiatCurrencies = parsedLocalCache.allFiatCurrencies.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allFiatCurrencies = newallFiatCurrencies;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readFiatCurrencys = (): ExtendedFiatCurrency[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedFiatCurrency[] = [];
    if (parsedLocalCache.allFiatCurrencies && parsedLocalCache.allFiatCurrencies.length >= 1) {
      parsedLocalCache.allFiatCurrencies.map((uuid: string) => {
        out.push({ ...parsedLocalCache.fiatCurrencies[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
