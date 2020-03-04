import React from 'react';

import VerticalStepper from 'v2/components/VerticalStepper';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from '../types';
import { StoreAccount } from 'v2/types';

import step1SVG from 'assets/images/icn-unlock-wallet.svg';
import step2SVG from 'assets/images/icn-sent.svg';

interface Props {
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

export default function ConfirmSwapNew(props: Props) {
  const {
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
      steps={[
        { title: `Enable ${fromAsset.symbol}`, icon: step1SVG },
        {
          title: 'Complete Transaction',
          icon: step2SVG
        }
      ]}
    />
  );
}
