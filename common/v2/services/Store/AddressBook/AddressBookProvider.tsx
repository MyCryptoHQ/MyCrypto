import React, { useContext, createContext } from 'react';

import {
  AddressBook,
  ExtendedAddressBook,
  IAccount,
  Network,
  StoreAccount,
  LSKeys,
  TUuid
} from 'v2/types';
import { generateUUID } from 'v2/utils';
import { DataContext } from '../DataManager';

interface IAddressBookContext {
  addressBook: ExtendedAddressBook[];
  createAddressBooks(addressBooksData: AddressBook): void;
  updateAddressBooks(uuid: TUuid, addressBooksData: ExtendedAddressBook): void;
  deleteAddressBooks(uuid: TUuid): void;
  getContactByAddress(address: string): ExtendedAddressBook | undefined;
  getContactByAddressAndNetwork(address: string, network: Network): ExtendedAddressBook | undefined;
  getContactByAccount(account: IAccount): ExtendedAddressBook | undefined;
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
    getContactByAddressAndNetwork: (address, network) => {
      return addressBook
        .filter((contact: ExtendedAddressBook) => contact.network === network.name)
        .find(
          (contact: ExtendedAddressBook) => contact.address.toLowerCase() === address.toLowerCase()
        );
    },
    getContactByAccount: account => {
      return addressBook
        .filter((contact: ExtendedAddressBook) => contact.network === account.networkId)
        .find(
          (contact: ExtendedAddressBook) =>
            contact.address.toLowerCase() === account.address.toLowerCase()
        );
    },
    getAccountLabel: account => {
      const addressContact = state.getContactByAccount(account as IAccount);
      return addressContact ? addressContact.label : undefined;
    }
  };

  return <AddressBookContext.Provider value={state}>{children}</AddressBookContext.Provider>;
};
