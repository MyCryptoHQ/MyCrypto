import React from 'react';

import { ConfirmTransaction } from '@components';
import { ITxType, TxParcel, StoreAccount } from '@types';
import { IMembershipConfig } from '../config';
import { makePurchaseMembershipTxConfig } from '../helpers';

interface Props {
  membershipSelected: IMembershipConfig;
  currentTxIdx: number;
  transactions: TxParcel[];
  account: StoreAccount;
  onComplete(): void;
}

export default function ConfirmMembershipPurchase(props: Props) {
  const { membershipSelected, transactions, currentTxIdx, account, onComplete } = props;

  const txConfigs = transactions.map((tx) =>
    makePurchaseMembershipTxConfig(tx.txRaw, account, membershipSelected)
  );

  const txConfig = txConfigs[currentTxIdx];

  return (
    <ConfirmTransaction
      onComplete={onComplete}
      resetFlow={onComplete}
      txConfig={txConfig}
      membershipSelected={membershipSelected}
      txType={ITxType.PURCHASE_MEMBERSHIP}
    />
  );
}
