import React from 'react';

import { translateRaw } from 'v2/translations';
import { TxReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig, ITxType } from 'v2/types';

import { ISwapAsset, SwapDisplayData } from '../types';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: string;
  toAmount: string;
  onSuccess(): void;
}

export default function SwapTransactionReceipt(props: Props) {
  const { txReceipt, onSuccess, txConfig, fromAsset, toAsset, fromAmount, toAmount } = props;
  const swapDisplay: SwapDisplayData = {
    fromAsset,
    toAsset,
    fromAmount,
    toAmount
  };
  return (
    <TxReceipt
      txType={ITxType.SWAP}
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButtonText={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
      swapDisplay={swapDisplay}
    />
  );
}
