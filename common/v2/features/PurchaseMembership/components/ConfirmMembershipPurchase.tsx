import React from 'react';

import { ConfirmTransaction } from 'v2/components';
import { ITxConfig, ITxType } from 'v2/types';

interface Props {
  txConfig: ITxConfig;
  onComplete(): void;
}

export default function ConfirmMembershipPurchase(props: Props) {
  const { txConfig, onComplete } = props;

  return (
    <ConfirmTransaction
      onComplete={onComplete}
      resetFlow={onComplete}
      txConfig={txConfig}
      txType={ITxType.PURCHASE_MEMBERSHIP}
    />
  );
}
