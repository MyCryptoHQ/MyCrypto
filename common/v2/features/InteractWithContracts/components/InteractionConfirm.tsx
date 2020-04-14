import React from 'react';

import { ITxConfig } from 'v2/types';
import { ConfirmTransaction } from 'v2/components';

interface Props {
  txConfig: ITxConfig;
  goToNextStep(): void;
}

export default function InteractionConfirm(props: Props) {
  const { goToNextStep, txConfig } = props;

  return (
    <ConfirmTransaction
      onComplete={goToNextStep}
      resetFlow={goToNextStep}
      txConfig={txConfig}
    />
  );
}
