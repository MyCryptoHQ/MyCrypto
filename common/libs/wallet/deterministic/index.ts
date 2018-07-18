import { WalletTypes } from 'shared/enclave/client';
import { makeEnclaveWallet } from './enclave';
import { LedgerWallet as LedgerWalletWeb } from './ledger';
import { TrezorWallet as TrezorWalletWeb } from './trezor';
import { SafeTWallet as SafeTWalletWeb } from './safe-t';

function enclaveOrWallet<T>(type: WalletTypes, lib: T) {
  return process.env.BUILD_ELECTRON ? makeEnclaveWallet(type) : lib;
}

export * from './mnemonic';
export * from './hardware';
export const LedgerWallet = enclaveOrWallet(WalletTypes.LEDGER, LedgerWalletWeb);
export const TrezorWallet = enclaveOrWallet(WalletTypes.TREZOR, TrezorWalletWeb);
export const SafeTWallet = enclaveOrWallet(WalletTypes.SAFE_T, SafeTWalletWeb);
