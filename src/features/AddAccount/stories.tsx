import { IStory, WalletId } from '@types';
import { IS_DEV, IS_ELECTRON, hasWeb3Provider } from '@utils';
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
export const IS_NOT_ELECTRON_AND_IS_NOT_DEV: boolean = !IS_ELECTRON && !IS_DEV;

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
    steps: [NetworkSelectPanel, LedgerNanoSDecrypt]
  },
  {
    name: WalletId.LEDGER_NANO_S_NEW,
    steps: [NetworkSelectPanel, LedgerDecrypt],
    hideFromWalletList: !IS_DEV
  },
  {
    name: WalletId.TREZOR,
    steps: [NetworkSelectPanel, TrezorDecrypt]
  },
  {
    name: WalletId.TREZOR_NEW,
    steps: [NetworkSelectPanel, TrezorUnlock],
    hideFromWalletList: !IS_DEV
  },
  {
    name: WalletId.KEYSTORE_FILE,
    steps: [NetworkSelectPanel, IS_DEV || IS_ELECTRON ? KeystoreDecrypt : InsecureWalletWarning],
    isDisabled: IS_NOT_ELECTRON_AND_IS_NOT_DEV
  },
  {
    name: WalletId.PRIVATE_KEY,
    steps: [NetworkSelectPanel, IS_DEV || IS_ELECTRON ? PrivateKeyDecrypt : InsecureWalletWarning],
    isDisabled: IS_NOT_ELECTRON_AND_IS_NOT_DEV
  },
  {
    name: WalletId.MNEMONIC_PHRASE,
    steps: [NetworkSelectPanel, IS_DEV || IS_ELECTRON ? MnemonicDecrypt : InsecureWalletWarning],
    isDisabled: IS_NOT_ELECTRON_AND_IS_NOT_DEV
  },
  {
    name: WalletId.MNEMONIC_PHRASE_NEW,
    steps: [NetworkSelectPanel, IS_DEV || IS_ELECTRON ? MnemonicUnlock : InsecureWalletWarning],
    isDisabled: IS_NOT_ELECTRON_AND_IS_NOT_DEV,
    hideFromWalletList: !IS_DEV
  },
  {
    name: WalletId.VIEW_ONLY,
    steps: [NetworkSelectPanel, ViewOnlyDecrypt]
  }
];
