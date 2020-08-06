import React from 'react';

import { MultiTxReceipt } from '@components/TransactionFlow';
import { ITxType, TxParcel, StoreAccount } from '@types';
import { makeTxItem } from '@utils/transaction';

import { makeTokenMigrationTxConfig } from '../helpers';

interface Props {
  account: StoreAccount;
  transactions: TxParcel[];
  onComplete(): void;
}

export default function TokenMigrationReceipt({ account, transactions, onComplete }: Props) {
  const txItems = transactions.map((tx, idx) => {
    const txConfig = makeTokenMigrationTxConfig(tx.txRaw, account);
    const txType = idx === transactions.length - 1 ? ITxType.REP_TOKEN_MIGRATION : ITxType.APPROVAL;
    return makeTxItem(txType, txConfig, tx.txResponse, tx.txReceipt);
  });

  return (
    <MultiTxReceipt
      txType={ITxType.REP_TOKEN_MIGRATION}
      transactions={transactions}
      transactionsConfigs={txItems.map(({ txConfig }) => txConfig)}
      account={account}
      network={account.network}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  );
}
