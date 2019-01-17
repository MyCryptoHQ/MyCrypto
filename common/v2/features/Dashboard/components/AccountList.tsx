import React from 'react';
import { CollapsibleTable, Copyable, Icon, Identicon, Typography } from '@mycrypto/ui';

import DashboardPanel from './DashboardPanel';
import './AccountList.scss';

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
const truncate = (text: string): string => text.substr(0, 6);
const accountTable = {
  head: ['Favorite', 'Label', 'Address', 'Network', 'Value'],
  body: accounts.map(({ address, name, network, value }) => [
    <Icon key={0} icon="star" />,
    <div
      key={1}
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Identicon
        address={address}
        style={{
          width: '35px',
          height: '35px',
          marginRight: '1rem'
        }}
      />
      <Typography>{name}</Typography>
    </div>,
    <Copyable key={2} text={address} truncate={truncate} />,
    <Typography key={3}>{network}</Typography>,
    <Typography key={4}>{value}</Typography>
  ]),
  config: {
    primaryColumn: 'label',
    sortableColumn: 'Label',
    sortFunction: (a: any, b: any) => {
      const aLabel = a.props.children[1].props.children;
      const bLabel = b.props.children[1].props.children;

      return aLabel.localeCompare(bLabel);
    },
    hiddenHeadings: ['Favorite'],
    iconColumns: ['Favorite']
  }
};

export default function AccountList() {
  return (
    <DashboardPanel
      heading="Your Accounts"
      action="Add Account"
      actionLink="/dashboard/add-account"
      className="AccountList"
    >
      <CollapsibleTable breakpoint={450} {...accountTable} />
    </DashboardPanel>
  );
}
