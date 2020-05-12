import React from 'react';

import { ITxConfig } from '@types';
import { ConfirmTransaction } from '@components';

interface Props {
  txConfig: ITxConfig;
  goToNextStep(): void;
}

export default function InteractionConfirm(props: Props) {
  const { goToNextStep, txConfig } = props;

  return (
    <ConfirmTransaction onComplete={goToNextStep} resetFlow={goToNextStep} txConfig={txConfig} />
  );
}
