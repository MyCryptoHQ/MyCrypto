import pick from 'ramda/src/pick';

import { MultiTxReceipt, TxReceipt } from '@components/TransactionFlow';
import { SwapFromToDiagram } from '@components/TransactionFlow/displays';
import { getFiat } from '@config/fiats';
import { makeTxConfigFromTxResponse, makeTxItem } from '@helpers';
import { useAssets, useNetworks, useRates, useSettings } from '@services';
import { getAccountsAssets, useSelector } from '@store';
import { translateRaw } from '@translations';
import { ITxType, StoreAccount, TxParcel } from '@types';

import { stepsContent } from '../config';
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
  const { getAssetByUUID, assets } = useAssets();
  const { settings } = useSettings();
  const { getAssetRate } = useRates();
  const { getNetworkById } = useNetworks();
  const swapDisplay: SwapDisplayData = pick(
    ['fromAsset', 'toAsset', 'fromAmount', 'toAmount'],
    assetPair
  );
  const currentAssets = useSelector(getAccountsAssets);
  // @todo: refactor this to be based on status of tx from StoreProvider
  const txItems = transactions.map((tx, idx) => {
    const txType = idx === transactions.length - 1 ? ITxType.SWAP : ITxType.APPROVAL;
    const txConfig =
      txType === ITxType.SWAP
        ? makeSwapTxConfig(currentAssets)(
            tx.txRaw,
            account,
            assetPair.fromAsset,
            assetPair.fromAmount.toString()
          )
        : makeTxConfigFromTxResponse(tx.txResponse!, assets, account.network, [account]);
    return makeTxItem(txType, txConfig, tx.txHash!, tx.txReceipt);
  });

  const txReceipts = txItems.map(({ txReceipt }) => txReceipt);

  const network = getNetworkById(txItems[0].txConfig.networkId);

  const baseAsset = getAssetByUUID(network.baseAsset)!;

  const baseAssetRate = getAssetRate(baseAsset);

  const fiat = getFiat(settings);

  const customComponent = () => (
    <SwapFromToDiagram
      fromSymbol={swapDisplay.fromAsset.ticker}
      toSymbol={swapDisplay.toAsset.ticker}
      fromAmount={swapDisplay.fromAmount.toString()}
      toAmount={swapDisplay.toAmount.toString()}
      fromUUID={swapDisplay.fromAsset.uuid}
      toUUID={swapDisplay.toAsset.uuid}
    />
  );

  return txReceipts.length === 1 ? (
    <TxReceipt
      disableDynamicTxReceiptDisplay={true}
      txReceipt={txItems[0].txReceipt}
      txConfig={txItems[0].txConfig}
      completeButton={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
      customComponent={customComponent}
    />
  ) : (
    <MultiTxReceipt
      txType={ITxType.SWAP}
      transactions={transactions}
      transactionsConfigs={txItems.map(({ txConfig }) => txConfig)}
      steps={stepsContent}
      account={account}
      network={account.network}
      completeButtonText={translateRaw('SWAP_START_ANOTHER')}
      resetFlow={onSuccess}
      onComplete={onSuccess}
      customComponent={customComponent}
      fiat={fiat}
      baseAssetRate={baseAssetRate}
    />
  );
}
