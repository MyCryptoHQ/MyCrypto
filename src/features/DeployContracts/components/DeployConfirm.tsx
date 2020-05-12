import React from 'react';

import { ConfirmTransaction } from '@components';
import { ITxConfig } from '@types';

interface Props {
  txConfig: ITxConfig;
  goToNextStep(): void;
}

export default function DeployConfirm(props: Props) {
  const { goToNextStep, txConfig } = props;

  return (
    <ConfirmTransaction onComplete={goToNextStep} resetFlow={goToNextStep} txConfig={txConfig} />
  );
}
