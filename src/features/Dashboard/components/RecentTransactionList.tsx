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
import { getTxTypeMeta } from '@store/txHistory.slice';
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
  icon: any;
  label(asset: Asset): string;
}

// type ITxTypeConfig = {
//   [txType in ITxHistoryType]: ITxTypeConfigObj;
// };

const DEFAULT_TX_TYPE_META: ITxTypeMeta = {
  type: "", // @todo: set this up
  protocol: ""
}

// @todo: figure out what we need to manually configure here
const constructTxTypeConfig = ({ type, protocol }: ITxTypeMeta): ITxTypeConfigObj => ({
  label: (asset: Asset) => {
    switch (type) {
      default:
        return translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
          $platform: translateRaw(protocol, { $ticker: asset.ticker }),
          $action: translateRaw(`PLATFORM_${type}`, { $ticker: asset.ticker })
        })
      case ITxHistoryType.INBOUND:
        return translateRaw('RECENT_TX_LIST_LABEL_RECEIVED', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        })
      case ITxHistoryType.OUTBOUND:
        return translateRaw('RECENT_TX_LIST_LABEL_SENT', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        })
      case ITxHistoryType.TRANSFER:
        return translateRaw('RECENT_TX_LIST_LABEL_TRANSFERRED', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        })    
      case ITxHistoryType.REP_TOKEN_MIGRATION:
      case ITxHistoryType.GOLEM_TOKEN_MIGRATION:
      case ITxHistoryType.ANT_TOKEN_MIGRATION:
        return translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
          $platform: translateRaw(protocol, { $ticker: asset.ticker }),
          $action: translateRaw(`PLATFORM_MIGRATION`, { $ticker: asset.ticker })
        })
    }
  },
  icon: (() => { // @todo: figure this icon switching shit out.
    switch (type) {
      case "DEPOSIT":
      case "WITHDRAW":
      case "DEPOSIT_TOKEN":
      case "ROUTER_TO":
      case "BORROW":
      case "REPAY":
      case "MINT":
      case "CONTRACT_INTERACT":
        return contractInteract;
      case "EXCHANGE":
        return swap;
      case "APPROVE":
        return approval;
      case "FAUCET":
      case "MINING_PAYOUT":
      case "INBOUND":
        return inbound;
      case "OUTBOUND":
        return outbound;
      case "PURCHASE_MEMBERSHIP":
        return membershipPurchase;
      case "DEFIZAP":
        return defizap;
      case "CONTRACT_DEPLOY":
        return contractDeploy;
      default:
        return transfer;
    }
  })
});

