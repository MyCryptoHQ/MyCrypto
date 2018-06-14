import { makeEnclaveWallet } from './enclave';
import { WalletTypes } from 'shared/enclave/client';
import { LedgerWallet as LedgerWalletWeb } from './ledger';

function enclaveOrWallet<T>(type: WalletTypes, lib: T) {
  return process.env.BUILD_ELECTRON ? makeEnclaveWallet(type) : lib;
}

export * from './mnemonic';
export * from './trezor';
export * from './hardware';
export const LedgerWallet = enclaveOrWallet(WalletTypes.LEDGER, LedgerWalletWeb);
