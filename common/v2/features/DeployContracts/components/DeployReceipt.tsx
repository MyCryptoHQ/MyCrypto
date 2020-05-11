import React from 'react';

import { TxReceipt } from '@components/TransactionFlow';
import { ITxReceipt, ITxConfig } from '@types';
import { translateRaw } from '@translations';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  goToFirstStep(): void;
}

export default function DeployReceipt(props: Props) {
  const { txReceipt, txConfig, goToFirstStep } = props;

  return (
    <TxReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButtonText={translateRaw('DEPLOY_ANOTHER')}
      resetFlow={goToFirstStep}
      onComplete={goToFirstStep}
    />
  );
}
