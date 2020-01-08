import {
  HD_WALLETS,
  SECURE_WALLETS,
  HARDWARE_WALLETS,
  INSECURE_WALLETS,
  WEB3_WALLETS
} from 'v2/config';

export type HardwareWalletId = keyof typeof HARDWARE_WALLETS;
export type Web3WalletId = keyof typeof WEB3_WALLETS;
export type HDWalletId = keyof typeof HD_WALLETS;
export type SecureWalletId = keyof typeof SECURE_WALLETS;
export type InsecureWalletId = keyof typeof INSECURE_WALLETS;
