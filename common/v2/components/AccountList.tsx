import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { Button, CollapsibleTable, Copyable, Network, Typography, Identicon } from '@mycrypto/ui';

import { translateRaw } from 'translations';
import { ROUTE_PATHS } from 'v2/config';
import { truncate } from 'v2/utils';
import { BREAK_POINTS, COLORS } from 'v2/theme';
import { ExtendedAccount, AddressBook } from 'v2/types';
import {
  AccountContext,
  SettingsContext,
  getCurrentsFromContext,
  getLabelByAccount
} from 'v2/services/Store';
import { DashboardPanel } from './DashboardPanel';
import './AccountList.scss';

const Label = styled.span`
  display: flex;
  align-items: center;
  p {
    margin-right: 27px;
  }
`;

interface IFavoriteProps {
  favorited: boolean;
}

const FavoriteButton = styled(Button)`
  span {
    span {
      svg {
        path {
          fill: ${(props: IFavoriteProps) => (props.favorited ? COLORS.GOLD : 'white')};
          stroke: ${(props: IFavoriteProps) => (props.favorited ? COLORS.GOLD : '#7b8695')};
        }
      }
    }
  }
  align-self: flex-start;
  margin-left: 1em;
`;

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

const TableContainer = styled.div`
  display: block;
  max-height: 394px;
  overflow: auto;
`;

type DeleteAccount = (uuid: string) => void;
type UpdateAccount = (uuid: string, accountData: ExtendedAccount) => void;
interface AccountListProps {
  className?: string;
  currentsOnly?: boolean;
  deletable?: boolean;
  favoritable?: boolean;
  footerAction?: string | JSX.Element;
  footerActionLink?: string;
}

export default function AccountList(props: AccountListProps) {
  const { className, currentsOnly, deletable, favoritable, footerAction, footerActionLink } = props;
  const { settings } = useContext(SettingsContext);
  const { accounts, deleteAccount, updateAccount } = useContext(AccountContext);
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
      actionLink={ROUTE_PATHS.ADD_ACCOUNT.path}
      className={`AccountList ${className}`}
      footerAction={footerAction}
      footerActionLink={footerActionLink}
    >
      <TableContainer>
        <CollapsibleTable
          breakpoint={Number(BREAK_POINTS.SCREEN_XS)}
          {...buildAccountTable(
            currentsOnly ? currentAccounts : accounts,
            deleteAccount,
            updateAccount,
            deletable,
            favoritable
          )}
        />
      </TableContainer>
    </DashboardPanel>
  );
}

function buildAccountTable(
  accounts: ExtendedAccount[],
  deleteAccount: DeleteAccount,
  updateAccount: UpdateAccount,
  deletable?: boolean,
  favoritable?: boolean
) {
  const columns = [
    translateRaw('ACCOUNT_LIST_LABEL'),
    translateRaw('ACCOUNT_LIST_ADDRESS'),
    translateRaw('ACCOUNT_LIST_NETWORK'),
    translateRaw('ACCOUNT_LIST_VALUE')
  ];

  return {
    head: deletable ? [...columns, translateRaw('ACCOUNT_LIST_DELETE')] : columns,
    body: accounts.map((account, index) => {
      const addressCard: AddressBook | undefined = getLabelByAccount(account);
      const label = addressCard ? addressCard.label : 'Unknown Account';
      const bodyContent = [
        <Label key={index}>
          <Identicon address={account.address} />
          <span>{label}</span>
        </Label>,
        <Copyable key={index} text={account.address} truncate={truncate} />,
        <Network key={index} color="#a682ff">
          {account.network}
        </Network>,
        <Typography key={index}>{account.balance}</Typography>
      ];
      return deletable
        ? [
            ...bodyContent,
            <DeleteButton
              key={index}
              onClick={handleAccountDelete(deleteAccount, account.uuid)}
              icon="exit"
            />
          ]
        : favoritable
        ? [
            <FavoriteButton
              key={index}
              icon="star"
              favorited={account.favorite ? account.favorite : false}
              onClick={() =>
                updateAccount(account.uuid, {
                  ...account,
                  favorite: !account.favorite
                })
              }
            />,
            ...bodyContent
          ]
        : bodyContent;
    }),
    config: {
      primaryColumn: translateRaw('ACCOUNT_LIST_ADDRESS'),
      sortableColumn: translateRaw('ACCOUNT_LIST_ADDRESS'),
      sortFunction: (a: any, b: any) => {
        const aLabel = a.props.label;
        const bLabel = b.props.label;
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      },
      hiddenHeadings: deletable ? [translateRaw('ACCOUNT_LIST_DELETE')] : undefined,
      iconColumns: deletable ? [translateRaw('ACCOUNT_LIST_DELETE')] : undefined
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
