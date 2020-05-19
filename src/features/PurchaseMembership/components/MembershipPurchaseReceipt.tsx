import React from 'react';

import { TxReceipt, MultiTxReceipt } from '@components/TransactionFlow';
import { ITxType, TxParcel, StoreAccount, ITxStatus } from '@types';
import { IMembershipConfig } from '../config';
import { makeTxConfigFromTransaction } from '../helpers';
import { constructTxReceiptFromTransactionReceipt } from '@utils/transaction';

interface Props {
  account: StoreAccount;
  transactions: TxParcel[];
  membershipSelected: IMembershipConfig;
  onComplete(): void;
}

export default function MembershipReceipt({
  account,
  transactions,
  membershipSelected,
  onComplete
}: Props) {
  const txItems = transactions.map((tx, idx) => {
    const txConfig = makeTxConfigFromTransaction(tx.txRaw, account, membershipSelected);
    const txType = idx === transactions.length - 1 ? ITxType.PURCHASE_MEMBERSHIP : ITxType.APPROVAL;
    if (!tx.txReceipt) {
      return {
        txReceipt: constructTxReceiptFromTransactionReceipt(tx.txReceipt!)(
          txType,
          txConfig,
          account.assets,
          ITxStatus.PENDING
        ),
        txConfig
      };
    } else {
      const status = tx.txReceipt.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
      return {
        txReceipt: constructTxReceiptFromTransactionReceipt(tx.txReceipt)(
          txType,
          txConfig,
          account.assets,
          status
        ),
        txConfig
      };
    }
  });

  return txItems.length === 1 ? (
    <TxReceipt
      txReceipt={txItems.map(({ txReceipt }) => txReceipt)[0]}
      txConfig={txItems.map(({ txConfig }) => txConfig)[0]}
      membershipSelected={membershipSelected}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  ) : (
    <MultiTxReceipt
      txType={ITxType.PURCHASE_MEMBERSHIP}
      membershipSelected={membershipSelected}
      transactions={transactions}
      transactionsConfigs={txItems.map(({ txConfig }) => txConfig)}
      account={account}
      network={account.network}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  );
}
