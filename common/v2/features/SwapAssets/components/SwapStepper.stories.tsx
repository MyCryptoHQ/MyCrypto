import React from 'react';
import SwapStepper from './SwapStepper';
import { ISwapAsset } from '../types';
import { TSymbol } from 'v2/types';

export default { title: 'SwapStepper' };

const DAI: ISwapAsset = { name: 'DAI Stablecoin v2.0', symbol: 'DAI' as TSymbol };
const ETH: ISwapAsset = { name: 'Ethereum', symbol: 'ETH' as TSymbol };
const daiAmount = '100';
const ethAmount = '0.5';

export const daiToEth = () => (
  <SwapStepper
    currentStep={0}
    fromAsset={DAI}
    toAsset={ETH}
    fromAmount={daiAmount}
    toAmount={ethAmount}
  />
);

export const daiToEthStep2 = () => (
  <SwapStepper
    currentStep={1}
    fromAsset={DAI}
    toAsset={ETH}
    fromAmount={daiAmount}
    toAmount={ethAmount}
  />
);
