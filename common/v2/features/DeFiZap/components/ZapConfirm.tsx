import React from 'react';

import { ConfirmTransaction } from 'v2/components/TransactionFlow';
import { ITxConfig, ITxType } from 'v2/types';
import { IZapConfig } from '../config';

interface Props {
  zapSelected: IZapConfig;
  txConfig: ITxConfig;
  onComplete(): void;
}

export default function ZapConfirm({ zapSelected, txConfig, onComplete }: Props) {
  return (
    <ConfirmTransaction
      onComplete={onComplete}
      resetFlow={onComplete}
      txConfig={txConfig}
      txType={ITxType.DEFIZAP}
      zapSelected={zapSelected}
    />
  );
}
