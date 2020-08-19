import { IStory, WalletId } from '@types';
import { IS_DEV, IS_ELECTRON, hasWeb3Provider, IS_STAGING, IS_PROD } from '@utils';
import {
  InsecureWalletWarning,
  LedgerNanoSDecrypt,
  KeystoreDecrypt,
  MnemonicDecrypt,
  PrivateKeyDecrypt,
  TrezorDecrypt,
  Web3ProviderDecrypt,
  Web3ProviderInstall,
  ViewOnlyDecrypt,
  WalletConnectDecrypt,
  LedgerDecrypt,
  TrezorUnlock,
  MnemonicUnlock
} from '@components';
import { withWalletConnect } from '@services/WalletService';

import { NetworkSelectPanel } from './components';

// This const is used to disable non supported wallets
// only if it is not the Desktop App and not the Dev environment
export const IS_WEB_AND_PRODUCTION: boolean = !IS_ELECTRON && IS_PROD && !IS_STAGING;

export const getStories = (): IStory[] => [
  {
    name: WalletId.WEB3,
    steps: hasWeb3Provider() ? [Web3ProviderDecrypt] : [Web3ProviderInstall],
    hideFromWalletList: IS_ELECTRON
  },
  {
    name: WalletId.WALLETCONNECT,
    steps: [NetworkSelectPanel, withWalletConnect(WalletConnectDecrypt)]
  },
  {
    name: WalletId.LEDGER_NANO_S,
    steps: [NetworkSelectPanel, LedgerNanoSDecrypt],
    hideFromWalletList: true
  },
  {
    name: WalletId.LEDGER_NANO_S_NEW,
    steps: [NetworkSelectPanel, LedgerDecrypt]
  },
  {
    name: WalletId.TREZOR,
    steps: [NetworkSelectPanel, TrezorDecrypt],
    hideFromWalletList: true
  },
  {
    name: WalletId.TREZOR_NEW,
    steps: [NetworkSelectPanel, TrezorUnlock]
  },
  {
    name: WalletId.KEYSTORE_FILE,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_STAGING || IS_ELECTRON ? KeystoreDecrypt : InsecureWalletWarning
    ],
    isDisabled: IS_WEB_AND_PRODUCTION
  },
  {
    name: WalletId.PRIVATE_KEY,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_STAGING || IS_ELECTRON ? PrivateKeyDecrypt : InsecureWalletWarning
    ],
    isDisabled: IS_WEB_AND_PRODUCTION
  },
  {
    name: WalletId.MNEMONIC_PHRASE,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_STAGING || IS_ELECTRON ? MnemonicDecrypt : InsecureWalletWarning
    ],
    isDisabled: IS_WEB_AND_PRODUCTION,
    hideFromWalletList: true
  },
  {
    name: WalletId.MNEMONIC_PHRASE_NEW,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_STAGING || IS_ELECTRON ? MnemonicUnlock : InsecureWalletWarning
    ],
    isDisabled: IS_WEB_AND_PRODUCTION
  },
  {
    name: WalletId.VIEW_ONLY,
    steps: [NetworkSelectPanel, ViewOnlyDecrypt]
  }
];
