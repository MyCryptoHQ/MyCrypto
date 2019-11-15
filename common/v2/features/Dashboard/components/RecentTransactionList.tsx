import React from 'react';
import { Link } from 'react-router-dom';
import { Address, CollapsibleTable } from '@mycrypto/ui';

import { Amount, DashboardPanel } from 'v2/components';
import TransactionLabel from './TransactionLabel';
import './RecentTransactionList.scss';

import newWindowIcon from 'common/assets/images/icn-new-window.svg';
import { truncate } from 'v2/utils';
import { ExtendedAccount, AddressBook } from 'v2/types';
import { translateRaw } from 'v2/translations';

interface Props {
  className?: string;
  accountsList: ExtendedAccount[];
  readAddressBook(uuid: string): AddressBook;
}

export default function RecentTransactionList({
  accountsList,
  readAddressBook,
  className = ''
}: Props) {
  const noLabel = translateRaw('NO_LABEL');
  const transactions = accountsList.flatMap(account => account.transactions);

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
          readAddressBook(from.toLowerCase()) ? readAddressBook(from.toLowerCase()).label : noLabel
        }
        truncate={truncate}
        address={from}
      />,
      <Address
        key={2}
        title={
          readAddressBook(to.toLowerCase()) ? readAddressBook(to.toLowerCase()).label : noLabel
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
      headingRight="Export"
      actionLink="/dashboard/recent-transactions"
      className={`RecentTransactionsList ${className}`}
    >
      <CollapsibleTable breakpoint={1000} {...recentTransactionsTable} />
    </DashboardPanel>
  );
}
