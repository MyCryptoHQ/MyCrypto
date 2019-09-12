import { getValues } from 'v2/utils/getValues';

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

export enum WalletType {
  SECURE = 'SECURE',
  INSECURE = 'INSECURE',
  MISC = 'VIEW_ONLY'
}

export const walletNames = getValues(
  SecureWalletName,
  HardwareWalletName,
  InsecureWalletName,
  MiscWalletName
);

export type WalletName = SecureWalletName | InsecureWalletName | MiscWalletName;
export type TWalletType = SecureWalletName | InsecureWalletName | MiscWalletName;
