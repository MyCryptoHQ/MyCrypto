import { IStory, WalletId } from 'v2/types';
import { IS_DEV, IS_ELECTRON, hasWeb3Provider } from 'v2/utils';
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
  WalletConnectDecrypt
} from 'v2/components';
import { withWalletConnect } from 'v2/services/WalletService';

import { NetworkSelectPanel } from './components';

// This const is used to disable non supported wallets
// only if it is not the Desktop App and not the Dev environment
export const IS_NOT_ELECTRON_AND_IS_NOT_DEV: boolean = !IS_ELECTRON && !IS_DEV;

export const getStories = (): IStory[] => [
  {
    name: WalletId.WEB3,
    steps: hasWeb3Provider() ? [Web3ProviderDecrypt] : [Web3ProviderInstall]
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
    name: WalletId.TREZOR,
    steps: [NetworkSelectPanel, TrezorDecrypt]
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
    name: WalletId.VIEW_ONLY,
    steps: [NetworkSelectPanel, ViewOnlyDecrypt]
  }
];
