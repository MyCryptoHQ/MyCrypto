import { IStory, WalletId } from 'v2/types';
import { IS_DEV, IS_ELECTRON, HAS_WEB3_PROVIDER } from 'v2/utils';
import {
  LedgerNanoSDecrypt,
  KeystoreDecrypt,
  MnemonicDecrypt,
  ParitySignerDecrypt,
  PrivateKeyDecrypt,
  Web3ProviderDecrypt,
  Web3ProviderInstall
} from 'v2/components';

export const STORIES: IStory[] = [
  {
    name: WalletId.METAMASK,
    steps: HAS_WEB3_PROVIDER ? [Web3ProviderDecrypt] : [Web3ProviderInstall]
  },
  {
    name: WalletId.LEDGER_NANO_S,
    steps: [LedgerNanoSDecrypt]
  },
  {
    name: WalletId.PARITY_SIGNER,
    steps: [ParitySignerDecrypt]
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
