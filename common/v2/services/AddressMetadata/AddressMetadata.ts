import { destroy, getCache, read, readAll, setCache, update } from 'v2/services/LocalCache';
import { AddressMetadata } from './types';

export const createAddressMetadata = (AddressMetadatas: AddressMetadata) => {
  const uuid = AddressMetadatas.address.toLowerCase();

  const newAddressMetadataCache = getCache();
  newAddressMetadataCache.addressMetadata[uuid] = AddressMetadatas;

  setCache(newAddressMetadataCache);
};

export const readAddressMetadata = read('addressMetadata');
export const updateAddressMetadata = update('addressMetadata');
export const deleteAddressMetadata = destroy('addressMetadata');
export const readAddressMetadatas = readAll('addressMetadata');
