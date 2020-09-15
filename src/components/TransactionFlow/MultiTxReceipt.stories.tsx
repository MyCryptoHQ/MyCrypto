import React from 'react';

import { Fiats } from '@config';
import { SwapDisplayData } from '@features/SwapAssets/types';
import { fAccount, fNetwork, fTxConfigs, fTxParcels } from '@fixtures';
import { ISwapAsset, ITxConfig, ITxType, TTicker, TUuid } from '@types';
import { bigify, DAIUUID, ETHUUID, noOp } from '@utils';

import MultiTxReceipt from './MultiTxReceipt';

// Define props
const resetFlow = noOp;
const DAI: ISwapAsset = {
  name: 'DAI Stablecoin v2.0',
  ticker: 'DAI' as TTicker,
  uuid: DAIUUID as TUuid
};
const ETH: ISwapAsset = { name: 'Ethereum', ticker: 'ETH' as TTicker, uuid: ETHUUID as TUuid };
const swapDisplay: SwapDisplayData = {
  fromAsset: DAI,
  toAsset: ETH,
  fromAmount: bigify('10'),
  toAmount: bigify('0.5')
};

const transactionsConfigs: ITxConfig[] = fTxConfigs;
const baseAssetRate = 250;

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
      baseAssetRate={baseAssetRate}
      fiat={Fiats.USD}
    />
  </div>
);
