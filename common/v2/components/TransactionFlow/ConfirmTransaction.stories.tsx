import React from 'react';

import { fTxConfig, fAccount } from '@fixtures';
import { ExtendedAddressBook } from 'v2/types';
import { ITxType } from 'v2/types/transactionFlow';
import { noOp } from 'v2/utils';
import { devContacts } from 'v2/database/seed';
import { IZapConfig, ZAPS_CONFIG, IZapId } from 'v2/features/DeFiZap/config';

import { ConfirmTransactionUI } from './ConfirmTransaction';
import { constructSenderFromTxConfig } from './helpers';

// Define props
const assetRate = 1.34;
const baseAssetRate = 1.54;
const senderContact = devContacts[0] as ExtendedAddressBook;
const recipientContact = devContacts[1] as ExtendedAddressBook;
const onComplete = noOp;

export default { title: 'ConfirmTx' };

export const confirmTransaction = () => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <ConfirmTransactionUI
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

const defaultZap = IZapId.unipoolseth;
const zapSelected: IZapConfig = ZAPS_CONFIG[defaultZap];

export const confirmTransactionZap = () => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <ConfirmTransactionUI
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
