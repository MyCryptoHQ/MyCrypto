import { IStory, WalletId } from 'v2/types';
import { IS_DEV, IS_ELECTRON, hasWeb3Provider } from 'v2/utils';
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

// This const is used to hideFromWalletList
// only if it is not the Desktop App and not the Dev environment
export const IS_NOT_ELECTRON_AND_IS_NOT_DEV: boolean = !IS_ELECTRON && !IS_DEV;

export const getStories = (): IStory[] => [
  {
    name: WalletId.WEB3,
    steps: hasWeb3Provider() ? [Web3ProviderDecrypt, SaveAndRedirect] : [Web3ProviderInstall]
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
    steps: [NetworkSelectPanel, ParitySignerDecrypt, SaveAndRedirect],
    hideFromWalletList: true
  },
  {
    name: WalletId.KEYSTORE_FILE,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_ELECTRON ? KeystoreDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: IS_NOT_ELECTRON_AND_IS_NOT_DEV
  },
  {
    name: WalletId.MNEMONIC_PHRASE,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_ELECTRON ? MnemonicDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: IS_NOT_ELECTRON_AND_IS_NOT_DEV
  },
  {
    name: WalletId.PRIVATE_KEY,
    steps: [
      NetworkSelectPanel,
      IS_DEV || IS_ELECTRON ? PrivateKeyDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: IS_NOT_ELECTRON_AND_IS_NOT_DEV
  },
  {
    name: WalletId.VIEW_ONLY,
    steps: [NetworkSelectPanel, ViewOnlyDecrypt, SaveAndRedirect]
  }
];
