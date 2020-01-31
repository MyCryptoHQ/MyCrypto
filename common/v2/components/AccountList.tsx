import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button, Identicon } from '@mycrypto/ui';

import { translateRaw } from 'v2/translations';
import { ROUTE_PATHS, Fiats, WALLETS_CONFIG } from 'v2/config';
import {
  EthAddress,
  CollapsibleTable,
  Network,
  RowDeleteOverlay,
  RouterLink,
  Typography
} from 'v2/components';
import { truncate } from 'v2/utils';
import { BREAK_POINTS, COLORS, breakpointToNumber } from 'v2/theme';
import { ExtendedAccount, AddressBook, StoreAccount } from 'v2/types';
import {
  AccountContext,
  getLabelByAccount,
  StoreContext,
  SettingsContext,
  AddressBookContext
} from 'v2/services/Store';
import { DashboardPanel } from './DashboardPanel';
import { RatesContext } from 'v2/services';
import { default as Currency } from './Currency';
import { TUuid } from 'v2/types/uuid';

const Label = styled.span`
  display: flex;
  align-items: center;
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-weight: bold;
  }
`;

const LabelWithWallet = styled.span`
  display: flex;
  flex-direction: column;
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-weight: bold;
  }
`;

const WalletTypeLabel = styled.div`
  background: ${COLORS.MIDDLE_GREY};
  display: inline-block;
  text-align: center;
  border-radius: 600px;
  font-size: 0.6em;
  padding: 3px 6px;
  color: ${COLORS.WHITE};
`;

const SIdenticon = styled(Identicon)`
  img {
    height: 2em;
  }
  margin-right: 0.8em;
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-right: 1em;
  }
`;

// On mobile screen the CollapisableTable becomes a Stacked card.
// We provide better styles for desktop screens
const CurrencyContainer = styled(Currency)`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    float: right;
  }
`;

const HeaderAlignment = styled.div`
  ${(props: { align?: string }) => css`
    @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
      text-align: ${props.align || 'inherit'};
    }
  `};
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
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  width: 100%;
`;

const TableContainer = styled.div`
  display: block;
  max-height: 394px;
  overflow: auto;
`;

const AccountListFooterWrapper = styled.div`
  & * {
    color: ${COLORS.BRIGHT_SKY_BLUE};
  }
  & img {
    height: 1.1em;
    margin-right: 0.5em;
  }
`;

interface AccountListProps {
  accounts: StoreAccount[];
  className?: string;
  currentsOnly?: boolean;
  deletable?: boolean;
  favoritable?: boolean;
  copyable?: boolean;
  dashboard?: boolean;
}

export const screenIsMobileSized = (breakpoint: number): boolean =>
  window.matchMedia(`(max-width: ${breakpoint}px)`).matches;

export default function AccountList(props: AccountListProps) {
  const {
    accounts: displayAccounts,
    className,
    deletable,
    favoritable,
    copyable,
    dashboard
  } = props;
  const { deleteAccountFromCache } = useContext(StoreContext);
  const { updateAccount } = useContext(AccountContext);
  const [deletingIndex, setDeletingIndex] = useState();
  const overlayRows = [deletingIndex];

  // Verify if AccountList is used in Dashboard to display Settings button
  const headingRight = dashboard ? translateRaw('SETTINGS_HEADING') : undefined;
  const actionLink = dashboard ? ROUTE_PATHS.SETTINGS.path : undefined;

  const Footer = () => {
    return (
      <AccountListFooterWrapper>
        <RouterLink to={ROUTE_PATHS.ADD_ACCOUNT.path}>
          <Typography>{`+ ${translateRaw('ACCOUNT_LIST_TABLE_ADD_ACCOUNT')}`}</Typography>
        </RouterLink>
      </AccountListFooterWrapper>
    );
  };

  return (
    <DashboardPanel
      heading={translateRaw('ACCOUNT_LIST_TABLE_ACCOUNTS')}
      headingRight={headingRight}
      actionLink={actionLink}
      className={`AccountList ${className}`}
      footer={<Footer />}
    >
      <TableContainer>
        <CollapsibleTable
          breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
          {...buildAccountTable(
            displayAccounts,
            deleteAccountFromCache,
            updateAccount,
            deletable,
            favoritable,
            copyable,
            overlayRows,
            setDeletingIndex
          )}
        />
      </TableContainer>
    </DashboardPanel>
  );
}

