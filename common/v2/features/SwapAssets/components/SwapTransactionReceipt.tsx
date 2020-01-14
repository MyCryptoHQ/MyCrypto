import React from 'react';

import { translateRaw } from 'v2/translations';
import { TransactionReceipt } from 'v2/components/TransactionFlow';
import { ITxReceipt, ITxConfig } from 'v2/types';

import { SwapFromToDiagram } from './fields';
import { ISwapAsset } from '../types';

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

  return (
    <TransactionReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButtonText={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
      customDetails={
        <SwapFromToDiagram
          fromSymbol={fromAsset.symbol}
          toSymbol={toAsset.symbol}
          fromAmount={fromAmount}
          toAmount={toAmount}
        />
      }
    />
  );
}
