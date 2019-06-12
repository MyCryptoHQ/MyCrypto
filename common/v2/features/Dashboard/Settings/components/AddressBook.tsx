import React from 'react';
import { Address, Icon, CollapsibleTable, Typography, Button } from '@mycrypto/ui';

import { DashboardPanel } from '../../components';
import { ExtendedAddressBook } from 'v2/services';
import styled from 'styled-components';
import { truncate } from 'v2/libs';

interface Props {
  addressBook: ExtendedAddressBook[];
  toggleFlipped(): void;
  deleteAddressBooks(uuid: string): void;
}

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

const AddAccountButton = styled(Button)`
  color: #1eb8e7;
  font-weight: bold;
`;

const BottomRow = styled.div`
  margin-top: 0.875rem;
  text-align: center;
`;

export default function AddressBook({ addressBook, toggleFlipped, deleteAddressBooks }: Props) {
  const addressBookTable = {
    head: ['Favorite', 'Address', 'Notes', 'Delete'],
    body: addressBook.map(({ address, label, notes, uuid }: ExtendedAddressBook) => [
      <Icon key={0} icon="star" />,
      <Address key={1} title={label} address={address} truncate={truncate} />,
      <Typography key={2}>{notes}</Typography>,
      <DeleteButton key={3} onClick={() => deleteAddressBooks(uuid)} icon="exit" />
    ]),
    config: {
      primaryColumn: 'Address',
      sortableColumn: 'Address',
      sortFunction: (a: any, b: any) => {
        const aLabel = a.props.label;
        const bLabel = b.props.label;
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      },
      hiddenHeadings: ['Favorite', 'Delete'],
      iconColumns: ['Favorite', 'Delete']
    }
  };
  return (
    <DashboardPanel heading="Address Book">
      <CollapsibleTable breakpoint={450} {...addressBookTable} />
      <BottomRow>
        <AddAccountButton onClick={toggleFlipped} basic={true}>
          + Add Address
        </AddAccountButton>
      </BottomRow>
    </DashboardPanel>
  );
}
