import React from 'react';

import { ConfirmTransaction } from '@components';
import { ITxType, StoreAccount, TxParcel } from '@types';

import { IMembershipConfig } from '../config';
import { makePurchaseMembershipTxConfig } from '../helpers';
import MembershipReceiptBanner from './MembershipReceiptBanner';

interface Props {
  flowConfig: IMembershipConfig;
  currentTxIdx: number;
  transactions: TxParcel[];
  account: StoreAccount;
  onComplete(): void;
}

export default function ConfirmMembershipPurchase(props: Props) {
  const { flowConfig, transactions, currentTxIdx, account, onComplete } = props;

  const txConfigs = transactions.map((tx) =>
    makePurchaseMembershipTxConfig(tx.txRaw, account, flowConfig)
  );

  const txConfig = txConfigs[currentTxIdx];

  return (
    <ConfirmTransaction
      onComplete={onComplete}
      resetFlow={onComplete}
      txConfig={txConfig}
      customComponent={() => <MembershipReceiptBanner membershipSelected={flowConfig} />}
      txType={ITxType.PURCHASE_MEMBERSHIP}
    />
  );
}
