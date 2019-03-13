import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
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

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
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
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.addressMetadata[uuid];
  };

  public updateAddressMetadata = (uuid: string, AddressMetadatas: AddressMetadata) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
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
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
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
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedAddressMetadata[] = [];
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