function buildAccountTable(
  accounts: StoreAccount[],
  deleteAccount: (a: ExtendedAccount) => void,
  updateAccount: (u: TUuid, a: ExtendedAccount) => void,
  deletable?: boolean,
  favoritable?: boolean,
  copyable?: boolean,
  overlayRows?: number[],
  setDeletingIndex?: any
) {
  const { totalFiat } = useContext(StoreContext);
  const { getAssetRate } = useContext(RatesContext);
  const { settings } = useContext(SettingsContext);
  const { addressBook } = useContext(AddressBookContext);

  const columns = [
    translateRaw('ACCOUNT_LIST_LABEL'),
    translateRaw('ACCOUNT_LIST_ADDRESS'),
    translateRaw('ACCOUNT_LIST_NETWORK'),
    <HeaderAlignment key={'ACCOUNT_LIST_VALUE'} align="center">
      {translateRaw('ACCOUNT_LIST_VALUE')}
    </HeaderAlignment>,
    <HeaderAlignment key={'ACCOUNT_LIST_DELETE'} align="center">
      {translateRaw('ACCOUNT_LIST_DELETE')}
    </HeaderAlignment>
  ];

  return {
    head: deletable ? columns : columns.slice(0, columns.length - 1),
    overlay:
      overlayRows && overlayRows[0] !== undefined ? (
        <RowDeleteOverlay
          prompt={`Are you sure you want to delete
              ${
                getLabelByAccount(accounts[overlayRows[0]], addressBook) !== undefined
                  ? getLabelByAccount(accounts[overlayRows[0]], addressBook)!.label
                  : ''
              } account with address: ${accounts[overlayRows[0]].address} ?`}
          deleteAction={() => {
            deleteAccount(accounts[overlayRows[0]]);
            setDeletingIndex(undefined);
          }}
          cancelAction={() => setDeletingIndex(undefined)}
        />
      ) : (
        <></>
      ),
    overlayRows,
    body: accounts.map((account, index) => {
      const addressCard: AddressBook | undefined = getLabelByAccount(account, addressBook);
      const total = totalFiat([account])(getAssetRate);
      const label = addressCard ? addressCard.label : 'Unknown Account';
      const bodyContent = [
        <Label key={index}>
          <SIdenticon address={account.address} />
          <LabelWithWallet>
            <Typography value={label} />
            <div>
              <WalletTypeLabel>{WALLETS_CONFIG[account.wallet].name}</WalletTypeLabel>
            </div>
          </LabelWithWallet>
        </Label>,
        <EthAddress
          key={index}
          address={account.address}
          truncate={truncate}
          isCopyable={copyable}
        />,
        <Network key={index} color="#a682ff">
          {account.networkId}
        </Network>,
        <CurrencyContainer
          key={index}
          amount={total.toString()}
          symbol={Fiats[settings.fiatCurrency].symbol}
          prefix={Fiats[settings.fiatCurrency].prefix}
          decimals={2}
        />
      ];
      return deletable
        ? [
            ...bodyContent,
            <DeleteButton key={index} onClick={() => setDeletingIndex(index)} icon="exit" />
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
      primaryColumn: translateRaw('ACCOUNT_LIST_LABEL'),
      sortableColumn: translateRaw('ACCOUNT_LIST_LABEL'),
      sortFunction: (a: any, b: any) => {
        const aLabel = a.props.label;
        const bLabel = b.props.label;
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      }
    }
  };
}
