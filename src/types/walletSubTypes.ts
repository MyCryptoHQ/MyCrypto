import { HD_WALLETS, INSECURE_WALLETS, SECURE_WALLETS, WEB3_WALLETS } from '@config';

import { WalletId } from './walletId';

export type HardwareWalletId =
  | WalletId.LEDGER_NANO_S
  | WalletId.LEDGER_NANO_S_NEW
  | WalletId.TREZOR
  | WalletId.TREZOR_NEW
  | WalletId.GRIDPLUS;
export type Web3WalletId = keyof typeof WEB3_WALLETS;
export type HDWalletId = keyof typeof HD_WALLETS;
export type SecureWalletId = keyof typeof SECURE_WALLETS;
export type InsecureWalletId = keyof typeof INSECURE_WALLETS;
