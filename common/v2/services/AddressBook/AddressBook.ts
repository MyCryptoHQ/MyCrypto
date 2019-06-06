import { destroy, getCache, read, readAll, setCache, update } from 'v2/services/LocalCache';
import { AddressBook } from './types';

export const createAddressBook = (AddressBooks: AddressBook) => {
  const uuid = AddressBooks.address.toLowerCase();

  const newAddressBookCache = getCache();
  newAddressBookCache.addressBook[uuid] = AddressBooks;

  setCache(newAddressBookCache);
};

export const readAddressBook = read('addressBook');
export const updateAddressBook = update('addressBook');
export const deleteAddressBook = destroy('addressBook');
export const readAddressBooks = readAll('addressBook');
