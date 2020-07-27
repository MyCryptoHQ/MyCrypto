import React from 'react';

import { fTxConfig, fAccount, fSettings } from '@fixtures';
import { ExtendedAddressBook, ITxType } from '@types';
import { noOp, bigify } from '@utils';
import { devContacts } from '@database/seed';
import { IZapConfig, ZAPS_CONFIG, IZapId } from '@features/DeFiZap/config';

import { ConfirmTransactionUI } from './ConfirmTransaction';
import { constructSenderFromTxConfig } from './helpers';

// Define props
const assetRate = 1.34;
const baseAssetRate = 1.54;
const senderContact = Object.values(devContacts)[0] as ExtendedAddressBook;
const recipientContact = Object.values(devContacts)[1] as ExtendedAddressBook;
const onComplete = noOp;

export default { title: 'ConfirmTx' };

export const confirmTransaction = () => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <ConfirmTransactionUI
      settings={fSettings}
      assetRate={assetRate}
      baseAssetRate={baseAssetRate}
      senderContact={senderContact}
      recipientContact={recipientContact}
      onComplete={onComplete}
      txConfig={fTxConfig}
      sender={constructSenderFromTxConfig(fTxConfig, [fAccount])}
    />
  </div>
);

export const confirmTransactionPtx = () => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <ConfirmTransactionUI
      settings={fSettings}
      assetRate={assetRate}
      baseAssetRate={baseAssetRate}
      senderContact={senderContact}
      recipientContact={recipientContact}
      onComplete={onComplete}
      txConfig={fTxConfig}
      sender={constructSenderFromTxConfig(fTxConfig, [fAccount])}
      ptxFee={{ amount: bigify('0.01'), fee: bigify('0.01'), rate: 250 }}
    />
  </div>
);

const defaultZap = IZapId.unipoolseth;
const zapSelected: IZapConfig = ZAPS_CONFIG[defaultZap];

export const confirmTransactionZap = () => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <ConfirmTransactionUI
      settings={fSettings}
      assetRate={assetRate}
      baseAssetRate={baseAssetRate}
      senderContact={senderContact}
      recipientContact={recipientContact}
      txType={ITxType.DEFIZAP}
      zapSelected={zapSelected}
      onComplete={onComplete}
      txConfig={fTxConfig}
      sender={constructSenderFromTxConfig(fTxConfig, [fAccount])}
    />
  </div>
);

// Uncomment this for Figma support:

(confirmTransaction as any).story = {
  name: 'ConfirmTransaction',
  parameters: {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=325%3A79384'
    }
  }
};

(confirmTransactionZap as any).story = {
  name: 'ConfirmTransaction-DeFiZap',
  parameters: {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=325%3A79384'
    }
  }
};
