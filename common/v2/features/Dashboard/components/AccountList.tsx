import React from 'react';
import { Address, CollapsibleTable, Icon, Network, Typography } from '@mycrypto/ui';

import DashboardPanel from './DashboardPanel';
import './AccountList.scss';
import { ExtendedAccount } from 'v2/services';

interface Props {
  accounts: ExtendedAccount[];
  className?: string;
}

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
    iconColumns: ['Favorite']
  }
};
*/

export default function AccountList({ accounts, className = '' }: Props) {
  console.log('accounts: ' + JSON.stringify(accounts, null, 4));
  const truncate = (children: string) => {
    return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
  };
  const accountTable = {
    head: ['Favorite', 'Address', 'Network', 'Value'],
    body: accounts.map(account => {
      console.log('value2: ' + account.value);
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
        <Typography key={4}>{account.value}</Typography>
      ];
    }),
    config: {
      primaryColumn: 'Address',
      sortableColumn: 'Address',
      sortFunction: (a: any, b: any) => {
        const aLabel = a.props.label;
        const bLabel = b.props.label;
        console.log('comparing ' + aLabel + ' to ' + bLabel);
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      },
      hiddenHeadings: ['Favorite'],
      iconColumns: ['Favorite']
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
