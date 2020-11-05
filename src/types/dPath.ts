import { WalletId } from './walletId';

export interface DPath {
  label: string;
  value: string; // @todo determine method for more precise typing for path
  isHardened?: boolean;

  /**
   * Get the full derivation path with the address index. This can be used with hardened derivation
   * paths.
   *
   * @return {string}
   */
  getIndex?(addressIndex: number): string;
}

// We really want to use "keyof typeof HD_WALLETS" but it gives 'never'
export type DPathFormat =
  | WalletId.LEDGER_NANO_S
  | WalletId.TREZOR
  | WalletId.LEDGER_NANO_S_NEW
  | WalletId.TREZOR_NEW;

export type DPathFormats = Partial<Record<DPathFormat | 'default', DPath>>;
