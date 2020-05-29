import React, { useContext } from 'react';
import pick from 'ramda/src/pick';

import { translateRaw } from '@translations';
import { AssetContext } from '@services';
import { TxReceipt, MultiTxReceipt } from '@components/TransactionFlow';
import { StoreAccount, ITxType, ITxStatus } from '@types';
import { TxParcel, constructTxReceiptFromTransactionReceipt } from '@utils';

import { SwapDisplayData, IAssetPair } from '../types';
import { makeSwapTxConfig } from '../helpers';

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

  // @todo: refactor this to be based on status of tx from StoreProvider
  const txItems = transactions.map((tx, idx) => {
    const txConfig = makeSwapTxConfig(userAssets)(
      tx.txRaw,
      account,
      assetPair.fromAsset,
      assetPair.fromAmount.toString()
    );
    const txType = idx === transactions.length - 1 ? ITxType.PURCHASE_MEMBERSHIP : ITxType.APPROVAL;
    if (!tx.txReceipt) {
      return {
        txReceipt: constructTxReceiptFromTransactionReceipt(tx.txReceipt!)(
          txType,
          txConfig,
          account.assets,
          ITxStatus.PENDING
        ),
        txConfig
      };
    } else {
      const status = tx.txReceipt.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
      return {
        txReceipt: constructTxReceiptFromTransactionReceipt(tx.txReceipt)(
          txType,
          txConfig,
          account.assets,
          status
        ),
        txConfig
      };
    }
  });

  const txReceipts = txItems.map(({ txReceipt }) => txReceipt);

  return txReceipts.length === 1 ? (
    <TxReceipt
      txReceipt={txItems[0].txReceipt}
      txConfig={txItems[0].txConfig}
      completeButtonText={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
      swapDisplay={swapDisplay}
    />
  ) : (
    <MultiTxReceipt
      txType={ITxType.SWAP}
      transactions={transactions}
      transactionsConfigs={txItems.map(({ txConfig }) => txConfig)}
      account={account}
      network={account.network}
      completeButtonText={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
      swapDisplay={swapDisplay}
    />
  );
}
