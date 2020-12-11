import React, { ReactNode } from 'react';

import { ProvidersWrapper } from 'test-utils';

import { Fiats } from '@config';
import { ZapReceiptBanner } from '@features/DeFiZap/components/ZapReceiptBanner';
import { defaultZapId, IZapConfig, ZAPS_CONFIG } from '@features/DeFiZap/config';
import MembershipReceiptBanner from '@features/PurchaseMembership/components/MembershipReceiptBanner';
import { IMembershipId, MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { SwapDisplayData } from '@features/SwapAssets/types';
import {
  fAccount,
  fAssets,
  fContacts,
  fERC20NonWeb3TxConfigJSON,
  fERC20Web3TxReceipt,
  fSettings,
  fTxConfig,
  fTxReceipt
} from '@fixtures';
import { DataContext, IDataContext } from '@services/Store';
import { ExtendedContact, ITxStatus, ITxType } from '@types';
import { bigify, noOp } from '@utils';

import { SwapFromToDiagram } from './displays';
import { constructSenderFromTxConfig } from './helpers';
import { TxReceiptUI } from './TxReceipt';

// Define props
const assetRate = 1.34;
const timestamp = 1583266291;
const txStatus = ITxStatus.SUCCESS;
const senderContact = Object.values(fContacts)[0] as ExtendedContact;
const recipientContact = Object.values(fContacts)[1] as ExtendedContact;
const resetFlow = noOp;
const handleTxCancelRedirect = noOp;
const handleTxSpeedUpRedirect = noOp;

export default { title: 'TxReceipt' };

const wrapInProvider = (component: ReactNode) => (
  <ProvidersWrapper>
    <DataContext.Provider value={({ userActions: [] } as unknown) as IDataContext}>
      {component}
    </DataContext.Provider>
  </ProvidersWrapper>
);

export const transactionReceiptPending = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TxReceiptUI
      settings={fSettings}
      txStatus={ITxStatus.PENDING}
      timestamp={0}
      resetFlow={resetFlow}
      assetRate={assetRate}
      senderContact={senderContact}
      recipientContact={recipientContact}
      txConfig={fTxConfig}
      sender={constructSenderFromTxConfig(fTxConfig, [fAccount])}
      baseAssetRate={assetRate}
      fiat={Fiats.USD}
      handleTxCancelRedirect={handleTxCancelRedirect}
      handleTxSpeedUpRedirect={handleTxSpeedUpRedirect}
    />
  </div>
);

export const transactionReceipt = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TxReceiptUI
      settings={fSettings}
      txStatus={txStatus}
      displayTxReceipt={fTxReceipt}
      timestamp={timestamp}
      resetFlow={resetFlow}
      assetRate={assetRate}
      senderContact={senderContact}
      recipientContact={recipientContact}
      txConfig={fTxConfig}
      sender={constructSenderFromTxConfig(fTxConfig, [fAccount])}
      baseAssetRate={assetRate}
      fiat={Fiats.USD}
      handleTxCancelRedirect={handleTxCancelRedirect}
      handleTxSpeedUpRedirect={handleTxSpeedUpRedirect}
    />
  </div>
);

export const transactionReceiptToken = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TxReceiptUI
      settings={fSettings}
      txStatus={txStatus}
      displayTxReceipt={fERC20Web3TxReceipt}
      timestamp={timestamp}
      resetFlow={resetFlow}
      assetRate={assetRate}
      senderContact={senderContact}
      recipientContact={recipientContact}
      txConfig={{ ...fERC20NonWeb3TxConfigJSON, network: fAccount.network }}
      sender={constructSenderFromTxConfig(fTxConfig, [fAccount])}
      baseAssetRate={assetRate}
      fiat={Fiats.USD}
      handleTxCancelRedirect={handleTxCancelRedirect}
      handleTxSpeedUpRedirect={handleTxSpeedUpRedirect}
    />
  </div>
);

const zapSelected: IZapConfig = ZAPS_CONFIG[defaultZapId];

export const transactionReceiptDeFiZap = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TxReceiptUI
      settings={fSettings}
      txStatus={txStatus}
      txType={ITxType.DEFIZAP}
      customComponent={() => <ZapReceiptBanner zapSelected={zapSelected} />}
      displayTxReceipt={fERC20Web3TxReceipt}
      timestamp={timestamp}
      resetFlow={resetFlow}
      assetRate={assetRate}
      senderContact={senderContact}
      recipientContact={recipientContact}
      txConfig={{ ...fERC20NonWeb3TxConfigJSON, network: fAccount.network }}
      sender={constructSenderFromTxConfig(fTxConfig, [fAccount])}
      baseAssetRate={assetRate}
      fiat={Fiats.USD}
      handleTxCancelRedirect={handleTxCancelRedirect}
      handleTxSpeedUpRedirect={handleTxSpeedUpRedirect}
    />
  </div>
);

const membershipSelected = MEMBERSHIP_CONFIG[IMembershipId.threemonths];

export const transactionReceiptMembership = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TxReceiptUI
      settings={fSettings}
      txReceipt={fTxReceipt}
      txConfig={fTxConfig}
      txType={ITxType.PURCHASE_MEMBERSHIP}
      customComponent={() => <MembershipReceiptBanner membershipSelected={membershipSelected} />}
      timestamp={timestamp}
      txStatus={txStatus}
      assetRate={assetRate}
      displayTxReceipt={fERC20Web3TxReceipt}
      senderContact={senderContact}
      recipientContact={recipientContact}
      sender={constructSenderFromTxConfig(fTxConfig, [fAccount])}
      contractName={'MyCrypto Membership'}
      resetFlow={resetFlow}
      baseAssetRate={assetRate}
      fiat={Fiats.USD}
      handleTxCancelRedirect={handleTxCancelRedirect}
      handleTxSpeedUpRedirect={handleTxSpeedUpRedirect}
    />
  </div>
);

const swapDisplay: SwapDisplayData = {
  fromAsset: fAssets[0],
  toAsset: fAssets[10],
  fromAmount: bigify('10'),
  toAmount: bigify('0.5')
};

export const transactionReceiptSwap = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TxReceiptUI
      settings={fSettings}
      txReceipt={fTxReceipt}
      txConfig={fTxConfig}
      txType={ITxType.PURCHASE_MEMBERSHIP}
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
      timestamp={timestamp}
      txStatus={txStatus}
      assetRate={assetRate}
      displayTxReceipt={fERC20Web3TxReceipt}
      senderContact={senderContact}
      recipientContact={recipientContact}
      sender={constructSenderFromTxConfig(fTxConfig, [fAccount])}
      resetFlow={resetFlow}
      baseAssetRate={assetRate}
      fiat={Fiats.USD}
      handleTxCancelRedirect={handleTxCancelRedirect}
      handleTxSpeedUpRedirect={handleTxSpeedUpRedirect}
    />
  </div>
);

// Uncomment this for Figma support:

(transactionReceipt as any).story = {
  name: 'TransactionReceipt-Standard',
  parameters: {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=8544%3A116927'
    }
  }
};

(transactionReceiptDeFiZap as any).story = {
  name: 'TransactionReceipt-DeFiZap',
  parameters: {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=8544%3A117793'
    }
  }
};
