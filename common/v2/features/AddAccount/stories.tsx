import { SecureWalletName, InsecureWalletName, MiscWalletName, IStory } from 'v2/types';
import { IS_DEV, IS_ELECTRON, HAS_WEB3_PROVIDER } from 'v2/utils';
import { NetworkSelectPanel, SaveAndRedirect, ViewOnlyDecrypt } from './components';
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
    steps: HAS_WEB3_PROVIDER
      ? [NetworkSelectPanel, Web3ProviderDecrypt, SaveAndRedirect]
      : [Web3ProviderInstall]
  },
  {
    name: SecureWalletName.LEDGER_NANO_S,
    steps: [NetworkSelectPanel, LedgerNanoSDecrypt, SaveAndRedirect]
  },
  {
    name: SecureWalletName.TREZOR,
    steps: [NetworkSelectPanel, TrezorDecrypt, SaveAndRedirect]
  },
  {
    name: SecureWalletName.SAFE_T,
    steps: [NetworkSelectPanel, SafeTminiDecrypt, SaveAndRedirect]
  },
  {
    name: SecureWalletName.PARITY_SIGNER,
    steps: [NetworkSelectPanel, ParitySignerDecrypt, SaveAndRedirect]
  },
  {
    name: InsecureWalletName.KEYSTORE_FILE,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_ELECTRON ? KeystoreDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: IS_DEV ? IS_ELECTRON : !IS_ELECTRON
  },
  {
    name: InsecureWalletName.MNEMONIC_PHRASE,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_ELECTRON ? MnemonicDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: IS_DEV ? IS_ELECTRON : !IS_ELECTRON
  },
  {
    name: InsecureWalletName.PRIVATE_KEY,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_ELECTRON ? PrivateKeyDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: IS_DEV ? IS_ELECTRON : !IS_ELECTRON
  },
  {
    name: MiscWalletName.VIEW_ONLY,
    steps: [NetworkSelectPanel, ViewOnlyDecrypt, SaveAndRedirect]
  }
];
