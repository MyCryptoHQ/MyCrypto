import { ComponentProps } from 'react';

import { DAIUUID, ETHUUID, Fiats } from '@config';
import { stepsContent } from '@features/SwapAssets/config';
import { SwapDisplayData } from '@features/SwapAssets/types';
import { fAccount, fNetwork, fTxConfigs, fTxParcels } from '@fixtures';
import { ITxConfig, ITxType, TTicker, TUuid } from '@types';
import { bigify, noOp } from '@utils';

import { SwapFromToDiagram } from './displays';
import MultiTxReceiptComponent from './MultiTxReceipt';

const swapDisplay: SwapDisplayData = {
  fromAsset: {
    name: 'DAI Stablecoin v2.0',
    ticker: 'DAI' as TTicker,
    uuid: DAIUUID as TUuid
  },
  toAsset: {
    name: 'Ethereum',
    ticker: 'ETH' as TTicker,
    uuid: ETHUUID as TUuid
  },
  fromAmount: bigify('10'),
  toAmount: bigify('0.5')
};

const transactionsConfigs: ITxConfig[] = fTxConfigs;
const baseAssetRate = 250;

export default { title: 'Features/MultiTxReceipt', components: MultiTxReceiptComponent };
const Template = (args: ComponentProps<typeof MultiTxReceiptComponent>) => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <MultiTxReceiptComponent {...args} />
  </div>
);

export const SwapTxReceipt = Template.bind({});
SwapTxReceipt.args = {
  txType: ITxType.SWAP,
  transactions: fTxParcels,
  transactionsConfigs: transactionsConfigs,
  steps: stepsContent,
  account: fAccount,
  network: fNetwork,
  resetFlow: noOp,
  onComplete: noOp,
  baseAssetRate: baseAssetRate,
  fiats: Fiats.USD,
  customComponent: () => (
    <SwapFromToDiagram
      fromSymbol={swapDisplay.fromAsset.ticker}
      toSymbol={swapDisplay.toAsset.ticker}
      fromAmount={swapDisplay.fromAmount.toString()}
      toAmount={swapDisplay.toAmount.toString()}
      fromUUID={swapDisplay.fromAsset.uuid}
      toUUID={swapDisplay.toAsset.uuid}
    />
  )
};

export const TokenMigrationTxReceipt = Template.bind({});
TokenMigrationTxReceipt.args = {
  txType: ITxType.REP_TOKEN_MIGRATION,
  transactions: [fTxParcels[0], fTxParcels[0]],
  transactionsConfigs: transactionsConfigs,
  steps: stepsContent,
  account: fAccount,
  network: fNetwork,
  resetFlow: noOp,
  onComplete: noOp,
  baseAssetRate: baseAssetRate,
  fiats: Fiats.USD,
  customComponent: () => (
    <SwapFromToDiagram
      fromSymbol={swapDisplay.fromAsset.ticker}
      toSymbol={swapDisplay.toAsset.ticker}
      fromAmount={swapDisplay.fromAmount.toString()}
      toAmount={swapDisplay.toAmount.toString()}
      fromUUID={swapDisplay.fromAsset.uuid}
      toUUID={swapDisplay.toAsset.uuid}
    />
  )
};
