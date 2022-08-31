import { useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import { STATIC_CONTACTS } from '@config';
import {
  createContact as createAContact,
  destroyContact,
  selectContacts,
  updateContact as updateAContact,
  useDispatch,
  useSelector
} from '@store';
import {
  Contact,
  ExtendedContact,
  IAccount,
  NetworkId,
  StoreAccount,
  TAddress,
  TUuid
} from '@types';
import { generateDeterministicAddressUUID, isSameAddress } from '@utils';

import { useContracts } from '../Contract';
import {
  getContactByAddressAndNetworkId as getContactByAddressAndNetworkIdFunc,
  getContactFromContracts
} from './helpers';

export interface IAddressBookContext {
  contacts: ExtendedContact[];
  addressBookRestore: { [name: string]: ExtendedContact | undefined };
  createContact(contact: Contact): void;
  createContactWithID(uuid: TUuid, contact: Contact): void;
  updateContact(contact: ExtendedContact): void;
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
  const contacts = useSelector(selectContacts);
  const { contracts } = useContracts();
  const dispatch = useDispatch();
  const [contactRestore, setContactRestore] = useState<{
    [name: string]: ExtendedContact | undefined;
  }>({});

  const createContact = (item: Contact) => {
    const uuid = generateDeterministicAddressUUID(item.network, item.address);
    dispatch(createAContact({ ...item, uuid }));
  };

  const updateContact = (item: ExtendedContact) => {
    dispatch(updateAContact(item));
  };

  const deleteContact = (uuid: TUuid) => {
    const contactToDelete = contacts.find((a) => a.uuid === uuid);
    if (isEmpty(contactToDelete) || !contactToDelete) {
      throw new Error('Unable to delete contact from address book! No account with id specified.');
    }

    setContactRestore((prevState) => ({ ...prevState, [uuid]: contactToDelete }));
    dispatch(destroyContact(contactToDelete.uuid));
  };

  const getContactByAddress = (address: TAddress) => {
    return (
      [...contacts, ...STATIC_CONTACTS].find((contact: ExtendedContact) =>
        isSameAddress(contact.address as TAddress, address)
      ) ?? getContactFromContracts(contracts)(address)
    );
  };

  const getContactByAddressAndNetworkId = (address: TAddress, networkId: NetworkId) => {
    return getContactByAddressAndNetworkIdFunc(contacts, contracts)(address, networkId);
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
    createContact(rest);
    setContactRestore((prevState) => ({ ...prevState, [uuid]: undefined }));
  };

  return {
    contacts,
    contactRestore,
    createContact,
    updateContact,
    deleteContact,
    getContactByAddress,
    getContactByAddressAndNetworkId,
    getAccountLabel,
    restoreDeletedContact
  };
}

export default useContacts;
