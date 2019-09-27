import React from 'react';
import styled from 'styled-components';

import { TransactionReceipt as TransactionReceiptForm } from 'v2/features/SendAssets/components';
import { ITxConfig } from 'v2/features/SendAssets/types';
import { translateRaw } from 'translations';

interface Props {
  txReceipt: any;
  txConfig: ITxConfig | undefined;
  setStep(step: number): void;
}

const Heading = styled.p`
  font-size: 36px;
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bold;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${props => props.theme.headline};
`;

export default function TransactionReceipt(props: Props) {
  const { txReceipt, txConfig, setStep } = props;

  const handleTransactionReceiptComplete = () => {
    setStep(0);
  };

  return (
    <>
      <Heading>{translateRaw('BROADCAST_TX_RECEIPT_TITLE')}</Heading>
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
