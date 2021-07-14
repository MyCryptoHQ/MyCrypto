import { ComponentProps } from 'react';

import { ZapReceiptBanner } from '@features/DeFiZap';
import { IZapId, ZAPS_CONFIG } from '@features/DeFiZap/config';
import { MembershipReceiptBanner } from '@features/PurchaseMembership';
import { IMembershipId, MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { fAccount, fContacts, fERC20Web3TxConfigJSON, fSettings, fTxConfig } from '@fixtures';
import { ExtendedContact, ITxType } from '@types';
import { bigify, noOp } from '@utils';

import { ConfirmTransactionUI } from './ConfirmTransaction';
import { constructSenderFromTxConfig } from './helpers';

// Define props
const assetRate = 1.34;
const baseAssetRate = 1.54;
const senderContact = Object.values(fContacts)[0] as ExtendedContact;
const recipientContact = Object.values(fContacts)[1] as ExtendedContact;
const onComplete = noOp;

export default { title: 'Features/ConfirmTx', components: ConfirmTransactionUI };

const Template = (args: ComponentProps<typeof ConfirmTransactionUI>) => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <ConfirmTransactionUI {...args} />
  </div>
);

const defaultProps = {
  settings: fSettings,
  assetRate: assetRate,
  baseAssetRate: baseAssetRate,
  senderContact: senderContact,
  recipientContact: recipientContact,
  onComplete: onComplete,
  txConfig: fTxConfig,
  sender: constructSenderFromTxConfig(fTxConfig, [fAccount])
};

export const ConfirmTransaction = Template.bind({});
ConfirmTransaction.storyName = 'ConfirmTransaction';
ConfirmTransaction.args = {
  ...defaultProps
};

export const ConfirmTxPtx = Template.bind({});
ConfirmTxPtx.storyName = 'ConfirmTxPtx';
ConfirmTxPtx.args = {
  ...defaultProps,
  ptxFee: { amount: bigify('0.01'), fee: bigify('0.01'), rate: 250 }
};

export const ConfirmTxToken = Template.bind({});
ConfirmTxToken.storyName = 'ConfirmTxToken';
ConfirmTxToken.args = {
  ...defaultProps,
  txConfig: fERC20Web3TxConfigJSON
};

export const ConfirmTxMembership = Template.bind({});
ConfirmTxMembership.storyName = 'ConfirmTxMembership';
ConfirmTxMembership.args = {
  ...defaultProps,
  txConfig: fERC20Web3TxConfigJSON,
  txType: ITxType.PURCHASE_MEMBERSHIP,
  customComponent: () => (
    <MembershipReceiptBanner membershipSelected={MEMBERSHIP_CONFIG[IMembershipId.lifetime]} />
  )
};

export const ConfirmTxDefiZap = Template.bind({});
ConfirmTxDefiZap.storyName = 'ConfirmTxDefiZap';
ConfirmTxDefiZap.args = {
  ...defaultProps,
  txConfig: fERC20Web3TxConfigJSON,
  txType: ITxType.DEFIZAP,
  customComponent: () => <ZapReceiptBanner zapSelected={ZAPS_CONFIG[IZapId.unipoolseth]} />
};

// Uncomment this for Figma support:

// (confirmTransaction as any).story = {
//   name: 'ConfirmTransaction',
//   parameters: {
//     design: {
//       type: 'figma',
//       url:
//         'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=325%3A79384'
//     }
//   }
// };

// (confirmTransactionZap as any).story = {
//   name: 'ConfirmTransaction-DeFiZap',
//   parameters: {
//     design: {
//       type: 'figma',
//       url:
//         'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=325%3A79384'
//     }
//   }
// };
