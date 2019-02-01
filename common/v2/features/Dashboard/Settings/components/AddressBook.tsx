import React, { Component } from 'react';
import { Address, Icon, CollapsibleTable, Typography } from '@mycrypto/ui';

import { DashboardPanel } from '../../components';

interface Props {
  toggleFlipped(): void;
}

// Fake Data
const accounts = [
  {
    name: 'Wallet #1',
    address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
    notes: 'foo bar baz',
    favorite: false
  },
  {
    name: 'Wallet #2',
    address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    notes: 'foo bar baz',
    favorite: false
  }
];
const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};
const addressBookTable = {
  head: ['Favorite', 'Address', 'Notes', 'Delete'],
  body: accounts.map(({ address, name, notes }) => [
    <Icon key={0} icon="star" />,
    <Address key={1} title={name} address={address} onSubmit={() => {}} truncate={truncate} />,
    <Typography key={2}>{notes}</Typography>,
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

export default class AddressBook extends Component<Props> {
  public render() {
    const { toggleFlipped } = this.props;

    return (
      <DashboardPanel heading="Address Book" className="AddressBook">
        <CollapsibleTable breakpoint={450} {...addressBookTable} />
        <button onClick={toggleFlipped}>Flip</button>
      </DashboardPanel>
    );
  }
}
