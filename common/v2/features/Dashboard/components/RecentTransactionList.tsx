import React from 'react';
import { Link } from 'react-router-dom';
import { Address, CollapsibleTable } from '@mycrypto/ui';

import { Amount } from 'v2/components';
import DashboardPanel from './DashboardPanel';
import TransactionLabel from './TransactionLabel';
import './RecentTransactionList.scss';

// Legacy
import newWindowIcon from 'common/assets/images/icn-new-window.svg';
import { AddressMetadata, ExtendedAccount, TransactionData } from 'v2/services';
import { truncate } from 'v2/libs';

interface Props {
  className?: string;
  accountsList: ExtendedAccount[];
  readAddressMetadata(uuid: string): AddressMetadata;
}

export default function RecentTransactionList({
  accountsList,
  readAddressMetadata,
  className = ''
}: Props) {
  const transactions: TransactionData[] = [];
  accountsList.map(account =>
    account.transactions.map(transaction => transactions.push(transaction))
  );

  // TODO: Sort by relevant transactions

  const pending = transactions.filter(tx => tx.stage === 'pending');
  const completed = transactions.filter(tx => tx.stage === 'completed');
  const createEntries = (_: string, collection: typeof transactions) =>
    collection.map(({ label, stage, date, from, to, value, fiatValue }) => [
      <TransactionLabel
        key={0}
        image="https://placehold.it/45x45"
        label={label}
        stage={stage}
        date={date}
      />,
      <Address
        key={1}
        title={
          readAddressMetadata(from.toLowerCase())
            ? readAddressMetadata(from.toLowerCase()).label
            : 'No Label'
        }
        truncate={truncate}
        address={from}
      />,
      <Address
        key={2}
        title={
          readAddressMetadata(to.toLowerCase())
            ? readAddressMetadata(to.toLowerCase()).label
            : 'No Label'
        }
        truncate={truncate}
        address={to}
      />,
      <Amount key={3} assetValue={value.toString()} fiatValue={fiatValue.USD} />,
      <Link key={4} to={`/dashboard/transactions/${'transactionuuid'}`}>
        {' '}
        {/* TODO - fix this.*/}
        <img src={newWindowIcon} alt="View more information about this transaction" />
      </Link>
    ]);
  const recentTransactionsTable = {
    head: ['Date', 'From Address', 'To Address', 'Amount', 'View More'],
    body: [],
    groups: [
      {
        title: 'Pending',
        entries: createEntries('pending', pending)
      },
      {
        title: 'Completed',
        entries: createEntries('completed', completed)
      }
    ],
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
      action="Export"
      actionLink="/dashboard/recent-transactions"
      className={`RecentTransactionsList ${className}`}
    >
      <CollapsibleTable breakpoint={1000} {...recentTransactionsTable} />
    </DashboardPanel>
  );
}
