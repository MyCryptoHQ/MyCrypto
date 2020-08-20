import { WalletId } from '@types';

export interface AbstractWalletResult {
  type: WalletId;
  address: string;
  path: string;
}

export interface MnemonicPhraseResult extends AbstractWalletResult {
  type: WalletId.MNEMONIC_PHRASE;
  withPassword: boolean;
}

export interface HardwareWalletResult extends AbstractWalletResult {
  type: WalletId.LEDGER_NANO_S | WalletId.TREZOR;
}

export type WalletResult = MnemonicPhraseResult | HardwareWalletResult;
