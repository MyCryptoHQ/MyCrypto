import React from 'react';

import { TxReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig, ITxType } from 'v2/types';
import { translateRaw } from 'v2/translations';
import { IZapConfig } from '../config';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  zapSelected: IZapConfig;
  onComplete(): void;
}

export default function ZapReceipt({ txReceipt, txConfig, zapSelected, onComplete }: Props) {
  return (
    <TxReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      txType={ITxType.DEFIZAP}
      zapSelected={zapSelected}
      completeButtonText={translateRaw('INTERACT_ANOTHER')}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  );
}
