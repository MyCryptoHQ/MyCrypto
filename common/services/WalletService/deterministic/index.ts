import { WalletTypes } from 'shared/enclave/client';
import { WalletId, HardwareWalletId } from '@types';
import { makeEnclaveWallet } from './enclave';
import { LedgerWallet as LedgerWalletWeb } from './ledger';
import { TrezorWallet as TrezorWalletWeb } from './trezor';

function enclaveOrWallet<T>(type: HardwareWalletId, lib: T) {
  // To avoid modifying enclave which is outside of v2 we use a dictionary
  // to go from one enum to the other.
  const walletIdToWalletTypes = {
    [WalletId.LEDGER_NANO_S]: WalletTypes.LEDGER,
    [WalletId.TREZOR]: WalletTypes.TREZOR
  } as Record<HardwareWalletId, WalletTypes>;

  return process.env.BUILD_ELECTRON ? makeEnclaveWallet(walletIdToWalletTypes[type]) : lib;
}

export * from './mnemonic';
export * from './hardware';
export * from './deterministic';
export const LedgerWallet = enclaveOrWallet(WalletId.LEDGER_NANO_S, LedgerWalletWeb);
export const TrezorWallet = enclaveOrWallet(WalletId.TREZOR, TrezorWalletWeb);
