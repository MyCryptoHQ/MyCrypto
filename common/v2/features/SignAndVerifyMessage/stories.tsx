import { SecureWalletName, InsecureWalletName, IStory } from 'v2/types';
import { IS_DEV, IS_ELECTRON, HAS_WEB3_PROVIDER } from 'v2/utils';
import {
  InsecureWalletWarning,
  LedgerNanoSDecrypt,
  KeystoreDecrypt,
  MnemonicDecrypt,
  ParitySignerDecrypt,
  PrivateKeyDecrypt,
  SafeTminiDecrypt,
  TrezorDecrypt,
  Web3ProviderDecrypt,
  Web3ProviderInstall
} from 'v2/components';

export const STORIES: IStory[] = [
  {
    name: SecureWalletName.WEB3,
    steps: HAS_WEB3_PROVIDER ? [Web3ProviderDecrypt] : [Web3ProviderInstall]
  },
  {
    name: SecureWalletName.LEDGER_NANO_S,
    steps: [LedgerNanoSDecrypt]
  },
  {
    name: SecureWalletName.TREZOR,
    steps: [TrezorDecrypt]
  },
  {
    name: SecureWalletName.PARITY_SIGNER,
    steps: [ParitySignerDecrypt]
  },
  {
    name: SecureWalletName.SAFE_T,
    steps: [SafeTminiDecrypt]
  },
  {
    name: InsecureWalletName.KEYSTORE_FILE,
    steps: [IS_DEV || IS_ELECTRON ? KeystoreDecrypt : InsecureWalletWarning],
    hideFromWalletList: IS_DEV ? false : !IS_ELECTRON
  },
  {
    name: InsecureWalletName.MNEMONIC_PHRASE,
    steps: [IS_DEV || IS_ELECTRON ? MnemonicDecrypt : InsecureWalletWarning],
    hideFromWalletList: IS_DEV ? false : !IS_ELECTRON
  },
  {
    name: InsecureWalletName.PRIVATE_KEY,
    steps: [IS_DEV || IS_ELECTRON ? PrivateKeyDecrypt : InsecureWalletWarning],
    hideFromWalletList: IS_DEV ? false : !IS_ELECTRON
  }
];
