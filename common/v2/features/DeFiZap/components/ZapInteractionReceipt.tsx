import React from 'react';

import { TransactionReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig } from 'v2/types';
import { translateRaw } from 'v2/translations';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  onSuccess(): void;
}

export default function ZapInteractionReceipt(props: Props) {
  const { txReceipt, txConfig, onSuccess } = props;

  return (
    <TransactionReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButtonText={translateRaw('INTERACT_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
    />
  );
}
