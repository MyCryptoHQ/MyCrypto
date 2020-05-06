import React from 'react';

import { TxReceipt, MultiTxReceipt } from 'v2/components/TransactionFlow';
import { ITxType, TxParcel, StoreAccount } from 'v2/types';
import { fromTxParcelToTxReceipt } from 'v2/utils';
import { IMembershipConfig } from '../config';
import { makeTxConfigFromTransaction } from '../helpers';

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
  const txConfigs = transactions.map((tx) =>
    makeTxConfigFromTransaction(tx.txRaw, account, membershipSelected)
  );
  const txReceipts = transactions.map((tx) => fromTxParcelToTxReceipt(tx, account));

  return txReceipts.length === 1 ? (
    <TxReceipt
      txReceipt={txReceipts[0]!}
      txConfig={txConfigs[0]}
      txType={ITxType.PURCHASE_MEMBERSHIP}
      membershipSelected={membershipSelected}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  ) : (
    <MultiTxReceipt
      txType={ITxType.PURCHASE_MEMBERSHIP}
      membershipSelected={membershipSelected}
      transactions={transactions}
      transactionsConfigs={txConfigs}
      account={account}
      network={account.network}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  );
}
