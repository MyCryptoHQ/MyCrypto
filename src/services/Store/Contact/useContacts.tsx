import { useContext, useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import {
  Contact,
  ExtendedContact,
  IAccount,
  LSKeys,
  NetworkId,
  StoreAccount,
  TAddress,
  TUuid
} from '@types';
import { generateUUID, isSameAddress } from '@utils';

import { useContracts } from '../Contract';
import { DataContext } from '../DataManager';

export interface IAddressBookContext {
  contacts: ExtendedContact[];
  addressBookRestore: { [name: string]: ExtendedContact | undefined };
  createContact(contact: Contact): void;
  createContactWithID(uuid: TUuid, contact: Contact): void;
  updateContact(uuid: TUuid, contact: ExtendedContact): void;
  deleteContact(uuid: TUuid): void;
  getContactByAddress(address: string): ExtendedContact | undefined;
  getContactByAddressAndNetworkId(
    address: string,
    networkId: NetworkId
  ): ExtendedContact | undefined;
  getAccountLabel(account: StoreAccount | IAccount): string | undefined;
  restoreDeletedContact(id: TUuid): void;
}

function useContacts() {
  const { createActions, addressBook } = useContext(DataContext);
  const { getContractByAddress } = useContracts();
  const [contactRestore, setContactRestore] = useState<{
    [name: string]: ExtendedContact | undefined;
  }>({});

  const model = createActions(LSKeys.ADDRESS_BOOK);

  const getContactFromContracts = (address: string): ExtendedContact | undefined => {
    const contract = getContractByAddress(address as TAddress);
    const contact: ExtendedContact | undefined = contract && {
      address,
      label: contract.name,
      network: contract.networkId,
      notes: '',
      uuid: contract.uuid
    };
    return contact;
  };

  const createContact = (item: Contact) => model.create({ ...item, uuid: generateUUID() });

  const createContactWithID = (uuid: TUuid, item: Contact) =>
    model.createWithID({ uuid, ...item }, uuid);

  const updateContact = (uuid: TUuid, item: ExtendedContact) => model.update(uuid, item);

  const deleteContact = (uuid: TUuid) => {
    const addressBookToDelete = addressBook.find((a) => a.uuid === uuid);
    if (isEmpty(addressBookToDelete)) {
      throw new Error('Unable to delete account from address book! No account with id specified.');
    }

    setContactRestore((prevState) => ({ ...prevState, [uuid]: addressBookToDelete }));
    model.destroy(addressBookToDelete!);
  };

  const getContactByAddress = (address: TAddress) => {
    return (
      addressBook.find((contact: ExtendedContact) =>
        isSameAddress(contact.address as TAddress, address)
      ) || getContactFromContracts(address)
    );
  };

  const getContactByAddressAndNetworkId = (address: TAddress, networkId: NetworkId) => {
    return (
      addressBook
        .filter((contact: ExtendedContact) => contact.network === networkId)
        .find((contact: ExtendedContact) => isSameAddress(contact.address as TAddress, address)) ||
      getContactFromContracts(address)
    );
  };

  const getAccountLabel = ({ address, networkId }: { address: TAddress; networkId: NetworkId }) => {
    const addressContact = getContactByAddressAndNetworkId(address, networkId);
    return addressContact ? addressContact.label : undefined;
  };

  const restoreDeletedContact = (id: TUuid) => {
    const contactRecord = contactRestore[id];
    if (isEmpty(contactRecord)) {
      throw new Error(
        'Unable to restore address book record! No address book record with id specified.'
      );
    }

    const { uuid, ...rest } = contactRecord!;
    createContactWithID(uuid, rest);
    setContactRestore((prevState) => ({ ...prevState, [uuid]: undefined }));
  };

  return {
    contacts: addressBook,
    contactRestore,
    createContact,
    createContactWithID,
    updateContact,
    deleteContact,
    getContactByAddress,
    getContactByAddressAndNetworkId,
    getAccountLabel,
    restoreDeletedContact
  };
}

export default useContacts;
