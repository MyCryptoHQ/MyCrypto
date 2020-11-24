import React, { useContext } from 'react';

import { ConfirmTransaction, SwapFromToDiagram } from '@components';
import { StoreContext } from '@services';
import { ITxMultiConfirmProps, ITxType } from '@types';

import { makeSwapTxConfig } from '../helpers';
import { IAssetPair } from '../types';

export default function ConfirmSwap({
  flowConfig,
  account,
  transactions,
  currentTxIdx,
  onComplete
}: ITxMultiConfirmProps) {
  const { fromAsset, toAsset, fromAmount, toAmount } = flowConfig as IAssetPair;
  const { assets: getAssets } = useContext(StoreContext);

  const currentAssets = getAssets();

  const txConfigs = transactions.map((tx) =>
    makeSwapTxConfig(currentAssets)(tx.txRaw, account, fromAsset, fromAmount.toString())
  );

  const txConfig = txConfigs[currentTxIdx];

  return (
    <ConfirmTransaction
      resetFlow={() => onComplete && onComplete()}
      onComplete={() => onComplete && onComplete()}
      txConfig={txConfig}
      txType={ITxType.SWAP}
      customComponent={() => (
        <SwapFromToDiagram
          fromSymbol={fromAsset.ticker}
          toSymbol={toAsset.ticker}
          fromUUID={fromAsset.uuid}
          toUUID={toAsset.uuid}
          fromAmount={fromAmount.toString()}
          toAmount={toAmount.toString()}
        />
      )}
    />
  );
}
