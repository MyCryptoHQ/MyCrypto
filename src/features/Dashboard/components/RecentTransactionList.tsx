import React, { useContext } from 'react';
import styled from 'styled-components';

import {
  Amount,
  DashboardPanel,
  NewTabLink,
  AssetIcon,
  CollapsibleTable,
  Account
} from '@components';
import { truncate, convertToFiat } from '@utils';
import { ITxReceipt, ITxStatus, StoreAccount, Asset } from '@types';
import {
  RatesContext,
  AddressBookContext,
  getLabelByAddressAndNetwork,
  SettingsContext
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
import './RecentTransactionList.scss';
import newWindowIcon from '@assets/images/icn-new-window.svg';
import transfer from '@assets/images/transactions/transfer.svg';
import inbound from '@assets/images/transactions/inbound.svg';
import outbound from '@assets/images/transactions/outbound.svg';

interface Props {
  className?: string;
  accountsList: StoreAccount[];
}

enum ITxType {
  TRANSFER = 'TRANSFER',
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND'
}

interface ITxTypeConfigObj {
  icon: any;
  label(asset: Asset): string;
}

type ITxTypeConfig = {
  [txType in ITxType]: ITxTypeConfigObj;
};

const TxTypeConfig: ITxTypeConfig = {
  [ITxType.INBOUND]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_RECEIVED', {
        $ticker: asset.ticker || translateRaw('UNKNOWN')
      }),
    icon: inbound
  },
  [ITxType.OUTBOUND]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_SENT', {
        $ticker: asset.ticker || translateRaw('UNKNOWN')
      }),
    icon: outbound
  },
  [ITxType.TRANSFER]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_TRANSFERRED', {
        $ticker: asset.ticker || translateRaw('UNKNOWN')
      }),
    icon: transfer
  }
};

export const deriveTxType = (accountsList: StoreAccount[], tx: ITxReceipt) => {
  const fromAccount =
    tx.from &&
    accountsList.find((account) => account.address.toLowerCase() === tx.from.toLowerCase());
  const toAccount =
    tx.to && accountsList.find((account) => account.address.toLowerCase() === tx.to.toLowerCase());
  return !fromAccount || !toAccount
    ? fromAccount
      ? ITxType.OUTBOUND
      : ITxType.INBOUND
    : ITxType.TRANSFER;
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

const makeTxIcon = (type: ITxType, asset: Asset) => {
  const greyscaleIcon = asset && <>{SCombinedCircle(asset)}</>;
  const baseIcon = (
    <div className="TransactionLabel-image">
      <img src={TxTypeConfig[type].icon} width="56px" height="56px" />
      {greyscaleIcon}
    </div>
  );
  return baseIcon;
};

export default function RecentTransactionList({ accountsList, className = '' }: Props) {
  const { addressBook } = useContext(AddressBookContext);
  const { getAssetRate } = useContext(RatesContext);
  const { settings } = useContext(SettingsContext);
  const noLabel = translateRaw('NO_LABEL');
  const transactions = accountsList.flatMap((account) => account.transactions);
  const accountTxs: ITxReceipt[] = getTxsFromAccount(accountsList).map((tx: ITxReceipt) => ({
    ...tx,
    txType: deriveTxType(accountsList, tx)
  }));
  // TODO: Sort by relevant transactions

  const pending = accountTxs.filter(txIsPending);
  const completed = accountTxs.filter(txIsSuccessful);
  const failed = accountTxs.filter(txIsFailed);

  const createEntries = (_: string, collection: typeof transactions) =>
    collection.map(
      ({ timestamp, hash, stage, from, to, amount, asset, network, txType }: ITxReceipt) => {
        const toAddressBookEntry = to && getLabelByAddressAndNetwork(to, addressBook, network);
        const fromAddressBookEntry = getLabelByAddressAndNetwork(from, addressBook, network);
        return [
          <TransactionLabel
            key={0}
            image={makeTxIcon(txType, asset)}
            label={TxTypeConfig[txType as ITxType].label(asset)}
            stage={stage}
            date={timestamp}
          />,
          <Account
            key={1}
            title={fromAddressBookEntry ? fromAddressBookEntry.label : noLabel}
            truncate={truncate}
            address={from}
          />,
          to && (
            <Account
              key={2}
              title={toAddressBookEntry ? toAddressBookEntry.label : noLabel}
              truncate={truncate}
              address={to}
            />
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
        <CollapsibleTable breakpoint={1000} {...recentTransactionsTable} />
      ) : (
        NoTransactions()
      )}
    </DashboardPanel>
  );
}
