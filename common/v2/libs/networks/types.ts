import { SecureWalletName, InsecureWalletName } from 'v2/features/Wallets/types';

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.SAFE_T
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
