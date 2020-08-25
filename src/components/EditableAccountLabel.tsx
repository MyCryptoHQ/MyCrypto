import React from 'react';
import styled from 'styled-components';

import { ExtendedContact, TAddress, NetworkId } from '@types';
import { useContacts } from '@services';
import { BREAK_POINTS } from '@theme';
import { translateRaw } from '@translations';

import EditableText from './EditableText';

export interface Props {
  addressBookEntry?: ExtendedContact;
  address: TAddress;
  networkId: NetworkId;
}

const SWrapper = styled.span`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-weight: bold;
  }
`;

const EditableAccountLabel = ({ addressBookEntry, address, networkId }: Props) => {
  const { updateContact, createContact } = useContacts();
  return (
    <SWrapper>
      <EditableText
        truncate={true}
        saveValue={(value) => {
          if (addressBookEntry) {
            updateContact(addressBookEntry.uuid, { ...addressBookEntry, label: value });
          } else {
            createContact({
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
