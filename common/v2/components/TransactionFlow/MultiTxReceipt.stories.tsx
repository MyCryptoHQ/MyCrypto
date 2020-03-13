import React from 'react';

import { fTxConfig, fTxReceipts, fTxConfigs, fAssets } from '@fixtures';
import { ITxStatus, ExtendedAddressBook, ITxType, TSymbol } from 'v2/types';
import { noOp, bigify } from 'v2/utils';
import { devContacts } from 'v2/database/seed';
import { IZapConfig, ZAPS_CONFIG, defaultZapId } from 'v2/features/DeFiZap/config';

import { MultiTxReceiptUI, TxReceiptData } from './MultiTxReceipt';
import { SwapDisplayData, ISwapAsset } from 'v2/features/SwapAssets/types';

// Define props
const assetRate = 1.34;
const timestamp = 1583266291;
const txStatus = ITxStatus.SUCCESS;
const resetFlow = noOp;
const DAI: ISwapAsset = { name: 'DAI Stablecoin v2.0', symbol: 'DAI' as TSymbol };
const ETH: ISwapAsset = { name: 'Ethereum', symbol: 'ETH' as TSymbol };
const swapDisplay: SwapDisplayData = {
  fromAsset: DAI,
  toAsset: ETH,
  fromAmount: bigify('10'),
  toAmount: bigify('0.5')
};
const transactions: TxReceiptData[] = [
  {
    label: "Approve",
    config: fTxConfigs[0],
    receipt: fTxReceipts[0],
    status: ITxStatus.SUCCESS,
    timestamp: timestamp
  },
  {
    label: "Send Transaction",
    config: fTxConfigs[1],
    receipt: fTxReceipts[1],
    status: ITxStatus.PENDING,
    timestamp: timestamp
  }
]

export default { title: 'MultiTxReceipt' };

export const swapTransactionReceipt = () => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <MultiTxReceiptUI
      txType={ITxType.SWAP}
      transactions={transactions}
      resetFlow={resetFlow}
      swapDisplay={swapDisplay}
    />
  </div>
);
