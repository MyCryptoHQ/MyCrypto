import React from 'react';
import * as R from 'ramda';

import { SwapFromToDiagram } from 'v2/components/TransactionFlow/displays';
import { VerticalStepper, Typography } from 'v2/components';
import { translateRaw } from 'v2/translations';

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
  const status = R.path(['status'], transactions[0]);

  const approveTx = {
    title: translateRaw('APPROVE_SWAP'),
    icon: step1SVG,
    content: translateRaw('SWAP_STEP1_TEXT', { $token: fromAsset.symbol }),
    buttonText: `${status} ${translateRaw('APPROVE_SWAP')}`,
    onClick
  };

  const transferTx = {
    title: translateRaw('COMPLETE_SWAP'),
    icon: step2SVG,
    content: translateRaw('SWAP_STEP2_TEXT'),
    buttonText: ` ${translateRaw('CONFIRM_TRANSACTION')}`,
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
      <VerticalStepper currentStep={currentTx} steps={[approveTx, transferTx]} />
    </div>
  );
}
