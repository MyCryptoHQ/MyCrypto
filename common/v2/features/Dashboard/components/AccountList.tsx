import React from 'react';
import { Address, CollapsibleTable, Icon, Network, Typography, Button } from '@mycrypto/ui';

import DashboardPanel from './DashboardPanel';
import './AccountList.scss';
import { ExtendedAccount } from 'v2/services';
import styled from 'styled-components';

interface Props {
  accounts: ExtendedAccount[];
  className?: string;
  deleteAccount(uuid: string): void;
}

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

// Fake Data
/*
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
  head: ['Favorite', 'Address', 'Network', 'Value'],
  body: accounts.map(({ address, name, network, value }) => [
    <Icon key={0} icon="star" />,
    <Address key={1} title={name} address={address} truncate={truncate} />,
    <Network key={3} color="#a682ff">
      {network}
    </Network>,
    <Typography key={4}>{value}</Typography>
  ]),
  config: {
    primaryColumn: 'Address',
    sortableColumn: 'Address',
    sortFunction: (a: any, b: any) => {
      const aLabel = a.props.title;
      const bLabel = b.props.title;

      return aLabel.localeCompare(bLabel);
    },
    hiddenHeadings: ['Favorite'],
    iconColumns: ['Favorite'],
    reversedColumns: ['Value']
  }
};
*/

export default function AccountList({ accounts, deleteAccount, className = '' }: Props) {
  const truncate = (children: string) => {
    return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
  };
  const accountTable = {
    head: ['Favorite', 'Address', 'Network', 'Value', 'Delete'],
    body: accounts.map(account => {
      return [
        <Icon key={0} icon="star" />,
        <Address
          key={1}
          title={`${account.label} - (${account.accountType})`}
          address={account.address}
          truncate={truncate}
        />,
        <Network key={3} color="#a682ff">
          {account.network}
        </Network>,
        <Typography key={4}>{account.value}</Typography>,
        <DeleteButton key={5} onClick={() => deleteAccount(account.uuid)} icon="exit" />
      ];
    }),
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
    <DashboardPanel
      heading="Your Accounts"
      action="Add Account"
      actionLink="/dashboard/add-account"
      className={`AccountList ${className}`}
    >
      <CollapsibleTable breakpoint={450} {...accountTable} />
    </DashboardPanel>
  );
}
