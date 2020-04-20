import React from 'react';

import { ConfirmTransaction } from 'v2/components';
import { ITxConfig } from 'v2/types';

interface Props {
  txConfig: ITxConfig;
  goToNextStep(): void;
}

export default function DeployConfirm(props: Props) {
  const { goToNextStep, txConfig } = props;

  return (
    <ConfirmTransaction
      onComplete={goToNextStep}
      resetFlow={goToNextStep}
      txConfig={txConfig}
    />
  );
}
