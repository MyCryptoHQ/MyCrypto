import React, { useContext } from 'react';
import * as R from 'ramda';

import { translateRaw } from 'v2/translations';
import { AssetContext } from 'v2/services';
import { TxReceipt, MultiTxReceipt } from 'v2/components/TransactionFlow';
import { StoreAccount, ITxType } from 'v2/types';

import { SwapDisplayData, IAssetPair } from '../types';
import { makeTxConfigFromTransaction } from '../helpers';
import { TxParcel } from 'v2/utils/useTxMulti/types';

interface Props {
  assetPair: IAssetPair;
  transactions: TxParcel[];
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
      tx.txRaw,
      account,
      assetPair.fromAsset,
      assetPair.fromAmount.toString()
    );
  });

  const txReceipts = transactions.map((tx, idx) => {
    return {
      ...txConfigs[idx],
      ...tx.txRaw,
      hash: tx.txHash
    };
  });

  return txReceipts.length === 1 ? (
    <TxReceipt
      txType={ITxType.SWAP}
      txReceipt={txReceipts[0]}
      txConfig={txConfigs[0]}
      completeButtonText={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
      swapDisplay={swapDisplay}
    />
  ) : (
    <MultiTxReceipt
      txType={ITxType.SWAP}
      transactions={transactions}
      transactionsConfigs={txConfigs}
      account={account}
      network={account.network}
      completeButtonText={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
      swapDisplay={swapDisplay}
    />
  );
}
