import React from 'react';

import { TransactionReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig } from 'v2/types';
import { translateRaw } from 'v2/translations';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  onComplete(): void;
}

export default function ZapInteractionReceipt(props: Props) {
  const { txReceipt, txConfig, onComplete } = props;

  return (
    <TransactionReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButtonText={translateRaw('INTERACT_ANOTHER')}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  );
}
