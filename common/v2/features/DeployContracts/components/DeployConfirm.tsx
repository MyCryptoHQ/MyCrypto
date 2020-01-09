import React from 'react';

import { ConfirmTransaction as ConfirmTransactionForm } from 'v2/components/TransactionFlow';
import { ITxConfig } from 'v2/types';

interface Props {
  txConfig: ITxConfig;
  goToNextStep(): void;
}

export default function DeployConfirm(props: Props) {
  const { goToNextStep, txConfig } = props;

  return (
    <ConfirmTransactionForm
      onComplete={goToNextStep}
      resetFlow={goToNextStep}
      txConfig={txConfig}
    />
  );
}
