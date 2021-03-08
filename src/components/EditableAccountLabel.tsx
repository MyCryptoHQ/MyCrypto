import React from 'react';

import { updateUserActionStateByName, useDispatch } from '@store';
import { translateRaw } from '@translations';
import { ACTION_NAME, ACTION_STATE, Contact, ExtendedContact, NetworkId, TAddress } from '@types';

import EditableText from './EditableText';

export interface Props {
  addressBookEntry?: ExtendedContact;
  address: TAddress;
  networkId: NetworkId;
  createContact(contact: Contact): void;
  updateContact(contact: ExtendedContact): void;
}

const EditableAccountLabel = ({
  addressBookEntry,
  address,
  networkId,
  updateContact,
  createContact
}: Props) => {
  const dispatch = useDispatch();
  const handleChange = (value: string) => {
    if (addressBookEntry) {
      updateContact({ ...addressBookEntry, label: value });
      dispatch(
        updateUserActionStateByName({
          name: ACTION_NAME.UPDATE_LABEL,
          state: ACTION_STATE.COMPLETED
        })
      );
    } else {
      createContact({
        address,
        label: value,
        network: networkId,
        notes: ''
      });
    }
  };

  return (
    <EditableText
      bold={true}
      truncate={true}
      onChange={handleChange}
      value={addressBookEntry ? addressBookEntry.label : translateRaw('NO_LABEL')}
    />
  );
};

export default EditableAccountLabel;
