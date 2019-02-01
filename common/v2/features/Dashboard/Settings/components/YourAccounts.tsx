import React from 'react';
import { Address, Icon, CollapsibleTable, Network, Typography } from '@mycrypto/ui';

import { DashboardPanel } from '../../components';

interface Props {
  toggleFlipped(): void;
}

// Fake Data
const accounts = [
  {
    name: 'Wallet #1',
    address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
    network: 'Ethereum',
    node: 'Epool.io',
    value: '$2,203.12',
    favorite: false
  },
  {
    name: 'Wallet #2',
    address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    network: 'Ethereum',
    node: 'MyCrypto',
    value: '$1337.42',
    favorite: false
  }
];
const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};
const accountTable = {
  head: ['Favorite', 'Address', 'Network', 'Value', 'Delete'],
  body: accounts.map(({ address, name, network, value }) => [
    <Icon key={0} icon="star" />,
    <Address key={1} title={name} address={address} onSubmit={() => {}} truncate={truncate} />,
    <Network key={3} color="#a682ff">
      {network}
    </Network>,
    <Typography key={4}>{value}</Typography>,
    <Icon key={5} icon="exit" />
  ]),
  config: {
    primaryColumn: 'Address',
    sortableColumn: 'Address',
    sortFunction: (a: any, b: any) => {
      const aLabel = a.props.title;
      const bLabel = b.props.title;

      return aLabel.localeCompare(bLabel);
    },
    hiddenHeadings: ['Favorite', 'Delete'],
    iconColumns: ['Favorite', 'Delete']
  }
};

export default function YourAccounts({ toggleFlipped }: Props) {
  return (
    <DashboardPanel heading="Your Accounts" className="AddressBook">
      <CollapsibleTable breakpoint={450} {...accountTable} />
      <button onClick={toggleFlipped}>Flip</button>
    </DashboardPanel>
  );
}
