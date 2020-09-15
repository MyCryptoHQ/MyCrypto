import React from 'react';

import { TxReceipt } from '@components/TransactionFlow';
import { translateRaw } from '@translations';
import { ITxConfig, ITxReceipt } from '@types';

import { IZapConfig } from '../config';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  zapSelected: IZapConfig;
  resetFlow(): void;
  onComplete(): void;
}

export default function ZapReceipt({
  txReceipt,
  txConfig,
  zapSelected,
  resetFlow,
  onComplete
}: Props) {
  return (
    <TxReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      zapSelected={zapSelected}
      completeButtonText={translateRaw('INTERACT_ANOTHER')}
      resetFlow={resetFlow}
      onComplete={onComplete}
    />
  );
}
