import { DerivationPath } from '@mycrypto/wallets';

import { WalletId } from './walletId';

// We really want to use "keyof typeof HD_WALLETS" but it gives 'never'
export type DPathFormat =
  | WalletId.LEDGER_NANO_S
  | WalletId.TREZOR
  | WalletId.LEDGER_NANO_S_NEW
  | WalletId.TREZOR_NEW;

export type DPathFormats = Partial<Record<DPathFormat | 'default', DerivationPath>>;
