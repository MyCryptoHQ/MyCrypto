import { Address, Button, CollapsibleTable, Icon, Network, Typography } from '@mycrypto/ui';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import styled from 'styled-components';
import { getCurrentsFromContext } from 'v2/libs/accounts/accounts';
import { truncate } from 'v2/libs';
import { ExtendedAccount } from 'v2/services';
import './AccountList.scss';
import DashboardPanel from './DashboardPanel';
import { translateRaw } from 'translations';
import { AccountContext, SettingsContext } from 'v2/providers';

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

type DeleteAccount = (uuid: string) => void;
interface AccountListProps {
  className?: string;
  currentsOnly?: boolean;
}

export default function AccountList(props: AccountListProps) {
  const { className, currentsOnly } = props;
  const { settings } = useContext(SettingsContext);
  const { accounts, deleteAccount } = useContext(AccountContext);
  const currentAccounts: ExtendedAccount[] = getCurrentsFromContext(
    accounts,
    settings.dashboardAccounts
  );
  const shouldRedirect = accounts === undefined || accounts === null || accounts.length === 0;
  if (shouldRedirect) {
    return <Redirect to="/no-accounts" />;
  }

  return (
    <DashboardPanel
      heading={translateRaw('ACCOUNT_LIST_TABLE_YOUR_ACCOUNTS')}
      action={translateRaw('ACCOUNT_LIST_TABLE_ADD_ACCOUNT')}
      actionLink="/add-account"
      className={`AccountList ${className}`}
    >
      <CollapsibleTable
        breakpoint={450}
        {...buildAccountTable(currentsOnly ? currentAccounts : accounts, deleteAccount)}
      />
    </DashboardPanel>
  );
}

function buildAccountTable(accounts: ExtendedAccount[], deleteAccount: DeleteAccount) {
  return {
    head: [
      translateRaw('ACCOUNT_LIST_FAVOURITE'),
      translateRaw('ACCOUNT_LIST_ADDRESS'),
      translateRaw('ACCOUNT_LIST_NETWORK'),
      translateRaw('ACCOUNT_LIST_VALUE'),
      translateRaw('ACCOUNT_LIST_DELETE')
    ],
    body: accounts.map(account => {
      return [
        // tslint:disable-next-line: jsx-key
        <Icon icon="star" />,
        // tslint:disable-next-line: jsx-key
        <Address
          title={`${account.label}-(${account.wallet})`}
          address={account.address}
          truncate={truncate}
        />,
        // tslint:disable-next-line: jsx-key
        <Network color="#a682ff">{account.network}</Network>,
        // tslint:disable-next-line: jsx-key
        <Typography>{account.balance}</Typography>,
        // tslint:disable-next-line: jsx-key
        <DeleteButton onClick={handleAccountDelete(deleteAccount, account.uuid)} icon="exit" />
      ];
    }),
    config: {
      primaryColumn: translateRaw('ACCOUNT_LIST_ADDRESS'),
      sortableColumn: translateRaw('ACCOUNT_LIST_ADDRESS'),
      sortFunction: (a: any, b: any) => {
        const aLabel = a.props.label;
        const bLabel = b.props.label;
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      },
      hiddenHeadings: [translateRaw('ACCOUNT_LIST_FAVOURITE'), translateRaw('ACCOUNT_LIST_DELETE')],
      iconColumns: [translateRaw('ACCOUNT_LIST_FAVOURITE'), translateRaw('ACCOUNT_LIST_DELETE')]
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
