import React, { useContext } from 'react';
import { Address } from '@mycrypto/ui';

import { Amount, DashboardPanel, NewTabLink, AssetIcon, CollapsibleTable } from 'v2/components';
import TransactionLabel from './TransactionLabel';
import './RecentTransactionList.scss';

import { truncate, convertToFiat } from 'v2/utils';
import { ITxReceipt, TTicker, ITxStatus, StoreAccount, Asset, TSymbol } from 'v2/types';
import { RatesContext, AddressBookContext, getLabelByAddressAndNetwork } from 'v2/services';
import { translateRaw } from 'translations';

import NoTransactions from './NoTransactions';
import {
  getTxsFromAccount,
  txIsFailed,
  txIsPending,
  txIsSuccessful
} from 'v2/services/Store/helpers';
import newWindowIcon from 'common/assets/images/icn-new-window.svg';
import transfer from 'common/assets/images/transactions/transfer.svg';
import inbound from 'common/assets/images/transactions/inbound.svg';
import outbound from 'common/assets/images/transactions/outbound.svg';
import styled from 'styled-components';

interface Props {
  className?: string;
  accountsList: StoreAccount[];
}

enum ITxType {
  TRANSFER = 'TRANSFER',
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND'
}

export const deriveTxType = (accountsList: StoreAccount[], tx: ITxReceipt) => {
  const fromAccount = accountsList.find(
    account => account.address.toLowerCase() === tx.from.toLowerCase()
  );
  const toAccount = accountsList.find(
    account => account.address.toLowerCase() === tx.to.toLowerCase()
  );
  return !fromAccount || !toAccount
    ? fromAccount
      ? ITxType.OUTBOUND
      : ITxType.INBOUND
    : ITxType.TRANSFER;
};

export const getTxIcon = (type: ITxType) => {
  switch (type) {
    case ITxType.TRANSFER:
      return transfer;
    case ITxType.INBOUND:
      return inbound;
    case ITxType.OUTBOUND:
      return outbound;
  }
};

const SAssetIcon = styled(AssetIcon)`
  -webkit-filter: grayscale(1); /* Webkit */
  filter: gray; /* IE6-9 */
  filter: grayscale(1); /* W3C */
  position: absolute;
  border: 3px solid white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
`;

const CCircle = styled('div')`
  position: absolute;
  bottom: -14px;
  right: -14px;
  z-index: 2;
  height: 32px;
  width: 32px;
`;
const SCombinedCircle = (asset: Asset) => {
  return (
    <CCircle>
      <SAssetIcon symbol={asset.ticker as TSymbol} />
    </CCircle>
  );
};

export const makeTxIcon = (type: ITxType, asset: Asset) => {
  const greyscaleIcon = asset && <>{SCombinedCircle(asset)}</>;
  const baseIcon = (
    <div className="TransactionLabel-image">
      <img src={getTxIcon(type)} width="56px" height="56px" />
      {greyscaleIcon}
    </div>
  );
  return baseIcon;
};

export default function RecentTransactionList({ accountsList, className = '' }: Props) {
  const { addressBook } = useContext(AddressBookContext);
  const { getRate } = useContext(RatesContext);
  const noLabel = translateRaw('NO_LABEL');
  const transactions = accountsList.flatMap(account => account.transactions);
  const accountTxs: ITxReceipt = getTxsFromAccount(accountsList).map((tx: ITxReceipt) => ({
    ...tx,
    txType: deriveTxType(accountsList, tx)
  }));
  // TODO: Sort by relevant transactions

  const pending = accountTxs.filter(txIsPending);
  const completed = accountTxs.filter(txIsSuccessful);
  const failed = accountTxs.filter(txIsFailed);

  const createEntries = (_: string, collection: typeof transactions) =>
    collection.map(
      ({ timestamp, label, hash, stage, from, to, amount, asset, network, txType }: ITxReceipt) => [
        <TransactionLabel
          key={0}
          image={makeTxIcon(txType, asset)}
          label={label}
          stage={stage}
          date={timestamp}
        />,
        <Address
          key={1}
          title={
            getLabelByAddressAndNetwork(from.toLowerCase(), addressBook, network)!.label || noLabel
          }
          truncate={truncate}
          address={from}
        />,
        <Address
          key={2}
          title={
            getLabelByAddressAndNetwork(to.toLowerCase(), addressBook, network)!.label || noLabel
          }
          truncate={truncate}
          address={to}
        />,
        <Amount
          key={3}
          assetValue={`${parseFloat(amount).toFixed(6)} ${asset.ticker}`}
          fiatValue={`$${convertToFiat(
            parseFloat(amount),
            getRate(asset.ticker as TTicker)
          ).toFixed(2)}
      `}
        />,
        <NewTabLink
          key={4}
          href={
            network && 'blockExplorer' in network
              ? network.blockExplorer.txUrl(hash)
              : `https://etherscan.io/tx/${hash}`
          }
        >
          {' '}
          <img src={newWindowIcon} alt="View more information about this transaction" />
        </NewTabLink>
      ]
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
  const filteredGroups = groups.filter(group => group.entries.length !== 0);

  const recentTransactionsTable = {
    head: ['Date', 'From Address', 'To Address', 'Amount', 'View More'],
    body: [],
    groups: filteredGroups,
    config: {
      primaryColumn: 'Date',
      sortableColumn: 'Date',
      sortFunction: (a: any, b: any) => a.props.date - b.props.date,
      hiddenHeadings: ['View More'],
      iconColumns: ['View More']
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
