import React, { useContext } from 'react';
import * as R from 'ramda';

import { translateRaw } from 'v2/translations';
import { AssetContext } from 'v2/services';
import { TxReceipt } from 'v2/components/TransactionFlow';
import { StoreAccount, ITxType } from 'v2/types';

import { SwapDisplayData, IAssetPair, TxEnveloppe } from '../types';
import { makeTxConfigFromTransaction } from '../helpers';

interface Props {
  assetPair: IAssetPair;
  transactions: TxEnveloppe[];
  account: StoreAccount;
  onSuccess(): void;
}

export default function SwapTransactionReceipt({
  assetPair,
  transactions,
  account,
  onSuccess
}: Props) {
  const { assets: userAssets } = useContext(AssetContext);
  const swapDisplay: SwapDisplayData = R.pick(
    ['fromAsset', 'toAsset', 'fromAmount', 'toAmount'],
    assetPair
  );

  const txConfigs = transactions.map(tx => {
    return makeTxConfigFromTransaction(userAssets)(
      tx.rawTx,
      account,
      assetPair.fromAsset,
      assetPair.fromAmount.toString()
    );
  });

  const txReceipts = transactions.map((tx, idx) => {
    return {
      ...txConfigs[idx],
      ...tx.rawTx,
      txHash: tx.txHash
    };
  });

  return (
    <TxReceipt
      txType={ITxType.SWAP}
      txReceipt={txReceipts[0]}
      txConfig={txConfigs[0]}
      completeButtonText={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
      swapDisplay={swapDisplay}
    />
  );
}
