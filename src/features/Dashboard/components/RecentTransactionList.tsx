import styled from 'styled-components';

import approval from '@assets/images/transactions/approval.svg';
import contractDeploy from '@assets/images/transactions/contract-deploy.svg';
import contractInteract from '@assets/images/transactions/contract-interact.svg';
import defizap from '@assets/images/transactions/defizap.svg';
import inbound from '@assets/images/transactions/inbound.svg';
import membershipPurchase from '@assets/images/transactions/membership-purchase.svg';
import outbound from '@assets/images/transactions/outbound.svg';
import swap from '@assets/images/transactions/swap.svg';
import transfer from '@assets/images/transactions/transfer.svg';
import {
  Account,
  Amount,
  AssetIcon,
  Box,
  DashboardPanel,
  EditableAccountLabel,
  FixedSizeCollapsibleTable,
  Icon,
  LinkApp
} from '@components';
import { ROUTE_PATHS } from '@config';
import { getFiat } from '@config/fiats';
import { ITxHistoryEntry, useRates, useSettings } from '@services';
import { txIsFailed, txIsPending, txIsSuccessful } from '@services/Store/helpers';
import { getMergedTxHistory, useSelector } from '@store';
import { getTxTypeMetas, ITxMetaTypes } from '@store/txHistory.slice';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';
import { Asset, ITxStatus, ITxTypeMeta, StoreAccount, TxType } from '@types';
import { bigify, convertToFiat, isSameAddress, useScreenSize } from '@utils';

import { ITxHistoryType } from '../types';
import NoTransactions from './NoTransactions';
import TransactionLabel from './TransactionLabel';

interface Props {
  className?: string;
  accountsList: StoreAccount[];
}

interface ITxTypeConfigObj {
  icon(): any;
  label(asset: Asset): string;
}

// type ITxTypeConfig = {
//   [txType in ITxHistoryType]: ITxTypeConfigObj;
// };

const deriveTxType = (txTypeMetas: ITxMetaTypes, txType: TxType): ITxTypeMeta => {
  if (txTypeMetas[txType]) {
    return txTypeMetas[txType];
  }
  switch (txType) {
    default:
      return {
        type: txType,
        protocol: 'base'
      };
    case ITxHistoryType.APPROVAL:
      return {
        type: txType,
        protocol: 'ERC20'
      };
  }
};

// @todo: figure out what we need to manually configure here
const constructTxTypeConfig = ({ type, protocol }: ITxTypeMeta): ITxTypeConfigObj => ({
  label: (asset: Asset) => {
    switch (type) {
      default:
        return translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
          $platform: translateRaw(protocol, { $ticker: asset.ticker }),
          $action: translateRaw(`PLATFORM_${type}`, { $ticker: asset.ticker })
        });
      case "GENERIC_CONTRACT_CALL" as ITxHistoryType:
      case ITxHistoryType.CONTRACT_INTERACT:
        return translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        });
      case ITxHistoryType.INBOUND:
        return translateRaw('RECENT_TX_LIST_LABEL_RECEIVED', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        });
      case ITxHistoryType.OUTBOUND:
        return translateRaw('RECENT_TX_LIST_LABEL_SENT', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        });
      case ITxHistoryType.TRANSFER:
        return translateRaw('RECENT_TX_LIST_LABEL_TRANSFERRED', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        });
      case ITxHistoryType.REP_TOKEN_MIGRATION:
      case ITxHistoryType.GOLEM_TOKEN_MIGRATION:
      case ITxHistoryType.ANT_TOKEN_MIGRATION:
        return translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
          $platform: translateRaw(protocol, { $ticker: asset.ticker }),
          $action: translateRaw(`PLATFORM_MIGRATION`, { $ticker: asset.ticker })
        });
      case ITxHistoryType.PURCHASE_MEMBERSHIP:
        return translateRaw('PLATFORM_MEMBERSHIP_PURCHASED');
    }
  },
  icon: () => {
    // @todo: figure this icon switching shit out.
    switch (type) {
      case 'DEPOSIT':
      case 'WITHDRAW':
      case 'DEPOSIT_TOKEN':
      case 'ROUTER_TO':
      case 'BORROW':
      case 'REPAY':
      case 'MINT':
      case 'NAME_REGISTERED':
      case 'NAME_RENEWED':
      case 'CANCEL_ORDER':
      case 'GENERIC_CONTRACT_CALL':
      case 'CONTRACT_INTERACT':
        return contractInteract;
      case 'EXCHANGE':
      case 'BRIDGE_IN':
      case 'BRIDGE_OUT':
        return swap;
      case 'APPROVAL':
      case 'APPROVE':
        return approval;
      case 'FAUCET':
      case 'MINING_PAYOUT':
      case 'CLAIM':
      case 'INBOUND':
        return inbound;
      case 'OUTBOUND':
        return outbound;
      case 'PURCHASE_MEMBERSHIP':
        return membershipPurchase;
      case 'DEFIZAP':
        return defizap;
      case 'CONTRACT_DEPLOY':
        return contractDeploy;
      default:
        return transfer;
    }
  }
});

const SAssetIcon = styled(AssetIcon)`
  filter: grayscale(1); /* W3C */
`;

