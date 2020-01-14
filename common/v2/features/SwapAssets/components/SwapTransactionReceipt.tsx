import React from 'react';

import { translateRaw } from 'v2/translations';

import { TransactionReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig } from 'v2/types';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  onSuccess(): void;
}

export default function SwapTransactionReceipt(props: Props) {
  const { txReceipt, onSuccess, txConfig } = props;

  return (
    <TransactionReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButtonText={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
    />
  );
}
