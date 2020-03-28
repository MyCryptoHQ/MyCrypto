import React from 'react';

import { TxReceipt, MultiTxReceipt } from 'v2/components/TransactionFlow';
import { ITxType, TxParcel, StoreAccount } from 'v2/types';
import { translateRaw } from 'v2/translations';
import { IMembershipConfig } from '../config';
import { makeTxConfigFromTransaction } from 'v2/features/InteractWithContracts/helpers';

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
  const txConfigs = transactions.map(tx => {
    return makeTxConfigFromTransaction(
      tx.txRaw,
      account,
      "0" // TODO
    );
  });

  const txReceipts = transactions.map((tx, idx) => {
    return {
      ...txConfigs[idx],
      ...tx.txRaw,
      hash: tx.txHash
    };
  });

  return txReceipts.length === 1 ? (
    <TxReceipt
      txReceipt={txReceipts[0]}
      txConfig={txConfigs[0]}
      txType={ITxType.PURCHASE_MEMBERSHIP}
      membershipSelected={membershipSelected}
      completeButtonText={translateRaw('INTERACT_ANOTHER')}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  ) : (
    <MultiTxReceipt
      txType={ITxType.PURCHASE_MEMBERSHIP}
      transactions={transactions}
      transactionsConfigs={txConfigs}
      account={account}
      network={account.network}
      completeButtonText={translateRaw('INTERACT_ANOTHER')}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  );
}
