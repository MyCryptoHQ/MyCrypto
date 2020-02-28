import React from 'react';

import { ConfirmTransaction as ConfirmTransactionForm } from 'v2/components/TransactionFlow';
import { ITxConfig } from 'v2/types';

interface Props {
  txConfig: ITxConfig;
  onComplete(): void;
}

export default function ConfirmZapInteraction(props: Props) {
  const { txConfig, onComplete } = props;

  return (
    <ConfirmTransactionForm onComplete={onComplete} resetFlow={onComplete} txConfig={txConfig} />
  );
}
