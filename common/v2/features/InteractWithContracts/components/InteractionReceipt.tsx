import React from 'react';

import { TxReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig } from 'v2/types';
import { translateRaw } from 'v2/translations';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  goToFirstStep(): void;
}

export default function InteractionReceipt(props: Props) {
  const { txReceipt, txConfig, goToFirstStep } = props;

  return (
    <TxReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButtonText={translateRaw('INTERACT_ANOTHER')}
      resetFlow={goToFirstStep}
      onComplete={goToFirstStep}
    />
  );
}
