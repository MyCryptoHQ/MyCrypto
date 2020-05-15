import React from 'react';

import { TxReceipt, MultiTxReceipt } from '@components/TransactionFlow';
import { ITxType, TxParcel, StoreAccount, ITxConfig, IStandardTxReceipt } from '@types';
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
  const txItems: { txConfig: ITxConfig; txReceipt: IStandardTxReceipt }[] = transactions.map(
    (tx) => {
      const txConfig = makeTxConfigFromTransaction(tx.txRaw, account, membershipSelected);

      return {
        txReceipt: {} as IStandardTxReceipt,
        txConfig
      };
    }
  );

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