// const TxTypeConfig: ITxTypeConfig = {
//   [ITxHistoryType.INBOUND]: {
//     label: (asset: Asset) =>
//       translateRaw('RECENT_TX_LIST_LABEL_RECEIVED', {
//         $ticker: asset.ticker || translateRaw('UNKNOWN')
//       }),
//     icon: inbound
//   },
//   [ITxHistoryType.OUTBOUND]: {
//     label: (asset: Asset) =>
//       translateRaw('RECENT_TX_LIST_LABEL_SENT', {
//         $ticker: asset.ticker || translateRaw('UNKNOWN')
//       }),
//     icon: outbound
//   },
//   [ITxHistoryType.TRANSFER]: {
//     label: (asset: Asset) =>
//       translateRaw('RECENT_TX_LIST_LABEL_TRANSFERRED', {
//         $ticker: asset.ticker || translateRaw('UNKNOWN')
//       }),
//     icon: transfer
//   },
//   [ITxHistoryType.REP_TOKEN_MIGRATION]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_REP_MIGRATION'),
//     icon: transfer
//   },
//   [ITxHistoryType.AAVE_TOKEN_MIGRATION]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_AAVE_MIGRATION'),
//     icon: transfer
//   },
//   [ITxHistoryType.ANT_TOKEN_MIGRATION]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_ANT_MIGRATION'),
//     icon: transfer
//   },
//   [ITxHistoryType.GOLEM_TOKEN_MIGRATION]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_GOLEM_MIGRATION'),
//     icon: transfer
//   },
//   [ITxHistoryType.DEFIZAP]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_DEFIZAP_ADD'),
//     icon: defizap
//   },
//   [ITxHistoryType.PURCHASE_MEMBERSHIP]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_MEMBERSHIP_PURCHASED'),
//     icon: membershipPurchase
//   },
//   [ITxHistoryType.SWAP]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_SWAP'),
//     icon: swap
//   },
//   [ITxHistoryType.APPROVAL]: {
//     label: (asset: Asset) =>
//       translateRaw('RECENT_TX_LIST_LABEL_APPROVAL', { $ticker: asset.ticker }),
//     icon: approval
//   },
//   [ITxHistoryType.CONTRACT_INTERACT]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT'),
//     icon: contractInteract
//   },
//   [ITxHistoryType.DEPLOY_CONTRACT]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_DEPLOY'),
//     icon: contractDeploy
//   },
//   [ITxHistoryType.FAUCET]: {
//     label: (asset: Asset) =>
//       translateRaw('RECENT_TX_LIST_LABEL_RECEIVED', {
//         $ticker: asset.ticker || translateRaw('UNKNOWN')
//       }),
//     icon: inbound
//   },
//   [ITxHistoryType.ONE_INCH_EXCHANGE]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('ONE_INCH_EXCHANGE'),
//       $action: translateRaw('PLATFORM_ASSETS_SWAPPED')
//     }),
//     icon: swap
//   },
//   [ITxHistoryType.AAVE_BORROW]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('AAVE'),
//       $action: translateRaw('PLATFORM_TAKE_LOAN')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.AAVE_DEPOSIT]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('AAVE'),
//       $action: translateRaw('PLATFORM_DEPOSIT')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.AAVE_REPAY]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('AAVE'),
//       $action: translateRaw('PLATFORM_REPAY_LOAN')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.AAVE_WITHDRAW]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('AAVE'),
//       $action: translateRaw('PLATFORM_WITHDRAW')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.COMPOUND_V2_BORROW]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('COMPOUND'),
//       $action: translateRaw('PLATFORM_TAKE_LOAN')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.COMPOUND_V2_DEPOSIT]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('COMPOUND'),
//       $action: translateRaw('PLATFORM_DEPOSIT')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.COMPOUND_V2_REPAY]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('COMPOUND'),
//       $action: translateRaw('PLATFORM_REPAY_LOAN')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.COMPOUND_V2_WITHDRAW]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('COMPOUND'),
//       $action: translateRaw('PLATFORM_WITHDRAW')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.DEX_AG_EXCHANGE]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('DEX_AG'),
//       $action: translateRaw('PLATFORM_ASSETS_SWAPPED')
//     }),
//     icon: swap
//   },
//   [ITxHistoryType.ETHERMINE_MINING_PAYOUT]: {
//     label: () =>
//       translateRaw('RECENT_TX_LIST_LABEL_MINING_PAYOUT', {
//         $poolName: translateRaw('ETHERMINE_POOL')
//       }),
//     icon: inbound
//   },
//   [ITxHistoryType.GNOSIS_SAFE_APPROVE_TX]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_GNOSIS_APPROVAL'),
//     icon: approval
//   },
//   [ITxHistoryType.GNOSIS_SAFE_WITHDRAW]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT'),
//     icon: contractInteract
//   },
//   [ITxHistoryType.IDEX_DEPOSIT_ETH]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('IDEX'),
//       $action: translateRaw('PLATFORM_DEPOSIT')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.IDEX_DEPOSIT_TOKEN]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('IDEX'),
//       $action: translateRaw('PLATFORM_DEPOSIT')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.IDEX_WITHDRAW]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('IDEX'),
//       $action: translateRaw('PLATFORM_WITHDRAW')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.KYBER_EXCHANGE]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('KYBER'),
//       $action: translateRaw('PLATFORM_ASSETS_SWAPPED')
//     }),
//     icon: swap
//   },
//   [ITxHistoryType.MININGPOOLHUB_MINING_PAYOUT]: {
//     label: () =>
//       translateRaw('RECENT_TX_LIST_LABEL_MINING_PAYOUT', {
//         $poolName: translateRaw('MININGPOOLHUB_POOL')
//       }),
//     icon: inbound
//   },
//   [ITxHistoryType.PARASWAP_EXCHANGE]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('PARASWAP'),
//       $action: translateRaw('PLATFORM_ASSETS_SWAPPED')
//     }),
//     icon: swap
//   },
//   [ITxHistoryType.SPARKPOOL_MINING_PAYOUT]: {
//     label: () =>
//       translateRaw('RECENT_TX_LIST_LABEL_MINING_PAYOUT', {
//         $poolName: translateRaw('SPARK_POOL')
//       }),
//     icon: inbound
//   },
//   [ITxHistoryType.UNISWAP_V1_DEPOSIT]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('UNISWAP'),
//       $action: translateRaw('PLATFORM_DEPOSIT')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.UNISWAP_V1_EXCHANGE]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('UNISWAP'),
//       $action: translateRaw('PLATFORM_ASSETS_SWAPPED')
//     }),
//     icon: swap
//   },
//   [ITxHistoryType.UNISWAP_V1_WITHDRAW]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('UNISWAP'),
//       $action: translateRaw('PLATFORM_WITHDRAW')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.UNISWAP_V2_DEPOSIT]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('UNISWAP'),
//       $action: translateRaw('PLATFORM_DEPOSIT')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.UNISWAP_V2_EXCHANGE]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('UNISWAP'),
//       $action: translateRaw('PLATFORM_ASSETS_SWAPPED')
//     }),
//     icon: swap
//   },
//   [ITxHistoryType.UNISWAP_V2_ROUTER_TO]: {
//     label: () => translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT'),
//     icon: contractInteract
//   },
//   [ITxHistoryType.UNISWAP_V2_WITHDRAW]: {
//     label: () => translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
//       $platform: translateRaw('UNISWAP'),
//       $action: translateRaw('PLATFORM_WITHDRAW')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.WETH_UNWRAP]: {
//     label: () => translateRaw('RECENT_TX_LIST_UNWRAP', {
//       $asset: translateRaw('BASE_UNIT')
//     }),
//     icon: contractInteract
//   },
//   [ITxHistoryType.WETH_WRAP]: {
//     label: () => translateRaw('RECENT_TX_LIST_WRAP', {
//       $asset: translateRaw('BASE_UNIT')
//     }),
//     icon: contractInteract
//   }
// };

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
      <img
        src={txConfig ? txConfig.icon : transfer}
        width="36px"
        height="36px"
      />
      {greyscaleIcon}
    </Box>
  );
  return baseIcon;
};

export default function RecentTransactionList({ accountsList, className = '' }: Props) {
  const { getAssetRate } = useRates();
  const { settings } = useSettings();
  const txTypeMeta = useSelector(getTxTypeMeta);
  const txHistory = useSelector(getMergedTxHistory);
  const { isMobile } = useScreenSize();

  const accountTxs = txHistory.filter((tx) =>
    accountsList.some((a) => isSameAddress(a.address, tx.to) || isSameAddress(a.address, tx.from))
  );

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

        const labelToProps = {
          addressBookEntry: toAddressBookEntry,
          address: receiverAddress || to,
          networkId
        };
        const entryConfig = constructTxTypeConfig(txTypeMeta[txType as TxType] || DEFAULT_TX_TYPE_META)
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
          to && (
            <Account
              key={2}
              title={<EditableAccountLabel {...labelToProps} />}
              truncate={true}
              address={receiverAddress || to}
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
