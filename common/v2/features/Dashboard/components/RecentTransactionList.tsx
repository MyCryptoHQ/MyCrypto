import React from 'react';
import { Link } from 'react-router-dom';
import { Address, CollapsibleTable } from '@mycrypto/ui';

import { Amount } from 'v2/components';
import DashboardPanel from './DashboardPanel';
import TransactionLabel from './TransactionLabel';
import './RecentTransactionList.scss';

// Legacy
import newWindowIcon from 'common/assets/images/icn-new-window.svg';
import { TransactionHistory, ExtendedTransaction, AddressMetadata } from 'v2/services';

interface Props {
  transactionHistories: TransactionHistory[];
  className?: string;
  transactions: ExtendedTransaction[];
  readAddressMetadata(uuid: string): AddressMetadata;
}

export default function RecentTransactionList({
  transactions,
  readAddressMetadata,
  className = ''
}: Props) {
  const recentTransactions: ExtendedTransaction[] = transactions;

  // TODO: Sort by relevant transactions
  //const recentTransactionHistories = transactionHistories;
  /*recentTransactionHistories.map((en: TransactionHistory) => {
    const relevantEntries = Object.keys(transactions).find(entry => entry === en.transaction);
    console.log("RelevantEntries: " + JSON.stringify(relevantEntries, null,4));
    recentTransactions.push(txKeys);
  })*/

  const truncate = (children: string) => {
    return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
  };
  const pending = recentTransactions.filter(tx => tx.stage === 'pending');
  const completed = recentTransactions.filter(tx => tx.stage === 'completed');
  /*recentTransactions.map(en => {
    console.log('Looking for ' + en.address + ' in meta: ' + JSON.stringify(readAddressMetadata(en.address), null, 4));
    const meta = readAddressMetadata(en.address);
    en.label = (meta !== undefined && 'label' in meta) ? meta.label : 'No Label';
  })*/
  const createEntries = (_: string, collection: typeof recentTransactions) =>
    collection.map(({ label, stage, date, from, to, value, fiatValue, uuid }) => [
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
      <Link key={4} to={`/dashboard/transactions/${uuid}`}>
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
