import { useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import { STATIC_CONTACTS } from '@config';
import {
  createContact as createAContact,
  createContacts as createManyContacts,
  destroyContact,
  selectContacts,
  updateContact as updateAContact,
  updateContacts as updateManyContacts,
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
  const { getContractByAddress } = useContracts();
  const dispatch = useDispatch();
  const [contactRestore, setContactRestore] = useState<{
    [name: string]: ExtendedContact | undefined;
  }>({});

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

  const createContact = (item: Contact) => {
    const uuid = generateDeterministicAddressUUID(item.network, item.address);
    dispatch(createAContact({ ...item, uuid }));
  };

  const createContacts = (items: Contact[]) => {
    dispatch(
      createManyContacts(
        items.map((item) => {
          const uuid = generateDeterministicAddressUUID(item.network, item.address);
          return { ...item, uuid };
        })
      )
    );
  };

  const updateContact = (item: ExtendedContact) => {
    dispatch(updateAContact(item));
  };

  const updateContacts = (items: ExtendedContact[]) => {
    dispatch(updateManyContacts(items));
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
      ) || getContactFromContracts(address)
    );
  };

  const getContactByAddressAndNetworkId = (address: TAddress, networkId: NetworkId) => {
    return (
      [...contacts, ...STATIC_CONTACTS]
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
    createContact(rest);
    setContactRestore((prevState) => ({ ...prevState, [uuid]: undefined }));
  };

  return {
    contacts,
    contactRestore,
    createContact,
    createContacts,
    updateContact,
    updateContacts,
    deleteContact,
    getContactByAddress,
    getContactByAddressAndNetworkId,
    getAccountLabel,
    restoreDeletedContact
  };
}

export default useContacts;
