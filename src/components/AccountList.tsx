import { Dispatch, SetStateAction, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isNumber from 'lodash/isNumber';
import styled from 'styled-components';

import informationalSVG from '@assets/images/icn-info-blue.svg';
import {
  Box,
  EditableAccountLabel,
  EthAddress,
  FixedSizeCollapsibleTable,
  Icon,
  LinkApp,
  Network,
  RowDeleteOverlay,
  SkeletonLoader,
  Text,
  UndoDeleteOverlay
} from '@components';
import { getKBHelpArticle, getWalletConfig, KB_HELP_ARTICLE, ROUTE_PATHS } from '@config';
import { getFiat } from '@config/fiats';
import { useFeatureFlags, useRates } from '@services';
import {
  getLabelByAccount,
  useAccounts,
  useContacts,
  useNetworks,
  useSettings
} from '@services/Store';
import { calculateTotalFiat } from '@services/Store/helpers';
import {
  deleteAccount,
  getAccountUndoCache,
  isScanning as isScanningSelector,
  restoreAccount,
  useDispatch,
  useSelector
} from '@store';
import { BREAK_POINTS, breakpointToNumber, COLORS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { Bigish, ExtendedContact, StoreAccount, TUuid, WalletId } from '@types';
import { truncate, useScreenSize } from '@utils';

import Checkbox from './Checkbox';
import { default as Currency } from './Currency';
import { DashboardPanel } from './DashboardPanel';
import { Identicon } from './Identicon';
import Tooltip from './Tooltip';

const SDashboardPanel = styled(DashboardPanel)<{ dashboard?: boolean }>`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    ${({ dashboard }) => dashboard && `height: 508px;`}
  }
`;

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
    min-width: 190px;
  }
`;

const WalletLabelContainer = styled.ul`
  margin: 0;
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
  margin-bottom: 0px;
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

// On mobile screen the CollapsibleTable becomes a Stacked card.
// We provide better styles for desktop screens
const CurrencyContainer = styled(Currency)`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    float: right;
  }
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
  copyable?: boolean;
  privacyCheckboxEnabled?: boolean;
  dashboard?: boolean;
}

export default function AccountList(props: AccountListProps) {
  const {
    accounts: displayAccounts,
    className,
    deletable,
    copyable,
    privacyCheckboxEnabled = false,
    dashboard
  } = props;
  const accountRestore = useSelector(getAccountUndoCache);
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

  return (
    <SDashboardPanel
      dashboard={dashboard}
      heading={
        <Box variant="rowAlign">
          {translateRaw('ACCOUNT_LIST_TABLE_ACCOUNTS')}{' '}
          <Tooltip ml="0.5ch" width="16px" tooltip={translateRaw('SETTINGS_ACCOUNTS_TOOLTIP')} />
        </Box>
      }
      headingRight={
        <Box variant="rowAlign">
          {dashboard && (
            <LinkApp href={ROUTE_PATHS.SETTINGS.path} mr={SPACING.BASE} variant="opacityLink">
              <Box variant="rowAlign">
                <Icon type="edit" width="1em" color="BLUE_SKY" />
                <Text ml={SPACING.XS} mb={0}>
                  {translateRaw('EDIT')}
                </Text>
              </Box>
            </LinkApp>
          )}
          <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT.path} variant="opacityLink">
            <Box variant="rowAlign">
              <Icon type="add-bold" width="1em" />
              <Text ml={SPACING.XS} mb={0}>
                {translateRaw('ADD')}
              </Text>
            </Box>
          </LinkApp>
        </Box>
      }
      className={`AccountList ${className}`}
      data-testid="account-list"
    >
      <FixedSizeCollapsibleTable
        breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
        maxHeight={'430px'}
        {...BuildAccountTable(
          getDisplayAccounts(),
          setUndoDeletingIndexes,
          deletable,
          copyable,
          privacyCheckboxEnabled,
          overlayRows,
          setDeletingIndex
        )}
      />
    </SDashboardPanel>
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
  total: Bigish;
  addressCard: ExtendedContact;
}

type TSortFunction = (a: ITableFullAccountType, b: ITableFullAccountType) => number;

const getSortingFunction = (sortKey: ISortTypes): TSortFunction => {
  switch (sortKey) {
    case 'value':
      return (a: ITableFullAccountType, b: ITableFullAccountType) => b.total.comparedTo(a.total);
    case 'value-reverse':
      return (a: ITableFullAccountType, b: ITableFullAccountType) => a.total.comparedTo(b.total);
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

const BuildAccountTable = (
  accounts: StoreAccount[],
  setUndoDeletingIndexes: Dispatch<SetStateAction<[number, TUuid][]>>,
  deletable?: boolean,
  copyable?: boolean,
  privacyCheckboxEnabled?: boolean,
  overlayRows?: [number[], [number, TUuid][]],
  setDeletingIndex?: any
) => {
  const { isMobile } = useScreenSize();
  const { featureFlags } = useFeatureFlags();
  const [sortingState, setSortingState] = useState(initialSortingState);
  const isScanning = useSelector(isScanningSelector);
  const { getAssetRate } = useRates();
  const { settings } = useSettings();
  const { contacts } = useContacts();
  const { getNetworkById } = useNetworks();
  const { toggleAccountPrivacy } = useAccounts();
  const overlayRowsFlat = [...overlayRows![0], ...overlayRows![1].map((row) => row[0])];
  const dispatch = useDispatch();

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

  const convertColumnToClickable = (id: IColumnValues, options?: { isReversed: boolean }) =>
    isMobile ? (
      translateRaw(id)
    ) : (
      <Box
        variant="rowAlign"
        key={id}
        onClick={() => updateSortingState(id)}
        width="100%"
        justifyContent={options?.isReversed ? 'flex-end' : undefined}
      >
        <Text as="span" textTransform="uppercase" fontSize="14px" letterSpacing="0.0625em">
          {translateRaw(id)}
        </Text>
        <Icon
          ml="0.3ch"
          type="sort"
          isActive={getColumnSortDirection(id)}
          size="1em"
          color="linkAction"
        />
      </Box>
    );

  const columns = [
    convertColumnToClickable('ACCOUNT_LIST_LABEL'),
    convertColumnToClickable('ACCOUNT_LIST_ADDRESS'),
    convertColumnToClickable('ACCOUNT_LIST_NETWORK'),
    convertColumnToClickable('ACCOUNT_LIST_VALUE', { isReversed: true }),
    <Box variant={isMobile ? 'rowAlign' : 'rowCenter'} key={'ACCOUNT_LIST_PRIVATE'} width="100%">
      <Text as="span" textTransform="uppercase" fontSize="14px" letterSpacing="0.0625em">
        {translateRaw('ACCOUNT_LIST_PRIVATE')}
      </Text>
      <Tooltip
        mt={
          isMobile ? '0' : '4px'
        } /* Hack to get the tooltip to align with text of a different size. */
        paddingLeft={SPACING.XS}
        tooltip={translate('ACCOUNT_LIST_PRIVATE_TOOLTIP', {
          $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_USE_MYCRYPTO_MORE_PRIVATELY)
        })}
      />
    </Box>,
    isMobile ? (
      translateRaw('ACCOUNT_LIST_REMOVE')
    ) : (
      <Box variant="columnCenter" key={'ACCOUNT_LIST_REMOVE'} width="100%">
        <Text as="span" textTransform="uppercase" fontSize="14px" letterSpacing="0.0625em">
          {translateRaw('ACCOUNT_LIST_REMOVE')}
        </Text>
      </Box>
    )
  ];

  const getFullTableData = accounts
    .map((account, index) => {
      const addressCard: ExtendedContact | undefined = getLabelByAccount(account, contacts);
      const total = calculateTotalFiat([account])(getAssetRate);
      return {
        account,
        index,
        total,
        addressCard,
        label: addressCard ? addressCard.label : translateRaw('NO_LABEL')
      };
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
    head: getColumns(columns, deletable ?? false, privacyCheckboxEnabled ?? false),
    overlay: ({ indexKey }: { indexKey: number }) => {
      const label = (l?: { label: string }) => (l ? l.label : translateRaw('NO_LABEL'));

      if (overlayRows && overlayRows[0].length && overlayRows[0][0] === indexKey) {
        // Row delete overlay
        const addressBookRecord = getLabelByAccount(getFullTableData[indexKey].account, contacts)!;
        const { account } = getFullTableData[indexKey];
        const { uuid, address } = account;
        return (
          <RowDeleteOverlay
            prompt={translateRaw('ACCOUNT_LIST_REMOVE_OVERLAY_TEXT', {
              $label: label(addressBookRecord),
              $address: truncate(address)
            })}
            deleteAction={() => {
              setDeletingIndex(undefined);
              setUndoDeletingIndexes((prev) => [...prev, [indexKey, uuid]]);
              dispatch(deleteAccount(account));
            }}
            cancelAction={() => setDeletingIndex(undefined)}
          />
        );
      } else if (
        overlayRows &&
        overlayRows[1].length &&
        overlayRows[1].map((row) => row[0]).includes(indexKey)
      ) {
        // Undo delete overlay
        const addressBookRecord = getLabelByAccount(getFullTableData[indexKey].account, contacts)!;
        const {
          account: { uuid, address, wallet }
        } = getFullTableData[indexKey];
        return (
          <UndoDeleteOverlay
            address={address}
            overlayText={translateRaw('ACCOUNT_LIST_UNDO_REMOVE_OVERLAY_TEXT', {
              $label: label(addressBookRecord),
              $walletId: getWalletConfig(wallet).name
            })}
            restoreAccount={() => {
              dispatch(restoreAccount(uuid));
              setUndoDeletingIndexes((prev) => prev.filter((i) => i[0] !== indexKey));
            }}
          />
        );
      }
      return <></>;
    },
    overlayRows: overlayRowsFlat,
    body: getFullTableData.map(({ account, index, total, addressCard }) => {
      let bodyContent = [
        <Label key={index}>
          <SIdenticon address={account.address} />
          <LabelWithWallet>
            <EditableAccountLabel
              addressBookEntry={addressCard}
              address={account.address}
              networkId={account.networkId}
            />
            <WalletLabelContainer>
              {account.wallet === WalletId.VIEW_ONLY && (
                <Tooltip tooltip={translateRaw('VIEW_ONLY_WARNING_TOOLTIP')}>
                  <InformationalIcon src={informationalSVG} />
                </Tooltip>
              )}
              <WalletTypeLabel>{getWalletConfig(account.wallet).name}</WalletTypeLabel>
              {featureFlags.PRIVATE_TAGS && account.isPrivate && (
                <PrivateWalletLabel>{translateRaw('PRIVATE_ACCOUNT')}</PrivateWalletLabel>
              )}
            </WalletLabelContainer>
          </LabelWithWallet>
        </Label>,
        <EthAddress key={index} address={account.address} truncate={true} isCopyable={copyable} />,
        <Network key={index} color={account?.network?.color ?? COLORS.LIGHT_PURPLE}>
          {getNetworkById(account.networkId)?.name ?? account.networkId}
        </Network>,
        isScanning ? (
          <SkeletonLoader type="account-list-value" />
        ) : (
          <CurrencyContainer
            key={index}
            amount={total.toString()}
            symbol={getFiat(settings).symbol}
            ticker={getFiat(settings).ticker}
            decimals={2}
          />
        )
      ];

      if (privacyCheckboxEnabled) {
        bodyContent = [
          ...bodyContent,
          <Box key={index} variant={!isMobile ? 'rowCenter' : undefined}>
            <PrivacyCheckBox
              name={'Private'}
              marginLeft="0"
              checked={account.isPrivate ?? false}
              onChange={() => toggleAccountPrivacy(account.uuid)}
            />
          </Box>
        ];
      }

      if (deletable) {
        bodyContent = [
          ...bodyContent,
          <>
            {isMobile ? (
              <Box key={index}>
                <LinkApp
                  href="#"
                  onClick={() =>
                    setDeletingIndex(
                      getFullTableData.findIndex((row) => row.account.uuid === accounts[index].uuid)
                    )
                  }
                >
                  {translateRaw('ACCOUNT_LIST_REMOVE')}
                </LinkApp>
              </Box>
            ) : (
              <Box key={index} variant="rowCenter">
                <Icon
                  type="delete"
                  size="0.8em"
                  onClick={() =>
                    setDeletingIndex(
                      getFullTableData.findIndex((row) => row.account.uuid === accounts[index].uuid)
                    )
                  }
                />
              </Box>
            )}
          </>
        ];
      }

      return bodyContent;
    }),
    config: {
      primaryColumn: translateRaw('ACCOUNT_LIST_LABEL')
    }
  };
};
