import React from 'react';
import ConfirmSwapMultiTx from './ConfirmSwapMultiTx';
import { ISwapAsset } from '../types';
import { TSymbol } from 'v2/types';

export default { title: 'ConfirmSwapMultiTx' };

const DAI: ISwapAsset = { name: 'DAI Stablecoin v2.0', symbol: 'DAI' as TSymbol };
const ETH: ISwapAsset = { name: 'Ethereum', symbol: 'ETH' as TSymbol };
const daiAmount = '100';
const ethAmount = '0.5';

export const daiToEth = () => (
  <ConfirmSwapMultiTx
    currentStep={0}
    fromAsset={DAI}
    toAsset={ETH}
    fromAmount={daiAmount}
    toAmount={ethAmount}
  />
);

export const daiToEthStep2 = () => (
  <ConfirmSwapMultiTx
    currentStep={1}
    fromAsset={DAI}
    toAsset={ETH}
    fromAmount={daiAmount}
    toAmount={ethAmount}
  />
);
