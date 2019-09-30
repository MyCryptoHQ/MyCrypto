import React from 'react';
import styled from 'styled-components';
import { Icon, Copyable, Identicon, Typography, Button } from '@mycrypto/ui';

import { DashboardPanel, CollapsibleTable } from 'v2/components';
import { ExtendedAddressBook } from 'v2/types';
import { truncate } from 'v2/utils';

interface Props {
  addressBook: ExtendedAddressBook[];
  toggleFlipped(): void;
  deleteAddressBooks(uuid: string): void;
}

const DeleteButton = styled(Button)`
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  width: 100%;
`;

const AddAccountButton = styled(Button)`
  color: #1eb8e7;
  font-weight: bold;
`;

const BottomRow = styled.div`
  margin-top: 0.875rem;
  text-align: center;
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  p {
    margin-right: 27px;
  }
`;

const SIdenticon = styled(Identicon)`
  > img {
    width: 30px;
    height: 30px;
  }
`;

const STypography = styled(Typography)`
  height: 100%;
`;

export default function AddressBook({ addressBook, toggleFlipped, deleteAddressBooks }: Props) {
  const addressBookTable = {
    head: ['Favorite', 'Label', 'Address', 'Notes', 'Delete'],
    body: addressBook.map(({ address, label, notes, uuid }: ExtendedAddressBook) => [
      <Icon key={0} icon="star" />,
      <Label key={1}>
        <SIdenticon address={address} />
        <STypography>{label}</STypography>
      </Label>,
      <Copyable key={2} text={address} truncate={truncate} />,
      <Typography key={3}>{notes}</Typography>,
      <DeleteButton key={4} onClick={() => deleteAddressBooks(uuid)} icon="exit" />
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
