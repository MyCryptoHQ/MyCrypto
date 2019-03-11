import * as utils from 'v2/libs';
import { initializeCache } from 'v2/services/LocalCache';
import { AddressMetadata, ExtendedAddressMetadata } from './types';

export default class AddressMetadataServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createAddressMetadata = (AddressMetadatas: AddressMetadata) => {
    this.init();
    // Handle AddressMetadata
    const uuid = utils.generateUUID();

    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    const newAddressMetadataCache = parsedLocalCache;
    newAddressMetadataCache.addressMetadata[uuid] = AddressMetadatas;

    newAddressMetadataCache.allAddressMetadata = [
      ...newAddressMetadataCache.allAddressMetadata,
      uuid
    ];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newAddressMetadataCache));
  };

  public readAddressMetadata = (uuid: string) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    return parsedLocalCache.addressMetadata[uuid];
  };

  public updateAddressMetadata = (uuid: string, AddressMetadatas: AddressMetadata) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    const newAddressMetadataCache = Object.assign(
      {},
      parsedLocalCache.addressMetadata[uuid],
      AddressMetadatas
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newAddressMetadataCache));
  };

  public deleteAddressMetadata = (uuid: string) => {
    this.init();
    // Handle AddressMetadata
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    delete parsedLocalCache.addressMetadata[uuid];
    const newallAddressMetadata = parsedLocalCache.allAddressMetadata.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allAddressMetadata = newallAddressMetadata;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAddressMetadatas = (): ExtendedAddressMetadata[] => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '[]';
    let parsedLocalCache: any;
    let out: ExtendedAddressMetadata[] = [];
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    if (parsedLocalCache.allAddressMetadata && parsedLocalCache.allAddressMetadata.length >= 1) {
      parsedLocalCache.allAddressMetadata.map((uuid: string) => {
        out.push({ ...parsedLocalCache.addressMetadata[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
