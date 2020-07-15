import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button, Identicon } from '@mycrypto/ui';
import isNumber from 'lodash/isNumber';
import cloneDeep from 'lodash/cloneDeep';

import { translateRaw } from '@translations';
import { ROUTE_PATHS, getWalletConfig } from '@config';
import {
  EthAddress,
  Network,
  RowDeleteOverlay,
  RouterLink,
  EditableText,
  UndoDeleteOverlay,
  FixedSizeCollapsibleTable
} from '@components';
import { truncate } from '@utils';
import { BREAK_POINTS, COLORS, SPACING, breakpointToNumber } from '@theme';
import { IAccount, StoreAccount, ExtendedAddressBook, WalletId, TUuid } from '@types';
import {
  AccountContext,
  getLabelByAccount,
  StoreContext,
  SettingsContext,
  AddressBookContext
} from '@services/Store';
import { RatesContext, useFeatureFlags } from '@services';
import { getFiat } from '@config/fiats';

import { DashboardPanel } from './DashboardPanel';
import { default as Currency } from './Currency';
import IconArrow from './IconArrow';
import Checkbox from './Checkbox';
import Tooltip from './Tooltip';
import informationalSVG from '@assets/images/icn-info-blue.svg';

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

const WalletLabelContainer = styled.ul`
  margin-bottom: 0;
  padding: 0;

  & li {
    &:not(:last-of-type) {
      margin-right: ${SPACING.XS};
    }
  }
`;

const StyledAccountLabel = styled.li`
  display: inline-block;
  text-align: center;
  border-radius: 600px;
  color: ${COLORS.WHITE};
  font-size: 0.7em;
  font-weight: normal;
  padding: 3px 6px;
`;

const WalletTypeLabel = styled(StyledAccountLabel)`
  background: ${COLORS.GREY};
`;

const PrivateWalletLabel = styled(StyledAccountLabel)`
  background: ${COLORS.PURPLE};
`;

const PrivacyCheckBox = styled(Checkbox)`
  display: flex;
  justify-content: center;
  margin-bottom: 0px;
  height: auto;
`;

const SIdenticon = styled(Identicon)`
  img {
    height: 2em;
    min-width: 2em;
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
  & img {
    margin-left: ${SPACING.XS};
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
          fill: ${(props: IFavoriteProps) => (props.favorited ? COLORS.GOLD : COLORS.WHITE)};
          stroke: ${(props: IFavoriteProps) => (props.favorited ? COLORS.GOLD : COLORS.GREY)};
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

const AccountListFooterWrapper = styled.div`
  & * {
    color: ${COLORS.BLUE_BRIGHT};
  }
  & img {
    height: 1.1em;
    margin-right: 0.5em;
  }
`;

const AddAccountButton = styled(Button)`
  color: ${COLORS.BLUE_BRIGHT};
  padding: ${SPACING.BASE};
  opacity: 1;
  &:hover {
    transition: 200ms ease all;
    transform: scale(1.02);
    opacity: 0.7;
  }
`;

const PrivateColumnLabel = styled.div`
  display: inline-block;
`;

const InformationalIcon = styled.img`
  margin-right: ${SPACING.XS};
  height: 16px;
