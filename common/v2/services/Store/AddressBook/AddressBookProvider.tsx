import React, { useContext, createContext, useState } from 'react';
import isEmpty from 'lodash/isEmpty';

import {
  AddressBook,
  ExtendedAddressBook,
  IAccount,
  StoreAccount,
  LSKeys,
  TUuid,
  NetworkId
} from 'v2/types';
import { generateUUID } from 'v2/utils';
import { DataContext } from '../DataManager';

interface IAddressBookContext {
  addressBook: ExtendedAddressBook[];
  addressBookRestore: { [name: string]: ExtendedAddressBook | undefined };
  createAddressBooks(addressBooksData: AddressBook): void;
  createAddressBooksWithID(uuid: TUuid, addressBooksData: AddressBook): void;
  updateAddressBooks(uuid: TUuid, addressBooksData: ExtendedAddressBook): void;
  deleteAddressBooks(uuid: TUuid): void;
  getContactByAddress(address: string): ExtendedAddressBook | undefined;
  getContactByAddressAndNetworkId(
    address: string,
    networkId: NetworkId
  ): ExtendedAddressBook | undefined;
  getAccountLabel(account: StoreAccount | IAccount): string | undefined;
  restoreDeletedAddressBook(addressBookId: TUuid): void;
}

export const AddressBookContext = createContext({} as IAddressBookContext);

export const AddressBookProvider: React.FC = ({ children }) => {
  const { createActions, addressBook } = useContext(DataContext);
  const [addressBookRestore, setAddressBookRestore] = useState<{
    [name: string]: ExtendedAddressBook | undefined;
  }>({});

  const model = createActions(LSKeys.ADDRESS_BOOK);

  const state: IAddressBookContext = {
    addressBook,
    addressBookRestore,
    createAddressBooks: (item: AddressBook) => model.create({ ...item, uuid: generateUUID() }),
    createAddressBooksWithID: (uuid: TUuid, item: AddressBook) => model.create({ uuid, ...item }),
    updateAddressBooks: (uuid: TUuid, item: ExtendedAddressBook) => model.update(uuid, item),
    deleteAddressBooks: (uuid: TUuid) => {
      const addressBookToDelete = addressBook.find((a) => a.uuid === uuid);
      if (isEmpty(addressBookToDelete)) {
        throw new Error(
          'Unable to delete account from address book! No account with id specified.'
        );
      }

      setAddressBookRestore((prevState) => ({ ...prevState, [uuid]: addressBookToDelete }));
      model.destroy(addressBookToDelete!);
    },
    getContactByAddress: (address) => {
      return addressBook.find(
        (contact: ExtendedAddressBook) => contact.address.toLowerCase() === address.toLowerCase()
      );
    },
    getContactByAddressAndNetworkId: (address, networkId) => {
      return addressBook
        .filter((contact: ExtendedAddressBook) => contact.network === networkId)
        .find(
          (contact: ExtendedAddressBook) => contact.address.toLowerCase() === address.toLowerCase()
        );
    },
    getAccountLabel: ({ address, networkId }) => {
      const addressContact = state.getContactByAddressAndNetworkId(address, networkId);
      return addressContact ? addressContact.label : undefined;
    },
    restoreDeletedAddressBook(addressBookId: TUuid): void {
      const addressBookRecord = addressBookRestore[addressBookId];
      if (isEmpty(addressBookRecord)) {
        throw new Error(
          'Unable to restore address book record! No address book record with id specified.'
        );
      }

      const { uuid, ...rest } = addressBookRecord!;
      state.createAddressBooksWithID(uuid, rest);
      setAddressBookRestore((prevState) => ({ ...prevState, [uuid]: undefined }));
    }
  };

  return <AddressBookContext.Provider value={state}>{children}</AddressBookContext.Provider>;
};
