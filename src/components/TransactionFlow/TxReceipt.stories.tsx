import { ComponentProps } from 'react';

import { Button, LinkApp } from '@components';
import { Fiats, MYCRYPTO_FAUCET_LINK } from '@config';
import { ZapReceiptBanner } from '@features/DeFiZap/components/ZapReceiptBanner';
import { defaultZapId, ZAPS_CONFIG } from '@features/DeFiZap/config';
import MembershipReceiptBanner from '@features/PurchaseMembership/components/MembershipReceiptBanner';
import { IMembershipId, MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { SwapDisplayData } from '@features/SwapAssets/types';
import {
  fAccount,
  fAssets,
  fContacts,
  fERC20NonWeb3TxConfigJSON,
  fERC20Web3TxReceipt,
  fNetworks,
  fSettings,
  fTxConfig
} from '@fixtures';
import translate, { translateRaw } from '@translations';
import { ExtendedContact, ITxStatus, ITxType } from '@types';
import { bigify, generateTweet, noOp } from '@utils';

import { FaucetReceiptBanner, SwapFromToDiagram } from './displays';
import { constructSenderFromTxConfig } from './helpers';
import { TxReceiptUI as TxReceiptUIComponent } from './TxReceipt';

// Define props
const defaultProps = {
  settings: fSettings,
  txStatus: ITxStatus.SUCCESS,
  timestamp: 1583266291,
  assetRate: 1.34,
  baseAssetRate: 1.34,
  senderContact: Object.values(fContacts)[0] as ExtendedContact,
  recipientContact: Object.values(fContacts)[1] as ExtendedContact,
  txConfig: fTxConfig,
  sender: constructSenderFromTxConfig(fTxConfig, [fAccount]),
  fiat: Fiats.USD,
  resetFlow: noOp,
  handleTxCancelRedirect: noOp,
  handleTxSpeedUpRedirect: noOp,
  network: fAccount.network
};

export default { title: 'Features/TxReceipt', components: TxReceiptUIComponent };

const Template = (args: ComponentProps<typeof TxReceiptUIComponent>) => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TxReceiptUIComponent {...args} />
  </div>
);

export const TxReceipt = Template.bind({});
TxReceipt.storyName = 'TxReceipt';
TxReceipt.args = {
  ...defaultProps
};

export const TxReceiptPending = Template.bind({});
TxReceiptPending.storyName = 'TxReceiptPending';
TxReceiptPending.args = {
  ...defaultProps,
  txStatus: ITxStatus.PENDING
};

export const TxReceiptToken = Template.bind({});
TxReceiptToken.storyName = 'TxReceiptToken';
TxReceiptToken.args = {
  ...defaultProps,
  displayTxReceipt: fERC20Web3TxReceipt,
  txConfig: { ...fERC20NonWeb3TxConfigJSON, network: fAccount.network }
};

export const TxReceiptDeFiZap = Template.bind({});
TxReceiptDeFiZap.storyName = 'TxReceiptDeFiZap';
TxReceiptDeFiZap.args = {
  ...defaultProps,
  txType: ITxType.DEFIZAP,
  txConfig: { ...fERC20NonWeb3TxConfigJSON, network: fAccount.network },
  customComponent: () => <ZapReceiptBanner zapSelected={ZAPS_CONFIG[defaultZapId]} />
};

export const TxReceiptMembership = Template.bind({});
TxReceiptMembership.storyName = 'TxReceiptMembership';
TxReceiptMembership.args = {
  ...defaultProps,
  txType: ITxType.PURCHASE_MEMBERSHIP,
  txConfig: { ...fERC20NonWeb3TxConfigJSON, network: fAccount.network },
  contractName: 'MyCrypto Membership',
  customComponent: () => (
    <MembershipReceiptBanner membershipSelected={MEMBERSHIP_CONFIG[IMembershipId.twelvemonths]} />
  )
};

export const TxReceiptSwap = Template.bind({});
TxReceiptSwap.storyName = 'TxReceiptSwap';
TxReceiptSwap.args = {
  ...defaultProps,
  txType: ITxType.PURCHASE_MEMBERSHIP,
  txConfig: { ...fERC20NonWeb3TxConfigJSON, network: fAccount.network },
  customComponent: () => {
    const swapDisplay: SwapDisplayData = {
      fromAsset: fAssets[0],
      toAsset: fAssets[10],
      fromAmount: bigify('10'),
      toAmount: bigify('0.5')
    };
    return (
      <SwapFromToDiagram
        fromSymbol={swapDisplay.fromAsset.ticker}
        toSymbol={swapDisplay.toAsset.ticker}
        fromAmount={swapDisplay.fromAmount.toString()}
        toAmount={swapDisplay.toAmount.toString()}
        fromUUID={swapDisplay.fromAsset.uuid}
        toUUID={swapDisplay.toAsset.uuid}
      />
    );
  }
};

export const TxReceiptFaucet = Template.bind({});
TxReceiptFaucet.storyName = 'TxReceiptFaucet';
TxReceiptFaucet.args = {
  ...defaultProps,
  txType: ITxType.FAUCET,
  txStatus: ITxStatus.PENDING,
  txConfig: { ...fERC20NonWeb3TxConfigJSON, network: fAccount.network },
  customBroadcastText: translateRaw('FAUCET_SUCCESS'),
  queryStringsDisabled: true,
  customComponent: () => (
    <FaucetReceiptBanner network={fNetworks[1]} received="1000000000000000000" />
  ),
  completeButton: () => (
    <LinkApp
      href={generateTweet(
        translateRaw('FAUCET_TWEET', {
          $faucet_url: MYCRYPTO_FAUCET_LINK
        })
      )}
      isExternal={true}
    >
      <Button colorScheme={'inverted'} fullwidth={true} className="TransactionReceipt-tweet">
        <i className="sm-icon sm-logo-twitter TransactionReceipt-tweet-icon" />{' '}
        <span className="TransactionReceipt-tweet-text">{translate('FAUCET_SHARE')}</span>
      </Button>
    </LinkApp>
  )
};

// Uncomment this for Figma support:

// (transactionReceipt as any).story = {
//   name: 'TransactionReceipt-Standard',
//   parameters: {
//     design: {
//       type: 'figma',
//       url:
//         'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=8544%3A116927'
//     }
//   }
// };

// (transactionReceiptDeFiZap as any).story = {
//   name: 'TransactionReceipt-DeFiZap',
//   parameters: {
//     design: {
//       type: 'figma',
//       url:
//         'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=8544%3A117793'
//     }
//   }
// };
