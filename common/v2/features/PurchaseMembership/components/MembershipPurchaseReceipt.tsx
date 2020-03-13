import React from 'react';

import { TxReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig, ITxType } from 'v2/types';
import { translateRaw } from 'v2/translations';
import { IMembershipConfig } from '../config';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  membershipSelected: IMembershipConfig;
  onComplete(): void;
}

export default function MembershipReceipt({
  txReceipt,
  txConfig,
  membershipSelected,
  onComplete
}: Props) {
  return (
    <TxReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      txType={ITxType.PURCHASE_MEMBERSHIP}
      membershipSelected={membershipSelected}
      completeButtonText={translateRaw('INTERACT_ANOTHER')}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  );
}
