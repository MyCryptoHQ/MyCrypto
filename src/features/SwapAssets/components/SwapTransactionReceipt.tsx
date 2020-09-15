import React, { useContext } from 'react';

import pick from 'ramda/src/pick';

import { MultiTxReceipt, TxReceipt } from '@components/TransactionFlow';
import { getFiat } from '@config/fiats';
import { SettingsContext, StoreContext, useAssets, useRates } from '@services';
import { translateRaw } from '@translations';
import { ITxType, StoreAccount } from '@types';
import { TxParcel } from '@utils';
import { makeTxItem } from '@utils/transaction';

import { makeSwapTxConfig } from '../helpers';
import { IAssetPair, SwapDisplayData } from '../types';

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
  const { assets: getAssets } = useContext(StoreContext);
  const { getAssetByUUID } = useAssets();
  const { settings } = useContext(SettingsContext);
  const { getAssetRate } = useRates();
  const swapDisplay: SwapDisplayData = pick(
    ['fromAsset', 'toAsset', 'fromAmount', 'toAmount'],
    assetPair
  );
  const currentAssets = getAssets();
  // @todo: refactor this to be based on status of tx from StoreProvider
  const txItems = transactions.map((tx, idx) => {
    const txConfig = makeSwapTxConfig(currentAssets)(
      tx.txRaw,
      account,
      assetPair.fromAsset,
      assetPair.fromAmount.toString()
    );
    const txType = idx === transactions.length - 1 ? ITxType.PURCHASE_MEMBERSHIP : ITxType.APPROVAL;
    return makeTxItem(txType, txConfig, tx.txResponse, tx.txReceipt);
  });

  const txReceipts = txItems.map(({ txReceipt }) => txReceipt);

  const baseAsset = getAssetByUUID(txItems[0].txConfig.network.baseAsset)!;

  const baseAssetRate = getAssetRate(baseAsset);

  const fiat = getFiat(settings);

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
      fiat={fiat}
      baseAssetRate={baseAssetRate}
    />
  );
}
