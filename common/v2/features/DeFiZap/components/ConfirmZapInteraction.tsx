import React from 'react';

import { ConfirmTransaction as ConfirmTransactionForm } from 'v2/components/TransactionFlow';
import { ITxConfig } from 'v2/types';

interface Props {
  txConfig: ITxConfig;
  goToNextStep(): void;
}

export default function ConfirmZapInteraction(props: Props) {
  const { txConfig, goToNextStep } = props;

  return (
    <ConfirmTransactionForm
      onComplete={goToNextStep}
      resetFlow={goToNextStep}
      txConfig={txConfig}
    />
  );
}
