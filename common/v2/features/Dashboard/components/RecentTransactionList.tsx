import React, { useContext } from 'react';
import { Address, CollapsibleTable } from '@mycrypto/ui';

import { Amount, DashboardPanel, NewTabLink } from 'v2/components';
import TransactionLabel from './TransactionLabel';
import './RecentTransactionList.scss';

import newWindowIcon from 'common/assets/images/icn-new-window.svg';
import { truncate, convertToFiat } from 'v2/utils';
import { ExtendedAccount, ITxReceipt, TTicker } from 'v2/types';
import { RatesContext, AddressBookContext, getLabelByAddressAndNetwork } from 'v2/services';
import { ITxStatus } from 'v2/components/TransactionFlow/TransactionReceipt';
import { translateRaw } from 'translations';

import NoTransactions from './NoTransactions';

interface Props {
  className?: string;
  accountsList: ExtendedAccount[];
}

export default function RecentTransactionList({ accountsList, className = '' }: Props) {
  const { addressBook } = useContext(AddressBookContext);
  const { getRate } = useContext(RatesContext);
  const noLabel = translateRaw('NO_LABEL');
  const transactions = accountsList.flatMap(account => account.transactions);

  // TODO: Sort by relevant transactions

  const pending = transactions.filter(tx => tx.stage === ITxStatus.PENDING);
  const completed = transactions.filter(tx => tx.stage === ITxStatus.SUCCESS);
  const failed = transactions.filter(tx => tx.stage === ITxStatus.FAILED);

  const createEntries = (_: string, collection: typeof transactions) =>
    collection.map(
      ({ timestamp, label, hash, stage, from, to, amount, asset, network }: ITxReceipt) => [
        <TransactionLabel
          key={0}
          image="https://placehold.it/45x45"
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
        <NewTabLink key={4} href={`https://etherscan.io/tx/${hash}`}>
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
