import React, { useContext } from 'react';
import pick from 'ramda/src/pick';

import { translateRaw } from '@translations';
import { AssetContext } from '@services';
import { TxReceipt, MultiTxReceipt } from '@components/TransactionFlow';
import { StoreAccount, ITxType } from '@types';

import { SwapDisplayData, IAssetPair } from '../types';
import { makeTxConfigFromTransaction } from '../helpers';
import { TxParcel } from '@utils/useTxMulti/types';

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
  const swapDisplay: SwapDisplayData = pick(
    ['fromAsset', 'toAsset', 'fromAmount', 'toAmount'],
    assetPair
  );

  const txConfigs = transactions.map((tx) => {
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
