import { Address, Button, CollapsibleTable, Icon, Network, Typography } from '@mycrypto/ui';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { translateRaw } from 'translations';
import { getCurrentsFromContext } from 'v2/libs/accounts/accounts';
import { truncate, getLabelByAccount } from 'v2/libs';
import { ExtendedAccount, AddressBook } from 'v2/services';
<<<<<<< HEAD:common/v2/features/Dashboard/components/AccountList.tsx
import DashboardPanel from './DashboardPanel';
import { translateRaw } from 'translations';
=======
>>>>>>> clean up dashboard imports and place move shared features to components:common/v2/components/AccountList.tsx
import { AccountContext, SettingsContext } from 'v2/providers';
import { DashboardPanel } from 'v2/components';
import './AccountList.scss';

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
      headingRight={translateRaw('ACCOUNT_LIST_TABLE_ADD_ACCOUNT')}
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
    body: accounts.map((account, index) => {
      const addressCard: AddressBook | undefined = getLabelByAccount(account);
      const label = addressCard ? addressCard.label : 'Unknown Account';
      let bodyItemCount = 0;
      return [
        <Icon key={index + bodyItemCount++} icon="star" />,
        <Address
          key={index + bodyItemCount++}
          title={`${label}`}
          address={account.address}
          truncate={truncate}
        />,
        <Network key={index + bodyItemCount++} color="#a682ff">
          {account.network}
        </Network>,
        <Typography key={index + bodyItemCount++}>{account.balance}</Typography>,
        <DeleteButton
          key={index + bodyItemCount++}
          onClick={handleAccountDelete(deleteAccount, account.uuid)}
          icon="exit"
        />
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
