import React from 'react';
import { Link } from 'react-router-dom';
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

const AddAccountButton = styled(Button)`
  color: #1eb8e7;
  font-weight: bold;
`;

const BottomRow = styled.div`
  margin-top: 0.875rem;
  text-align: center;
`;

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
      <Link to='/dashboard'>
        <BottomRow>
          <AddAccountButton basic>+ Add Account</AddAccountButton>
        </BottomRow>
      </Link>
    </DashboardPanel>
  );
}
