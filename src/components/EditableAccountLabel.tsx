import React, { useContext } from 'react';
import styled from 'styled-components';

import { ExtendedAddressBook, TAddress, NetworkId } from '@types';
import { AddressBookContext } from '@services';
import { BREAK_POINTS } from '@theme';
import { translateRaw } from '@translations';

import EditableText from './EditableText';

export interface Props {
  addressBookEntry?: ExtendedAddressBook;
  address: TAddress;
  networkId: NetworkId;
}

const SWrapper = styled.span`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-weight: bold;
  }
`;

const EditableAccountLabel = ({ addressBookEntry, address, networkId }: Props) => {
  const { updateAddressBooks, createAddressBooks } = useContext(AddressBookContext);
  return (
    <SWrapper>
      <EditableText
        truncate={true}
        saveValue={(value) => {
          if (addressBookEntry) {
            updateAddressBooks(addressBookEntry.uuid, { ...addressBookEntry, label: value });
          } else {
            createAddressBooks({
              address,
              label: value,
              network: networkId,
              notes: ''
            });
          }
        }}
        value={addressBookEntry ? addressBookEntry.label : translateRaw('NO_LABEL')}
      />
    </SWrapper>
  );
};

export default EditableAccountLabel;
