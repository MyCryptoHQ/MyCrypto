import { WalletId } from './walletId';

export interface DPath {
  label: string;
  value: string; // TODO determine method for more precise typing for path
}

// We really want to use "keyof typeof HD_WALLETS" but it gives 'never'
export type DPathFormat = WalletId.LEDGER_NANO_S | WalletId.TREZOR | WalletId.MNEMONIC_PHRASE;

export type DPathFormats = Partial<Record<DPathFormat | 'default', DPath>>;
