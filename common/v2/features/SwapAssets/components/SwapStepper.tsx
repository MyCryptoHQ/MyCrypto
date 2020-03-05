import React from 'react';

import VerticalStepper from 'v2/components/VerticalStepper';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from '../types';
import { StoreAccount } from 'v2/types';

import step1SVG from 'assets/images/icn-unlock-wallet.svg';
import step2SVG from 'assets/images/icn-sent.svg';
import { SwapFromToDiagram } from './fields';

interface Props {
  currentStep: number;
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: string;
  toAmount: string;
  account: StoreAccount;
  exchangeRate: string;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  isSubmitting: boolean;
  onSuccess(): void;
}

export default function SwapStepper(props: Props) {
  const {
    currentStep,
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    account,
    exchangeRate,
    isSubmitting,
    onSuccess
  } = props;
  return (
    <VerticalStepper
      currentStep={currentStep}
      steps={[
        {
          title: `Enable ${fromAsset.symbol}`,
          icon: step1SVG,
          content: `Before swapping a token, you must activate the token. Sign an initial transaction to activate ${fromAsset.symbol}`,
          buttonText: `Activate ${fromAsset.symbol}`
        },
        {
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
          buttonText: "Confirm Transaction"
        }
      ]}
    />
  );
}
