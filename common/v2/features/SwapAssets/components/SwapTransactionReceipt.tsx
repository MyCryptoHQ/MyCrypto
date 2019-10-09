import React from 'react';

import { TransactionReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig } from 'v2/types';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  goToFirstStep(): void;
}

export default function SwapTransactionReceipt(props: Props) {
  const { txReceipt, goToFirstStep, txConfig } = props;

  return (
    <div>
      <div>Transaction Receipt</div>
      <TransactionReceipt
        txReceipt={txReceipt}
        txConfig={txConfig}
        completeButtonText={'Start Another Swap'}
        resetFlow={goToFirstStep}
        onComplete={goToFirstStep}
      />
    </div>
  );
}
