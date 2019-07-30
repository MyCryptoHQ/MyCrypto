import { getValues } from 'v2/utils/getValues';

export interface Wallet {
  name: string;
  key: string;
  secure: boolean;
  web3: boolean;
  hardware: boolean;
  desktopOnly: boolean;
}

export interface ExtendedWallet extends Wallet {
  uuid: string;
}

export enum SecureWalletName {
  WEB3 = 'web3',
  LEDGER_NANO_S = 'ledgerNanoS',
  TREZOR = 'trezor',
  SAFE_T = 'safeTmini',
  PARITY_SIGNER = 'paritySigner'
}

export enum HardwareWalletName {
  LEDGER_NANO_S = 'ledgerNanoS',
  TREZOR = 'trezor',
  SAFE_T = 'safeTmini'
}

export enum InsecureWalletName {
  PRIVATE_KEY = 'privateKey',
  KEYSTORE_FILE = 'keystoreFile',
  MNEMONIC_PHRASE = 'mnemonicPhrase'
}

export enum MiscWalletName {
  VIEW_ONLY = 'viewOnly'
}

export enum DefaultWalletName {
  DEFAULT = 'walletsList'
}

export const walletNames = getValues(
  SecureWalletName,
  HardwareWalletName,
  InsecureWalletName,
  MiscWalletName
);

export type WalletName = SecureWalletName | InsecureWalletName | MiscWalletName;
