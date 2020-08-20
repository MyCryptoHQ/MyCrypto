import React from 'react';

import { fTxConfigs, fAccount, fNetwork, fTxParcels } from '@fixtures';
import { ITxType, TSymbol, ITxConfig, TUuid, ISwapAsset } from '@types';
import { noOp, bigify, DAIUUID, ETHUUID } from '@utils';

import MultiTxReceipt from './MultiTxReceipt';
import { SwapDisplayData } from '@features/SwapAssets/types';

// Define props
const resetFlow = noOp;
const DAI: ISwapAsset = {
  name: 'DAI Stablecoin v2.0',
  symbol: 'DAI' as TSymbol,
  uuid: DAIUUID as TUuid
};
const ETH: ISwapAsset = { name: 'Ethereum', symbol: 'ETH' as TSymbol, uuid: ETHUUID as TUuid };
const swapDisplay: SwapDisplayData = {
  fromAsset: DAI,
  toAsset: ETH,
  fromAmount: bigify('10'),
  toAmount: bigify('0.5')
};

const transactionsConfigs: ITxConfig[] = fTxConfigs;

export default { title: 'MultiTxReceipt' };

export const swapTransactionReceipt = () => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <MultiTxReceipt
      txType={ITxType.SWAP}
      transactions={fTxParcels}
      transactionsConfigs={transactionsConfigs}
      account={fAccount}
      network={fNetwork}
      resetFlow={resetFlow}
      onComplete={resetFlow}
      swapDisplay={swapDisplay}
    />
  </div>
);
