import React from 'react';

import styled from 'styled-components';

import { useUserActions } from '@services';
import { BREAK_POINTS } from '@theme';
import { translateRaw } from '@translations';
import {
  ACTION_NAME,
  ACTION_STATE,
  Contact,
  ExtendedContact,
  NetworkId,
  TAddress,
  TUuid
} from '@types';

import EditableText from './EditableText';

export interface Props {
  addressBookEntry?: ExtendedContact;
  address: TAddress;
  networkId: NetworkId;
  createContact(contact: Contact): void;
  updateContact(uuid: TUuid, contact: ExtendedContact): void;
}

const SWrapper = styled.span`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-weight: bold;
  }
`;

const EditableAccountLabel = ({
  addressBookEntry,
  address,
  networkId,
  updateContact,
  createContact
}: Props) => {
  const { findUserAction, updateUserAction } = useUserActions();

  const updateLabelAction = findUserAction(ACTION_NAME.UPDATE_LABEL);

  return (
    <SWrapper>
      <EditableText
        truncate={true}
        saveValue={(value) => {
          if (addressBookEntry) {
            updateContact(addressBookEntry.uuid, { ...addressBookEntry, label: value });
            updateLabelAction &&
              updateUserAction(updateLabelAction.uuid, {
                ...updateLabelAction,
                state: ACTION_STATE.COMPLETED
              });
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
