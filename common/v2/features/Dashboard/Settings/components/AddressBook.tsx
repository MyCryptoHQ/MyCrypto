import React from 'react';
import { Address, Icon, CollapsibleTable, Typography, Button } from '@mycrypto/ui';

import { DashboardPanel } from '../../components';
import { ExtendedAddressMetadata } from 'v2/services';
import styled from 'styled-components';

interface Props {
  addressMetadata: ExtendedAddressMetadata[];
  toggleFlipped(): void;
  deleteAddressMetadatas(uuid: string): void;
}

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

export default function AddressBook({
  addressMetadata,
  toggleFlipped,
  deleteAddressMetadatas
}: Props) {
  const truncate = (children: string) => {
    return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
  };
  const addressBookTable = {
    head: ['Favorite', 'Address', 'Notes', 'Delete'],
    body: addressMetadata.map(({ address, label, notes, uuid }: ExtendedAddressMetadata) => [
      <Icon key={0} icon="star" />,
      <Address key={1} title={label} address={address} truncate={truncate} />,
      <Typography key={2}>{notes}</Typography>,
      <DeleteButton key={3} onClick={() => deleteAddressMetadatas(uuid)} icon="exit" />
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
      <button onClick={toggleFlipped}>Add Address</button>
    </DashboardPanel>
  );
}
