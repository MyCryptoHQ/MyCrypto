import Ledger from './ledger';
import Trezor from './trezor';
import KeepKey from './keepkey';
import { WalletTypes, WalletLib } from 'shared/enclave/types';

export const wallets: { [key in WalletTypes]: WalletLib } = {
  [WalletTypes.LEDGER]: Ledger,
  [WalletTypes.TREZOR]: Trezor,
  [WalletTypes.KEEPKEY]: KeepKey
};

export function getWalletLib(type: WalletTypes): WalletLib {
  return wallets[type];
}
