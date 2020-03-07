import React from 'react';

import VerticalStepper from 'v2/components/VerticalStepper';
import { ISwapAsset } from '../types';
import { SwapFromToDiagram } from 'v2/components/TransactionFlow/displays';

import step1SVG from 'assets/images/icn-unlock-wallet.svg';
import step2SVG from 'assets/images/icn-sent.svg';
import { translateRaw } from 'v2/translations';

interface Props {
  currentStep: number;
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: string;
  toAmount: string;
}

export default function SwapStepper(props: Props) {
  const { currentStep, fromAsset, toAsset, fromAmount, toAmount } = props;

  const tokenStep = {
    title: `Enable ${fromAsset.symbol}`,
    icon: step1SVG,
    content: translateRaw('SWAP_STEP1_TEXT', { $token: fromAsset.symbol }),
    buttonText: `Activate ${fromAsset.symbol}`
  };

  const transferStep = {
    title: 'Complete Transaction',
    icon: step2SVG,
    content: (
      <>
        <text>whatever</text>
        <SwapFromToDiagram
          fromSymbol={fromAsset.symbol}
          toSymbol={toAsset.symbol}
          fromAmount={fromAmount}
          toAmount={toAmount}
        />
      </>
    ),
    buttonText: 'Confirm Transaction'
  };

  return <VerticalStepper currentStep={currentStep} steps={[tokenStep, transferStep]} />;
}
