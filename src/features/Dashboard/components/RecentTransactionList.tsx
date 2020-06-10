import React, { useContext } from 'react';
import styled from 'styled-components';
import { Overwrite } from 'utility-types';

import {
  Amount,
  DashboardPanel,
  NewTabLink,
  AssetIcon,
  Account,
  FixedSizeCollapsibleTable
} from '@components';
import { truncate, convertToFiat } from '@utils';
import { ITxReceipt, ITxStatus, StoreAccount, Asset, Network } from '@types';
import {
  RatesContext,
  AddressBookContext,
  getLabelByAddressAndNetwork,
  SettingsContext,
  NetworkContext
} from '@services';
import { translateRaw } from '@translations';
import {
  getTxsFromAccount,
  txIsFailed,
  txIsPending,
  txIsSuccessful
} from '@services/Store/helpers';
import { COLORS } from '@theme';
import { getFiat } from '@config/fiats';

import NoTransactions from './NoTransactions';
import TransactionLabel from './TransactionLabel';
import { ITxHistoryType } from '../types';
import { deriveTxType } from '../helpers';
import './RecentTransactionList.scss';

import newWindowIcon from '@assets/images/icn-new-window.svg';
import transfer from '@assets/images/transactions/transfer.svg';
import inbound from '@assets/images/transactions/inbound.svg';
import outbound from '@assets/images/transactions/outbound.svg';
import approval from '@assets/images/transactions/approval.svg';
import contractInteract from '@assets/images/transactions/contract-interact.svg';
import contractDeploy from '@assets/images/transactions/contract-deploy.svg';
import defizap from '@assets/images/transactions/defizap.svg';
import membershipPurchase from '@assets/images/transactions/membership-purchase.svg';
import swap from '@assets/images/transactions/swap.svg';

interface Props {
  className?: string;
  accountsList: StoreAccount[];
}

interface ITxHistoryEntry
  extends Overwrite<ITxReceipt, { txType: ITxHistoryType; timestamp: number }> {
  network: Network;
  toLabel: string;
  fromLabel: string;
}

interface ITxTypeConfigObj {
  icon: any;
  label(asset: Asset): string;
}

type ITxTypeConfig = {
  [txType in ITxHistoryType]: ITxTypeConfigObj;
};

const TxTypeConfig: ITxTypeConfig = {
  [ITxHistoryType.INBOUND]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_RECEIVED', {
        $ticker: asset.ticker || translateRaw('UNKNOWN')
      }),
    icon: inbound
  },
  [ITxHistoryType.OUTBOUND]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_SENT', {
        $ticker: asset.ticker || translateRaw('UNKNOWN')
      }),
    icon: outbound
  },
  [ITxHistoryType.TRANSFER]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_TRANSFERRED', {
        $ticker: asset.ticker || translateRaw('UNKNOWN')
      }),
    icon: transfer
  },
  [ITxHistoryType.DEFIZAP]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_DEFIZAP_ADD'),
    icon: defizap
  },
  [ITxHistoryType.PURCHASE_MEMBERSHIP]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_MEMBERSHIP_PURCHASED'),
    icon: membershipPurchase
  },
  [ITxHistoryType.SWAP]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_SWAP'),
    icon: swap
  },
  [ITxHistoryType.APPROVAL]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_APPROVAL', { $ticker: asset.ticker }),
    icon: approval
  },
  [ITxHistoryType.CONTRACT_INTERACT]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT'),
    icon: contractInteract
  },
  [ITxHistoryType.DEPLOY_CONTRACT]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_DEPLOY'),
    icon: contractDeploy
  }
};

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

const makeTxIcon = (type: ITxHistoryType, asset: Asset) => {
  const greyscaleIcon = asset && <>{SCombinedCircle(asset)}</>;
  const baseIcon = (
    <div className="TransactionLabel-image">
      <img
        src={TxTypeConfig[type] ? TxTypeConfig[type].icon : transfer}
        width="56px"
        height="56px"
      />
      {greyscaleIcon}
    </div>
  );
  return baseIcon;
};

export default function RecentTransactionList({ accountsList, className = '' }: Props) {
  const { addressBook } = useContext(AddressBookContext);
  const { getAssetRate } = useContext(RatesContext);
  const { settings } = useContext(SettingsContext);
  const { networks } = useContext(NetworkContext);
  const noLabel = translateRaw('NO_LABEL');

  const accountTxs: ITxHistoryEntry[] = getTxsFromAccount(accountsList).map((tx: ITxReceipt) => {
    const network = networks.find(({ id }) => tx.asset.networkId === id) as Network;
    const toAddressBookEntry = getLabelByAddressAndNetwork(
      tx.receiverAddress || tx.to,
      addressBook,
      network
    );
    const fromAddressBookEntry = getLabelByAddressAndNetwork(tx.from, addressBook, network);
    return {
      ...tx,
      timestamp: tx.timestamp || 0,
      txType: deriveTxType(accountsList, tx) || ITxHistoryType.UNKNOWN,
      toLabel: toAddressBookEntry ? toAddressBookEntry.label : noLabel,
      fromLabel: fromAddressBookEntry ? fromAddressBookEntry.label : noLabel,
      network
    };
  });

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
        fromLabel,
        toLabel,
        network,
        txType
      }) => {
        return [
          <TransactionLabel
            key={0}
            image={makeTxIcon(txType, asset)}
            label={TxTypeConfig[txType].label(asset)}
            stage={status}
            date={timestamp}
          />,
          <Account key={1} title={fromLabel} truncate={truncate} address={from} />,
          to && (
            <Account key={2} title={toLabel} truncate={truncate} address={receiverAddress || to} />
          ),
          <Amount
            key={3}
            assetValue={`${parseFloat(amount).toFixed(4)} ${asset.ticker}`}
            fiatValue={`${getFiat(settings).symbol}${convertToFiat(
              parseFloat(amount),
              getAssetRate(asset)
            ).toFixed(2)}
        `}
          />,
          <NewTabLink
            key={4}
            href={
              !network || !('blockExplorer' in network) || !network.blockExplorer
                ? `https://etherscan.io/tx/${hash}`
                : network.blockExplorer.txUrl(hash)
            }
          >
            <img src={newWindowIcon} alt="View more information about this transaction" />
          </NewTabLink>
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
      translateRaw('RECENT_TRANSACTIONS_VIEW_MORE') || 'View More'
    ],
    body: [],
    groups: filteredGroups,
    config: {
      primaryColumn: translateRaw('RECENT_TRANSACTIONS_DATE'),
      sortableColumn: translateRaw('RECENT_TRANSACTIONS_DATE'),
      sortFunction: () => (a: any, b: any) => b.props.date - a.props.date,
      hiddenHeadings: [translateRaw('RECENT_TRANSACTIONS_VIEW_MORE')],
      iconColumns: [translateRaw('RECENT_TRANSACTIONS_VIEW_MORE')]
    }
  };
  return (
    <DashboardPanel
      heading="Recent Transactions"
      //headingRight="Export"
      //actionLink="/dashboard/recent-transactions"
      className={`RecentTransactionsList ${className}`}
    >
      {filteredGroups.length >= 1 ? (
        <FixedSizeCollapsibleTable breakpoint={1000} {...recentTransactionsTable} />
      ) : (
        NoTransactions()
      )}
    </DashboardPanel>
  );
}
