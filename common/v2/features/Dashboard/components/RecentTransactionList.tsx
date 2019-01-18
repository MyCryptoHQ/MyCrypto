import React from 'react';
import { Link } from 'react-router-dom';
import { Address, CollapsibleTable } from '@mycrypto/ui';

import Amount from './Amount';
import DashboardPanel from './DashboardPanel';
import TransactionLabel from './TransactionLabel';
import './RecentTransactionList.scss';

// Legacy
import newWindowIcon from 'common/assets/images/icn-new-window.svg';

// Fake Data
const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};
const recentTransactions = [
  {
    uuid: '76b50f76-afb2-4185-ab7d-4d62c0654883',
    stage: 'pending',
    label: 'OmiseGO Sent',
    date: '1547768373',
    from: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
    to: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
    amount: '42.69 OMG',
    fiat: {
      USD: '$13.37'
    }
  },
  {
    uuid: '76b50f76-afb2-4185-ab7d-4d62c0654884',
    stage: 'pending',
    label: 'EOS Received',
    date: '1547730000',
    from: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
    to: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
    amount: '513.20 EOS',
    fiat: {
      USD: '$201.45'
    }
  },
  {
    uuid: '76b50f76-afb2-4185-ab7d-4d62c0654885',
    stage: 'completed',
    label: 'Ethereum Purchased',
    date: '1547720000',
    from: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
    to: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
    amount: '4.123 ETH',
    fiat: {
      USD: '$161.45'
    }
  }
];
const pending = recentTransactions.filter(tx => tx.stage === 'pending');
const completed = recentTransactions.filter(tx => tx.stage === 'completed');
const createEntries = (stage, collection) =>
  collection.map(({ label, stage, date, from, to, amount, fiat, uuid }) => [
    <TransactionLabel
      key={0}
      image="https://placehold.it/45x45"
      label={label}
      stage={stage}
      date={date}
    />,
    <Address key={1} title="No Label" truncate={truncate} onSubmit={() => {}} address={from} />,
    <Address key={2} title="No Label" truncate={truncate} onSubmit={() => {}} address={to} />,
    <Amount key={3} assetValue={amount} fiatValue={fiat.USD} />,
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

export default function RecentTransactionList() {
  return (
    <DashboardPanel
      heading="Recent Transactions"
      action="Expand"
      actionLink="/dashboard/recent-transactions"
      className="RecentTransactionsList"
    >
      <CollapsibleTable breakpoint={1000} {...recentTransactionsTable} />
    </DashboardPanel>
  );
}
