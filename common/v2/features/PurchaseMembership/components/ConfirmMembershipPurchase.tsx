import React from 'react';

import { ConfirmTransaction as ConfirmTransactionForm } from 'v2/components/TransactionFlow';
import { ITxConfig, ITxType } from 'v2/types';
import { IMembershipConfig } from '../config';

interface Props {
  membershipSelected: IMembershipConfig;
  txConfig: ITxConfig;
  onComplete(): void;
}

export default function ConfirmMembershipPurchase(props: Props) {
  const { membershipSelected, txConfig, onComplete } = props;

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
