import React, { useContext, createContext } from 'react';

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
  createAddressBooks(addressBooksData: AddressBook): void;
  updateAddressBooks(uuid: TUuid, addressBooksData: ExtendedAddressBook): void;
  deleteAddressBooks(uuid: TUuid): void;
  getContactByAddress(address: string): ExtendedAddressBook | undefined;
  getContactByAddressAndNetworkId(
    address: string,
    networkId: NetworkId
  ): ExtendedAddressBook | undefined;
  getAccountLabel(account: StoreAccount | IAccount): string | undefined;
}

export const AddressBookContext = createContext({} as IAddressBookContext);

export const AddressBookProvider: React.FC = ({ children }) => {
  const { createActions, addressBook } = useContext(DataContext);

  const model = createActions(LSKeys.ADDRESS_BOOK);

  const state: IAddressBookContext = {
    addressBook,
    createAddressBooks: (item: AddressBook) => model.create({ ...item, uuid: generateUUID() }),
    updateAddressBooks: (uuid: TUuid, item: ExtendedAddressBook) => model.update(uuid, item),
    deleteAddressBooks: (uuid: TUuid) =>
      model.destroy(addressBook.find(a => a.uuid === uuid) as ExtendedAddressBook),
    getContactByAddress: address => {
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
    }
  };

  return <AddressBookContext.Provider value={state}>{children}</AddressBookContext.Provider>;
};
