import React from 'react';

import { ISwapAsset, TSymbol, TUuid } from '@types';
import { bigify, DAIUUID, ETHUUID } from '@utils';
import ConfirmSwapMultiTx from './ConfirmSwapMultiTx';
import { LAST_CHANGED_AMOUNT } from '../types';

export default { title: 'ConfirmSwapMultiTx' };

const DAI: ISwapAsset = {
  name: 'DAI Stablecoin v2.0',
  symbol: 'DAI' as TSymbol,
  uuid: DAIUUID as TUuid
};
const ETH: ISwapAsset = { name: 'Ethereum', symbol: 'ETH' as TSymbol, uuid: ETHUUID as TUuid };
const daiAmount = bigify('100');
const ethAmount = bigify('0.5');
const assetPair = {
  fromAsset: DAI,
  fromAmount: daiAmount,
  toAmount: ethAmount,
  toAsset: ETH,
  lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
  markup: bigify('0.1'),
  rate: bigify('0.0045')
};

export const daiToEth = () => (
  <ConfirmSwapMultiTx currentTxIdx={0} assetPair={assetPair} transactions={[]} />
);

export const daiToEthStep2 = () => (
  <ConfirmSwapMultiTx currentTxIdx={1} assetPair={assetPair} transactions={[]} />
);
