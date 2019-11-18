import { create, destroy, read, readAll, update } from '../Cache';

export const createAddressBook = create('addressBook');
export const readAddressBook = read('addressBook');
export const updateAddressBook = update('addressBook');
export const deleteAddressBook = destroy('addressBook');
export const readAddressBooks = readAll('addressBook');
