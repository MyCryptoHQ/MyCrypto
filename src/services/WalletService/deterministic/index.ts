import { LedgerWallet as LedgerWalletWeb } from './ledger';
import { TrezorWallet as TrezorWalletWeb } from './trezor';

export * from './hardware';
export * from './deterministic';
export const LedgerWallet = LedgerWalletWeb;
export const TrezorWallet = TrezorWalletWeb;
export { default as useHDWallet } from './useHDWallet';
export * from './types';
export * from './helpers';