`;

interface AccountListProps {
  accounts: StoreAccount[];
  className?: string;
  currentsOnly?: boolean;
  deletable?: boolean;
  favoritable?: boolean;
  copyable?: boolean;
  privacyCheckboxEnabled?: boolean;
  dashboard?: boolean;
}

export default function AccountList(props: AccountListProps) {
  const {
    accounts: displayAccounts,
    className,
    deletable,
    favoritable,
    copyable,
    privacyCheckboxEnabled = false,
    dashboard
  } = props;
  const { deleteAccountFromCache, restoreDeletedAccount, accountRestore } = useContext(
    StoreContext
  );
  const { updateAccount } = useContext(AccountContext);
  const [deletingIndex, setDeletingIndex] = useState<number | undefined>();
  const [undoDeletingIndexes, setUndoDeletingIndexes] = useState<[number, TUuid][]>([]);
  const overlayRows: [number[], [number, TUuid][]] = [
    isNumber(deletingIndex) ? [deletingIndex] : [],
    [...undoDeletingIndexes]
  ];

  const getDisplayAccounts = (): StoreAccount[] => {
    const accountsTemp = cloneDeep(displayAccounts);
    overlayRows[1]
      .sort((a, b) => a[0] - b[0])
      .forEach((index) => {
        accountsTemp.splice(index[0], 0, accountRestore[index[1]] as StoreAccount);
      });
    return accountsTemp.sort((a, b) => a.uuid.localeCompare(b.uuid));
  };

  // Verify if AccountList is used in Dashboard to display Settings button
  const actionLink = dashboard ? ROUTE_PATHS.SETTINGS.path : undefined;

  const Footer = () => {
    return (
      <AccountListFooterWrapper>
        <RouterLink to={ROUTE_PATHS.ADD_ACCOUNT.path}>
          <AddAccountButton basic={true}>{`+ ${translateRaw(
            'ACCOUNT_LIST_TABLE_ADD_ACCOUNT'
          )}`}</AddAccountButton>
        </RouterLink>
      </AccountListFooterWrapper>
    );
  };

  return (
    <DashboardPanel
      heading={
        <>
          {translateRaw('ACCOUNT_LIST_TABLE_ACCOUNTS')}{' '}
          <Tooltip tooltip={translateRaw('SETTINGS_ACCOUNTS_TOOLTIP')} />
        </>
      }
      actionLink={actionLink}
      className={`AccountList ${className}`}
      footer={<Footer />}
    >
      <FixedSizeCollapsibleTable
        breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
        maxHeight={'450px'}
        {...buildAccountTable(
          getDisplayAccounts(),
          deleteAccountFromCache,
          updateAccount,
          setUndoDeletingIndexes,
          restoreDeletedAccount,
          deletable,
          favoritable,
          copyable,
          privacyCheckboxEnabled,
          overlayRows,
          setDeletingIndex
        )}
      />
    </DashboardPanel>
  );
}

type ISortTypes =
  | 'label'
  | 'label-reverse'
  | 'address'
  | 'address-reverse'
  | 'network'
  | 'network-reverse'
  | 'value'
  | 'value-reverse';
type IColumnValues =
  | 'ACCOUNT_LIST_LABEL'
  | 'ACCOUNT_LIST_ADDRESS'
  | 'ACCOUNT_LIST_NETWORK'
  | 'ACCOUNT_LIST_VALUE';

export interface ISortingState {
  sortState: {
    ACCOUNT_LIST_LABEL: 'label' | 'label-reverse';
    ACCOUNT_LIST_ADDRESS: 'address' | 'address-reverse';
    ACCOUNT_LIST_NETWORK: 'network' | 'network-reverse';
    ACCOUNT_LIST_VALUE: 'value' | 'value-reverse';
  };
  activeSort: ISortTypes;
}

const initialSortingState: ISortingState = {
  sortState: {
    ACCOUNT_LIST_LABEL: 'label',
    ACCOUNT_LIST_ADDRESS: 'address',
    ACCOUNT_LIST_NETWORK: 'network',
    ACCOUNT_LIST_VALUE: 'value'
  },
  activeSort: 'value'
};

interface ITableFullAccountType {
  account: StoreAccount;
  index: number;
  label: string;
  total: number;
  addressCard: ExtendedAddressBook;
}

type TSortFunction = (a: ITableFullAccountType, b: ITableFullAccountType) => number;

const getSortingFunction = (sortKey: ISortTypes): TSortFunction => {
  switch (sortKey) {
    case 'value':
      return (a: ITableFullAccountType, b: ITableFullAccountType) => b.total - a.total;
    case 'value-reverse':
      return (a: ITableFullAccountType, b: ITableFullAccountType) => a.total - b.total;
    case 'label':
      return (a: ITableFullAccountType, b: ITableFullAccountType) => a.label.localeCompare(b.label);
    case 'label-reverse':
      return (a: ITableFullAccountType, b: ITableFullAccountType) => b.label.localeCompare(a.label);
    case 'address':
      return (a: ITableFullAccountType, b: ITableFullAccountType) =>
        a.account.address.localeCompare(b.account.address);
    case 'address-reverse':
      return (a: ITableFullAccountType, b: ITableFullAccountType) =>
        b.account.address.localeCompare(a.account.address);
    case 'network':
      return (a: ITableFullAccountType, b: ITableFullAccountType) =>
        a.account.networkId.localeCompare(b.account.networkId);
    case 'network-reverse':
      return (a: ITableFullAccountType, b: ITableFullAccountType) =>
        b.account.networkId.localeCompare(a.account.networkId);
  }
};

const buildAccountTable = (
  accounts: StoreAccount[],
  deleteAccount: (a: IAccount) => void,
  updateAccount: (u: TUuid, a: IAccount) => void,
  setUndoDeletingIndexes: Dispatch<SetStateAction<[number, TUuid][]>>,
  restoreDeletedAccount: (accountId: TUuid) => void,
  deletable?: boolean,
  favoritable?: boolean,
  copyable?: boolean,
  privacyCheckboxEnabled?: boolean,
  overlayRows?: [number[], [number, TUuid][]],
  setDeletingIndex?: any
) => {
  const { IS_ACTIVE_FEATURE } = useFeatureFlags();
  const [sortingState, setSortingState] = useState(initialSortingState);
  const { totalFiat } = useContext(StoreContext);
  const { getAssetRate } = useContext(RatesContext);
  const { settings } = useContext(SettingsContext);
  const { addressBook, updateAddressBooks, createAddressBooks } = useContext(AddressBookContext);
  const { toggleAccountPrivacy } = useContext(AccountContext);
  const overlayRowsFlat = [...overlayRows![0], ...overlayRows![1].map((row) => row[0])];

  const updateSortingState = (id: IColumnValues) => {
    // In case overlay active, disable changing sorting state
    if (overlayRowsFlat.length) return;

    const currentBtnState = sortingState.sortState[id];
    if (currentBtnState.indexOf('-reverse') > -1) {
      const newActiveSort = currentBtnState.split('-reverse')[0] as ISortTypes;
      setSortingState({
        sortState: {
          ...sortingState.sortState,
          [id]: newActiveSort
        },
        activeSort: newActiveSort
      });
    } else {
      const newActiveSort = (currentBtnState + '-reverse') as ISortTypes;
      setSortingState({
        sortState: {
          ...sortingState.sortState,
          [id]: newActiveSort
        },
        activeSort: newActiveSort
      });
    }
  };

  const getColumnSortDirection = (id: IColumnValues): boolean =>
    sortingState.sortState[id].indexOf('-reverse') > -1;

  const convertColumnToClickable = (id: IColumnValues) => (
    <div key={id} onClick={() => updateSortingState(id)}>
      {translateRaw(id)} <IconArrow isFlipped={getColumnSortDirection(id)} />
    </div>
  );

  const columns = [
    convertColumnToClickable('ACCOUNT_LIST_LABEL'),
    convertColumnToClickable('ACCOUNT_LIST_ADDRESS'),
    convertColumnToClickable('ACCOUNT_LIST_NETWORK'),
    <HeaderAlignment
      key={'ACCOUNT_LIST_VALUE'}
      align="center"
      onClick={() => updateSortingState('ACCOUNT_LIST_VALUE')}
    >
      {translateRaw('ACCOUNT_LIST_VALUE')}
      <IconArrow isFlipped={getColumnSortDirection('ACCOUNT_LIST_VALUE')} />
    </HeaderAlignment>,
    <HeaderAlignment key={'ACCOUNT_LIST_PRIVATE'} align="center">
      <PrivateColumnLabel>{translateRaw('ACCOUNT_LIST_PRIVATE')}</PrivateColumnLabel>
      <Tooltip tooltip={translateRaw('ACCOUNT_LIST_PRIVATE_TOOLTIP')} />
    </HeaderAlignment>,
    <HeaderAlignment key={'ACCOUNT_LIST_REMOVE'} align="center">
      {translateRaw('ACCOUNT_LIST_REMOVE')}
    </HeaderAlignment>
  ];

  const getFullTableData = accounts
    .map((account, index) => {
      const addressCard: ExtendedAddressBook | undefined = getLabelByAccount(account, addressBook);
      const total = totalFiat([account])(getAssetRate);
      const label = addressCard ? addressCard.label : translateRaw('NO_LABEL');
      return { account, index, label, total, addressCard };
    })
    .sort(getSortingFunction(sortingState.activeSort));

  const getColumns = (
    columnList: (string | JSX.Element)[],
    deletePresent: boolean,
    privacyPresent: boolean
  ) => {
    // Excludes both columns
    if (!deletePresent && !privacyPresent) {
      return columnList.slice(0, columnList.length - 2);
    }
    // Includes only the delete column, excludes the privacy tag column
    else if (deletePresent && !privacyPresent) {
      return [...columnList.slice(0, columnList.length - 2), columnList[columnList.length - 1]];
    }
    // Includes only the privacy tag column, excludes the delete column
    else if (!deletePresent && privacyPresent) {
      return columnList.slice(0, columnList.length - 1);
    }
    // Includes both delete && privacy tag column
    else {
      return columnList;
    }
  };

  return {
    head: getColumns(columns, deletable || false, privacyCheckboxEnabled || false),
    overlay: (rowIndex: number): JSX.Element => {
      const label = (l?: { label: string }) => (l ? l.label : translateRaw('NO_LABEL'));

      if (overlayRows && overlayRows[0].length && overlayRows[0][0] === rowIndex) {
        // Row delete overlay
        const addressBookRecord = getLabelByAccount(
          getFullTableData[rowIndex].account,
          addressBook
        )!;
        const { account } = getFullTableData[rowIndex];
        const { uuid, address } = account;
        return (
          <RowDeleteOverlay
            prompt={translateRaw('ACCOUNT_LIST_REMOVE_OVERLAY_TEXT', {
              $label: label(addressBookRecord),
              $address: truncate(address)
            })}
            deleteAction={() => {
              setDeletingIndex(undefined);
              setUndoDeletingIndexes((prev) => [...prev, [rowIndex, uuid]]);
              deleteAccount(account);
            }}
            cancelAction={() => setDeletingIndex(undefined)}
          />
        );
      } else if (
        overlayRows &&
        overlayRows[1].length &&
        overlayRows[1].map((row) => row[0]).includes(rowIndex)
      ) {
        // Undo delete overlay
        const addressBookRecord = getLabelByAccount(
          getFullTableData[rowIndex].account,
          addressBook
        )!;
        const {
          account: { uuid, address, wallet }
        } = getFullTableData[rowIndex];
        return (
          <UndoDeleteOverlay
            address={address}
            overlayText={translateRaw('ACCOUNT_LIST_UNDO_REMOVE_OVERLAY_TEXT', {
              $label: label(addressBookRecord),
              $walletId: getWalletConfig(wallet).name
            })}
            restoreAccount={() => {
              restoreDeletedAccount(uuid);
              setUndoDeletingIndexes((prev) => prev.filter((i) => i[0] !== rowIndex));
            }}
          />
        );
      }
      return <></>;
    },
    overlayRows: overlayRowsFlat,
    body: getFullTableData.map(({ account, index, label, total, addressCard }) => {
      let bodyContent = [
        <Label key={index}>
          <SIdenticon address={account.address} />
          <LabelWithWallet>
            <EditableText
              truncate={true}
              saveValue={(value) => {
                if (addressCard) {
                  updateAddressBooks(addressCard.uuid, { ...addressCard, label: value });
                } else {
                  createAddressBooks({
                    address: account.address,
                    label: value,
                    network: account.networkId,
                    notes: ''
                  });
                }
              }}
              value={label}
            />
            <WalletLabelContainer>
              {account.wallet === WalletId.VIEW_ONLY && (
                <Tooltip tooltip={translateRaw('VIEW_ONLY_WARNING_TOOLTIP')}>
                  <InformationalIcon src={informationalSVG} />
                </Tooltip>
              )}
              <WalletTypeLabel>{getWalletConfig(account.wallet).name}</WalletTypeLabel>
              {IS_ACTIVE_FEATURE.PRIVATE_TAGS && account.isPrivate && (
                <PrivateWalletLabel>{translateRaw('PRIVATE_ACCOUNT')}</PrivateWalletLabel>
              )}
            </WalletLabelContainer>
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
          symbol={getFiat(settings).symbol}
          code={getFiat(settings).code}
          decimals={2}
        />
      ];

      if (privacyCheckboxEnabled) {
        bodyContent = [
          ...bodyContent,
          <PrivacyCheckBox
            key={index}
            name={'Private'}
            checked={account.isPrivate || false}
            onChange={() => toggleAccountPrivacy(account.uuid)}
          />
        ];
      }

      if (deletable) {
        bodyContent = [
          ...bodyContent,
          <DeleteButton
            key={index}
            onClick={() =>
              setDeletingIndex(
                getFullTableData.findIndex((row) => row.account.uuid === accounts[index].uuid)
              )
            }
            icon="exit"
          />
        ];
      }

      if (favoritable) {
        bodyContent = [
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
        ];
      }

      return bodyContent;
    }),
    config: {
      primaryColumn: translateRaw('ACCOUNT_LIST_LABEL')
    }
  };
};
