import { Address, Button, CollapsibleTable, Icon, Network, Typography } from '@mycrypto/ui';
import React from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { truncate } from 'v2/libs';
import { ExtendedAccount } from 'v2/services';
import './AccountList.scss';
import DashboardPanel from './DashboardPanel';

type DeleteAccount = (uuid: string) => void;
interface AccountListProps {
  accounts: ExtendedAccount[];
  className?: string;
  deleteAccount: DeleteAccount;
}

export default function AccountList(props: AccountListProps) {
  const { accounts, deleteAccount, className } = props;

  const shouldRedirect = accounts === undefined || accounts === null || accounts.length === 0;
  if (shouldRedirect) {
    return <Redirect to="/no-accounts" />;
  }

  return (
    <DashboardPanel
      heading="Your Accounts"
      action="Add Account"
      actionLink="/dashboard/add-account"
      className={`AccountList ${className}`}
    >
      <CollapsibleTable breakpoint={450} {...buildAccountTable(accounts, deleteAccount)} />
    </DashboardPanel>
  );
}

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

function buildAccountTable(accounts: ExtendedAccount[], deleteAccount: DeleteAccount) {
  return {
    head: ['Favorite', 'Address', 'Network', 'Value', 'Delete'],
    body: accounts.map(account => {
      return [
        <Icon key={0} icon="star" />,
        <Address
          key={1}
          title={`${account.label}-(${account.accountType})`}
          address={account.address}
          truncate={truncate}
        />,
        <Network key={3} color="#a682ff">
          {account.network}
        </Network>,
        <Typography key={4}>{account.value}</Typography>,
        <DeleteButton
          key={5}
          onClick={handleAccountDelete(deleteAccount, account.uuid)}
          icon="exit"
        />
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
}

/**
 * A higher order function that binds to an account uuid, which returns a handler that will
 * delete the bound account onClick
 */
function handleAccountDelete(deleteAccount: DeleteAccount, uuid: string) {
  return () => deleteAccount(uuid);
}
