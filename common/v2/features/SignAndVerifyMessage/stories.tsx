import { IStory, WalletId } from 'v2/types';
import { IS_DEV, IS_ELECTRON, hasWeb3Provider } from 'v2/utils';
import {
  LedgerNanoSDecrypt,
  KeystoreDecrypt,
  MnemonicDecrypt,
  PrivateKeyDecrypt,
  Web3ProviderDecrypt,
  Web3ProviderInstall,
  WalletConnectDecrypt
} from 'v2/components';

export const getStories = (): IStory[] => [
  {
    name: WalletId.METAMASK,
    steps: hasWeb3Provider() ? [Web3ProviderDecrypt] : [Web3ProviderInstall]
  },
  {
    name: WalletId.LEDGER_NANO_S,
    steps: [LedgerNanoSDecrypt]
  },
  {
    name: WalletId.WALLETCONNECT,
    steps: [WalletConnectDecrypt]
  },
  {
    name: WalletId.KEYSTORE_FILE,
    steps: [KeystoreDecrypt],
    hideFromWalletList: IS_DEV ? false : !IS_ELECTRON
  },
  {
    name: WalletId.MNEMONIC_PHRASE,
    steps: [MnemonicDecrypt],
    hideFromWalletList: IS_DEV ? false : !IS_ELECTRON
  },
  {
    name: WalletId.PRIVATE_KEY,
    steps: [PrivateKeyDecrypt],
    hideFromWalletList: IS_DEV ? false : !IS_ELECTRON
  }
];
