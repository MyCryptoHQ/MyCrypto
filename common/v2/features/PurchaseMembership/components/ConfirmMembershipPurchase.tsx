import React from 'react';

import { ConfirmTransaction as ConfirmTransactionForm } from 'v2/components/TransactionFlow';
import { ITxType, TxParcel, StoreAccount } from 'v2/types';
import { makeTxConfigFromTransaction } from 'v2/features/InteractWithContracts/helpers';
import { IMembershipConfig } from '../config';

interface Props {
  membershipSelected: IMembershipConfig;
  currentTxIdx: number;
  transactions: TxParcel[];
  account: StoreAccount;
  onComplete(): void;
}

export default function ConfirmMembershipPurchase(props: Props) {
  const { membershipSelected, transactions, currentTxIdx, account, onComplete } = props;

  const txConfigs = transactions.map(tx => {
    return makeTxConfigFromTransaction(tx.txRaw, account, membershipSelected.price);
  });

  const txConfig = txConfigs[currentTxIdx];

  return (
    <ConfirmTransactionForm
      onComplete={onComplete}
      resetFlow={onComplete}
      txConfig={txConfig}
      membershipSelected={membershipSelected}
      txType={ITxType.PURCHASE_MEMBERSHIP}
    />
  );
}
