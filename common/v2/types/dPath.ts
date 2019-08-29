import { SecureWalletName, InsecureWalletName } from './wallet';

export interface DPath {
  label: string;
  value: string; // TODO determine method for more precise typing for path
}

export interface DPathFormats {
  default?: DPath;
  trezor?: DPath;
  safeTmini?: DPath;
  ledgerNanoS?: DPath;
  mnemonicPhrase: DPath;
}

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.SAFE_T
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
