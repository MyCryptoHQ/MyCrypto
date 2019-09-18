import { HD_WALLETS, SECURE_WALLETS, HARDWARE_WALLETS, INSECURE_WALLETS } from 'v2/config';

export type HardwareWallet = keyof typeof HARDWARE_WALLETS;
export type HDWallet = keyof typeof HD_WALLETS;
export type SecureWallet = keyof typeof SECURE_WALLETS;
export type InsecureWallet = keyof typeof INSECURE_WALLETS;
