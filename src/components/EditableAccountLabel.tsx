import React, { useContext } from 'react';

import { ExtendedAddressBook } from '@types';
import { AddressBookContext } from '@services';

import EditableText from './EditableText';

interface Props {
  addressBookEntry: ExtendedAddressBook;
}

const EditableAccountLabel = ({ addressBookEntry }: Props) => {
  const { updateAddressBooks } = useContext(AddressBookContext);
  return (
    <EditableText
      truncate={true}
      saveValue={(value) => {
        updateAddressBooks(addressBookEntry.uuid, {
          ...addressBookEntry,
          label: value
        });
      }}
      value={addressBookEntry.label}
    />
  );
};

export default EditableAccountLabel;
