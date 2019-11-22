import React from 'react';
import { TransactionReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig } from 'v2/types';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  goToFirstStep(): void;
}

export default function InteractionReceipt(props: Props) {
  const { txReceipt, txConfig, goToFirstStep } = props;

  return (
    <TransactionReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButtonText={'Another interaction'}
      resetFlow={goToFirstStep}
      onComplete={goToFirstStep}
    />
  );
}
