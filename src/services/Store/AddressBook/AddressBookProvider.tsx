import React, { useContext, createContext, useState } from 'react';
import isEmpty from 'lodash/isEmpty';

import {
  AddressBook,
  ExtendedAddressBook,
  IAccount,
  StoreAccount,
  LSKeys,
  TUuid,
  NetworkId,
  TAddress
} from '@types';
import { generateUUID, isSameAddress } from '@utils';

import { DataContext } from '../DataManager';
import { ContractContext } from '../Contract';

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
  const { getContractByAddress } = useContext(ContractContext);
  const [addressBookRestore, setAddressBookRestore] = useState<{
    [name: string]: ExtendedAddressBook | undefined;
  }>({});

  const model = createActions(LSKeys.ADDRESS_BOOK);

  const getContactFromContracts = (address: string): ExtendedAddressBook | undefined => {
    const contract = getContractByAddress(address);
    const contact: ExtendedAddressBook | undefined = contract && {
      address,
      label: contract.name,
      network: contract.networkId,
      notes: '',
      uuid: contract.uuid
    };
    return contact;
  };

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
      return (
        addressBook.find((contact: ExtendedAddressBook) =>
          isSameAddress(contact.address as TAddress, address as TAddress)
        ) || getContactFromContracts(address)
      );
    },
    getContactByAddressAndNetworkId: (address, networkId) => {
      return (
        addressBook
          .filter((contact: ExtendedAddressBook) => contact.network === networkId)
          .find((contact: ExtendedAddressBook) =>
            isSameAddress(contact.address as TAddress, address as TAddress)
          ) || getContactFromContracts(address)
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
