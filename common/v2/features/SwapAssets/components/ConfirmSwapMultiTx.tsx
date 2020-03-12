import React from 'react';
import * as R from 'ramda';

import { SwapFromToDiagram } from 'v2/components/TransactionFlow/displays';
import { VerticalStepper, Typography } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { ITxStatus } from 'v2/types';

import { IAssetPair, TxEnveloppe } from '../types';
import step1SVG from 'assets/images/icn-send.svg';
import step2SVG from 'assets/images/icn-receive.svg';

interface Props {
  assetPair: IAssetPair;
  currentTx: number;
  transactions: TxEnveloppe[];
  onClick?(): void;
}

export default function ConfirmSwapMultiTx({ assetPair, currentTx, transactions, onClick }: Props) {
  const { fromAsset, toAsset, fromAmount, toAmount } = assetPair;
  const status = transactions.map(t => R.path(['status'], t));

  const broadcasting = status.findIndex(s => s === ITxStatus.BROADCASTED);

  const approveTx = {
    title: translateRaw('APPROVE_SWAP'),
    icon: step1SVG,
    content: translateRaw('SWAP_STEP1_TEXT', { $token: fromAsset.symbol }),
    buttonText: `${status[0]} ${translateRaw('APPROVE_SWAP')}`,
    loading: status[0] === ITxStatus.BROADCASTED,
    onClick
  };

  const transferTx = {
    title: translateRaw('COMPLETE_SWAP'),
    icon: step2SVG,
    content: translateRaw('SWAP_STEP2_TEXT'),
    buttonText: `${status[1]} ${translateRaw('CONFIRM_TRANSACTION')}`,
    loading: status[1] === ITxStatus.BROADCASTED,
    onClick
  };

  return (
    <div>
      <Typography as="p" style={{ marginBottom: '2em' }}>
        {translateRaw('SWAP_INTRO')}
      </Typography>
      <SwapFromToDiagram
        fromSymbol={fromAsset.symbol}
        toSymbol={toAsset.symbol}
        fromAmount={fromAmount.toString()}
        toAmount={toAmount.toString()}
      />
      <VerticalStepper
        currentStep={broadcasting === -1 ? currentTx : broadcasting}
        steps={[approveTx, transferTx]}
      />
    </div>
  );
}
