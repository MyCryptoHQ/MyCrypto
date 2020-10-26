import { LedgerWallet as LedgerWalletWeb } from './ledger';
import { TrezorWallet as TrezorWalletWeb } from './trezor';

export * from './hardware';
export * from './deterministic';
export const LedgerWallet = LedgerWalletWeb;
export const TrezorWallet = TrezorWalletWeb;
export { default as DeterministicWalletService } from './DeterministicWalletService';
export { default as useDeterministicWallet } from './useDeterministicWallet';
export * from './types';
export * from './helpers';
