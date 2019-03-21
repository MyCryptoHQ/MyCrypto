import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { ContractOptions, ExtendedContractOptions } from './types';

export default class ContractOptionsServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createContractOptions = (contractOptions: ContractOptions) => {
    this.init();
    // Handle ContractOptions
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newContractOptionsCache = parsedLocalCache;
    newContractOptionsCache.contractOptions[uuid] = contractOptions;

    newContractOptionsCache.allContractOptions = [
      ...newContractOptionsCache.allContractOptions,
      uuid
    ];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newContractOptionsCache));
  };

  public readContractOptions = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.contractOptions[uuid];
  };

  public updateContractOptions = (uuid: string, contractOptions: ContractOptions) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newContractOptionsCache = Object.assign(
      {},
      parsedLocalCache.contractOptions[uuid],
      contractOptions
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newContractOptionsCache));
  };

  public deleteContractOptions = (uuid: string) => {
    this.init();
    // Handle ContractOptions
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.contractOptions[uuid];
    const newallContractOptions = parsedLocalCache.allContractOptions.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allContractOptions = newallContractOptions;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAllContractOptions = (): ExtendedContractOptions[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedContractOptions[] = [];
    if (parsedLocalCache.allContractOptions && parsedLocalCache.allContractOptions.length >= 1) {
      parsedLocalCache.allContractOptions.map((uuid: string) => {
        out.push({ ...parsedLocalCache.contractOptions[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
