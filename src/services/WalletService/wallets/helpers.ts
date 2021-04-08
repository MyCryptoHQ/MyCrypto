import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

import { DPath, WalletId } from '@types';

import { LedgerU2F, LedgerUSB } from './ledger';
import Trezor from './Trezor';

/**
 * Get the full derivation path with address index.
 *
 * @param {DPath} derivationPath The derivation path to get the full path for.
 * @param {number} addrIndex The address index or account index.
 */
export const getFullPath = (derivationPath: DPath, addrIndex: number): string => {
  if (derivationPath.isHardened) {
    return derivationPath.value.replace('addrIndex', addrIndex.toString());
  }
  return `${derivationPath.value}/${addrIndex}`;
};

export const selectWallet = async (walletId: WalletId) => {
  switch (walletId) {
    default:
    case WalletId.LEDGER_NANO_S_NEW: {
      const isWebUSBSupported = await TransportWebUSB.isSupported().catch(() => false);
      return isWebUSBSupported ? new LedgerUSB() : new LedgerU2F();
    }
    case WalletId.TREZOR_NEW:
      return new Trezor();
  }
};
