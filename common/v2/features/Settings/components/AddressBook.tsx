import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon, Identicon, Button } from '@mycrypto/ui';

import {
  DashboardPanel,
  CollapsibleTable,
  RowDeleteOverlay,
  Network,
  Typography,
  EthAddress
} from 'v2/components';
import { ExtendedAddressBook } from 'v2/types';
import { truncate } from 'v2/utils';
import { BREAK_POINTS } from 'v2/theme';

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
  margin-bottom: 15px;
`;

const BottomRow = styled.div`
  margin-top: 0.875rem;
  text-align: center;
`;

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const SIdenticon = styled(Identicon)`
  > img {
    height: 2em;
  }
  margin-right: 10px;
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-right: 27px;
  }
`;

const STypography = styled(Typography)`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-weight: inherit;
  }
`;

export const screenIsMobileSized = (breakpoint: number): boolean =>
  window.matchMedia(`(max-width: ${breakpoint}px)`).matches;

export default function AddressBook({ addressBook, toggleFlipped, deleteAddressBooks }: Props) {
  const [deletingIndex, setDeletingIndex] = useState();

  const overlayRows = [deletingIndex];

  const addressBookTable = {
    head: ['Favorite', 'Label', 'Address', 'Network', 'Notes', 'Delete'],
    overlay:
      overlayRows && overlayRows[0] !== undefined ? (
        <RowDeleteOverlay
          prompt={`Are you sure you want to delete ${addressBook[overlayRows[0]].label} address with
             address: ${truncate(addressBook[overlayRows[0]].address)}?`}
          deleteAction={() => {
            deleteAddressBooks(addressBook[overlayRows[0]].uuid);
            setDeletingIndex(undefined);
          }}
          cancelAction={() => setDeletingIndex(undefined)}
        />
      ) : (
        <></>
      ),
    overlayRows,
    body: addressBook.map(({ address, label, network, notes }: ExtendedAddressBook, index) => [
      <Icon key={0} icon="star" />,
      <Label key={1}>
        <SIdenticon address={address} />
        <STypography bold={true} value={label} />
      </Label>,
      <EthAddress key={2} address={address} truncate={truncate} isCopyable={true} />,
      <Network key={3} color="#a682ff">
        {network}
      </Network>,
      <Typography key={4} value={notes} />,
      <DeleteButton key={5} onClick={() => setDeletingIndex(index)} icon="exit" />
    ]),
    config: {
      primaryColumn: 'Label',
      sortableColumn: 'Label',
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
