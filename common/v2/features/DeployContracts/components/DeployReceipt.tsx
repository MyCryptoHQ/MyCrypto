import React from 'react';

import { TransactionReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig } from 'v2/types';
import { translateRaw } from 'v2/translations';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  goToFirstStep(): void;
}

export default function DeployReceipt(props: Props) {
  const { txReceipt, txConfig, goToFirstStep } = props;

  return (
    <TransactionReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButtonText={translateRaw('DEPLOY_ANOTHER')}
      resetFlow={goToFirstStep}
      onComplete={goToFirstStep}
    />
  );
}