const CCircle = styled('div')`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.GREY_LIGHTEST};
  border: 3px solid #ffffff;
  bottom: -9px;
  right: -9px;
  border-radius: 50%;
  z-index: 2;
  height: 24px;
  width: 24px;
`;
const SCombinedCircle = (asset: Asset) => {
  return (
    <CCircle>
      <SAssetIcon uuid={asset.uuid} size={'16px'} />
    </CCircle>
  );
};

const makeTxIcon = (txConfig: ITxTypeConfigObj, asset: Asset) => {
  const greyscaleIcon = asset && <>{SCombinedCircle(asset)}</>;
  const baseIcon = (
    <Box mr="16px" position="relative">
      <img src={txConfig ? txConfig.icon() : transfer} width="36px" height="36px" />
      {greyscaleIcon}
    </Box>
  );
  return baseIcon;
};

export default function RecentTransactionList({ accountsList, className = '' }: Props) {
  const { getAssetRate } = useRates();
  const { settings } = useSettings();
  const txTypeMetas = useSelector(getTxTypeMetas);
  const txHistory = useSelector(getMergedTxHistory);
  const { isMobile } = useScreenSize();

  const accountTxs = txHistory
    .filter((tx) =>
      accountsList.some((a) => isSameAddress(a.address, tx.to) || isSameAddress(a.address, tx.from))
    )
    .map(({ txType, ...tx }) => ({ ...tx, txType: txType as TxType }));

  const pending = accountTxs.filter(txIsPending);
  const completed = accountTxs.filter(txIsSuccessful);
  const failed = accountTxs.filter(txIsFailed);

  const createEntries = (_: string, collection: ITxHistoryEntry[]) =>
    collection.map(
      ({
        timestamp,
        hash,
        status,
        from,
        to,
        receiverAddress,
        amount,
        asset,
        fromAddressBookEntry,
        toAddressBookEntry,
        networkId,
        txType
      }) => {
        const labelFromProps = {
          addressBookEntry: fromAddressBookEntry,
          address: from,
          networkId
        };
        const recipient = receiverAddress || to;
        const labelToProps = {
          addressBookEntry: toAddressBookEntry,
          address: recipient,
          networkId
        };
        const entryConfig = constructTxTypeConfig(deriveTxType(txTypeMetas, txType));
        return [
          <TransactionLabel
            key={0}
            image={makeTxIcon(entryConfig, asset)}
            label={entryConfig.label(asset)}
            stage={status}
            date={timestamp}
          />,
          <Account
            key={1}
            title={<EditableAccountLabel {...labelFromProps} />}
            truncate={true}
            address={from}
          />,
          recipient && (
            <Account
              key={2}
              title={<EditableAccountLabel {...labelToProps} />}
              truncate={true}
              address={recipient}
            />
          ),
          <Box key={3}>
            <Amount
              // Adapt alignment for mobile display
              alignLeft={isMobile}
              asset={{
                amount: bigify(amount).toFixed(5),
                ticker: asset.ticker
              }}
              fiat={{
                symbol: getFiat(settings).symbol,
                ticker: getFiat(settings).ticker,
                amount: convertToFiat(amount, getAssetRate(asset)).toFixed(2)
              }}
            />
          </Box>,
          <Box key={4} variant="rowCenter">
            <LinkApp href={`${ROUTE_PATHS.TX_STATUS.path}/?hash=${hash}&network=${networkId}`}>
              {isMobile ? (
                translateRaw('RECENT_TRANSACTIONS_VIEW_MORE')
              ) : (
                <Icon
                  type="more"
                  alt="View more information about this transaction"
                  height="24px"
                />
              )}
            </LinkApp>
          </Box>
        ];
      }
    );

  const groups = [
    {
      title: 'Pending',
      entries: createEntries(ITxStatus.PENDING, pending)
    },
    {
      title: 'Completed',
      entries: createEntries(ITxStatus.SUCCESS, completed)
    },
    {
      title: 'Failed',
      entries: createEntries(ITxStatus.FAILED, failed)
    }
  ];
  const filteredGroups = groups.filter((group) => group.entries.length !== 0);

  const recentTransactionsTable = {
    head: [
      translateRaw('RECENT_TRANSACTIONS_DATE') || 'Date',
      translateRaw('RECENT_TRANSACTIONS_FROM_ADDRESS'),
      translateRaw('RECENT_TRANSACTIONS_TO_ADDRESS'),
      translateRaw('RECENT_TRANSACTIONS_TO_AMOUNT'),
      ''
    ],
    body: [],
    groups: filteredGroups,
    config: {
      primaryColumn: translateRaw('RECENT_TRANSACTIONS_DATE'),
      sortableColumn: translateRaw('RECENT_TRANSACTIONS_DATE'),
      sortFunction: () => (a: any, b: any) => b.props.date - a.props.date,
      hiddenHeadings: [translateRaw('RECENT_TRANSACTIONS_VIEW_MORE')],
      iconColumns: [translateRaw('RECENT_TRANSACTIONS_VIEW_MORE')],
      reversedColumns: [translateRaw('RECENT_TRANSACTIONS_TO_AMOUNT')]
    }
  };
  return (
    <DashboardPanel heading="Recent Transactions" className={`RecentTransactionsList ${className}`}>
      {filteredGroups.length >= 1 ? (
        <FixedSizeCollapsibleTable breakpoint={1000} {...recentTransactionsTable} />
      ) : (
        NoTransactions()
      )}
    </DashboardPanel>
  );
}
