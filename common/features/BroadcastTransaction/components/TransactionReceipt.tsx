import React from 'react';

import { TransactionReceipt as TransactionReceiptForm } from 'components/TransactionFlow';
import { ITxConfig } from 'typeFiles';
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
          resetFlow={handleTransactionReceiptComplete}
          onComplete={handleTransactionReceiptComplete}
        />
      )}
    </>
  );
}
