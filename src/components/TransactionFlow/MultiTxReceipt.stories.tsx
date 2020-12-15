import React, { ReactNode } from 'react';

import { DAIUUID, ETHUUID, Fiats } from '@config';
import { stepsContent } from '@features/SwapAssets/config';
import { SwapDisplayData } from '@features/SwapAssets/types';
import { fAccount, fNetwork, fSettings, fTxConfigs, fTxParcels } from '@fixtures';
import { RatesContext } from '@services';
import { DataContext, IDataContext } from '@services/Store';
import { ISwapAsset, ITxConfig, ITxType, TTicker, TUuid } from '@types';
import { bigify, noOp } from '@utils';

import { SwapFromToDiagram } from './displays';
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

const wrapInProvider = (component: ReactNode) => (
  <DataContext.Provider value={({ settings: fSettings } as unknown) as IDataContext}>
    <RatesContext.Provider value={({ rates: {}, trackAsset: noOp } as unknown) as any}>
      {component}
    </RatesContext.Provider>
  </DataContext.Provider>
);

export default { title: 'MultiTxReceipt' };

export const swapTransactionReceipt = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <MultiTxReceipt
      txType={ITxType.SWAP}
      transactions={fTxParcels}
      transactionsConfigs={transactionsConfigs}
      steps={stepsContent}
      account={fAccount}
      network={fNetwork}
      resetFlow={resetFlow}
      onComplete={resetFlow}
      customComponent={() => (
        <SwapFromToDiagram
          fromSymbol={swapDisplay.fromAsset.ticker}
          toSymbol={swapDisplay.toAsset.ticker}
          fromAmount={swapDisplay.fromAmount.toString()}
          toAmount={swapDisplay.toAmount.toString()}
          fromUUID={swapDisplay.fromAsset.uuid}
          toUUID={swapDisplay.toAsset.uuid}
        />
      )}
      baseAssetRate={baseAssetRate}
      fiat={Fiats.USD}
    />
  </div>
);

export const tokenMigrationTransactionReceipt = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <MultiTxReceipt
      txType={ITxType.REP_TOKEN_MIGRATION}
      transactions={[fTxParcels[0], fTxParcels[0]]}
      transactionsConfigs={transactionsConfigs}
      steps={stepsContent}
      account={fAccount}
      network={fNetwork}
      resetFlow={resetFlow}
      onComplete={resetFlow}
      baseAssetRate={baseAssetRate}
      fiat={Fiats.USD}
    />
  </div>
);
