import React from 'react';

import { ConfirmTransaction as ConfirmTransactionForm } from 'v2/components/TransactionFlow';
import { ITxConfig } from 'v2/types';

interface Props {
  txConfig: ITxConfig;
  onSuccess(): void;
}

export default function ConfirmZapInteraction(props: Props) {
  const { txConfig, onSuccess } = props;

  return (
    <ConfirmTransactionForm onComplete={onSuccess} resetFlow={onSuccess} txConfig={txConfig} />
  );
}
