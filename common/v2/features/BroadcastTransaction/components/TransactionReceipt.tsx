import React from 'react';

import { TransactionReceipt as TransactionReceiptForm } from 'v2/features/SendAssets/components';
import { ITxConfig } from 'v2/features/SendAssets/types';
import { translateRaw } from 'translations';

interface Props {
  txReceipt: any;
  txConfig: ITxConfig | undefined;
  setStep(step: number): void;
}

export default function TransactionReceipt(props: Props) {
  const { txReceipt, txConfig, setStep } = props;

  const handleTransactionReceiptComplete = () => {
    setStep(0);
  };

  return (
    <>
      {txConfig && (
        <TransactionReceiptForm
          txReceipt={txReceipt}
          txConfig={txConfig}
          completeButtonText={translateRaw('BROADCAST_TX_BROADCAST_ANOTHER')}
          onComplete={handleTransactionReceiptComplete}
        />
      )}
    </>
  );
}
