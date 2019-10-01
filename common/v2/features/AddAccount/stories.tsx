import { IStory, WalletId } from 'v2/types';
import { IS_DEV, IS_ELECTRON, HAS_WEB3_PROVIDER } from 'v2/utils';
import { NetworkSelectPanel, SaveAndRedirect } from './components';
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
  Web3ProviderInstall,
  ViewOnlyDecrypt
} from 'v2/components';

export const STORIES: IStory[] = [
  {
    name: WalletId.METAMASK,
    steps: HAS_WEB3_PROVIDER ? [Web3ProviderDecrypt, SaveAndRedirect] : [Web3ProviderInstall]
  },
  {
    name: WalletId.LEDGER_NANO_S,
    steps: [NetworkSelectPanel, LedgerNanoSDecrypt, SaveAndRedirect]
  },
  {
    name: WalletId.TREZOR,
    steps: [NetworkSelectPanel, TrezorDecrypt, SaveAndRedirect]
  },
  {
    name: WalletId.SAFE_T_MINI,
    steps: [NetworkSelectPanel, SafeTminiDecrypt, SaveAndRedirect]
  },
  {
    name: WalletId.PARITY_SIGNER,
    steps: [NetworkSelectPanel, ParitySignerDecrypt, SaveAndRedirect]
  },
  {
    name: WalletId.KEYSTORE_FILE,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_ELECTRON ? KeystoreDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: IS_DEV ? IS_ELECTRON : !IS_ELECTRON
  },
  {
    name: WalletId.MNEMONIC_PHRASE,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_ELECTRON ? MnemonicDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: IS_DEV ? IS_ELECTRON : !IS_ELECTRON
  },
  {
    name: WalletId.PRIVATE_KEY,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_ELECTRON ? PrivateKeyDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: IS_DEV ? IS_ELECTRON : !IS_ELECTRON
  },
  {
    name: WalletId.VIEW_ONLY,
    steps: [NetworkSelectPanel, ViewOnlyDecrypt, SaveAndRedirect]
  }
];
