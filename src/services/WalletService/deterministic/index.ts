import { LedgerWallet as LedgerWalletWeb } from './ledger';
import { TrezorWallet as TrezorWalletWeb } from './trezor';

export * from './useHDWallet';
export * from './hardware';
export * from './deterministic';
export const LedgerWallet = LedgerWalletWeb;
export const TrezorWallet = TrezorWalletWeb;
export * from './types';
export * from './helpers';
