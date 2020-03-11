import React from 'react';

import VerticalStepper from 'v2/components/VerticalStepper';
import { ISwapAsset } from '../types';
import { SwapFromToDiagram } from 'v2/components/TransactionFlow/displays';

import step1SVG from 'assets/images/icn-send.svg';
import step2SVG from 'assets/images/icn-receive.svg';
import { translateRaw } from 'v2/translations';
import { Typography } from 'v2/components';

interface Props {
  currentStep: number;
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: string;
  toAmount: string;
  onClick?(): void;
}

export default function ConfirmSwapMultiTx(props: Props) {
  const { currentStep, fromAsset, toAsset, fromAmount, toAmount, onClick } = props;

  const tokenStep = {
    title: translateRaw('APPROVE_SWAP'),
    icon: step1SVG,
    content: translateRaw('SWAP_STEP1_TEXT', { $token: fromAsset.symbol }),
    buttonText: translateRaw('APPROVE_SWAP'),
    onClick
  };

  const transferStep = {
    title: translateRaw('COMPLETE_SWAP'),
    icon: step2SVG,
    content: translateRaw('SWAP_STEP2_TEXT'),
    buttonText: translateRaw('CONFIRM_TRANSACTION'),
    onClick
  };

  return (
    <div>
      <Typography>{translateRaw('SWAP_INTRO')}</Typography>
      <SwapFromToDiagram
        fromSymbol={fromAsset.symbol}
        toSymbol={toAsset.symbol}
        fromAmount={fromAmount}
        toAmount={toAmount}
      />
      <VerticalStepper currentStep={currentStep} steps={[tokenStep, transferStep]} />
    </div>
  );
}
