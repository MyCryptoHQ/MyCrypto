import { WalletTypes, WalletLib } from 'shared/enclave/types';
import Ledger from './ledger';
import Trezor from './trezor';
import Satochip from './satochip';
import KeepKey from './keepkey';

export const wallets: { [key in WalletTypes]: WalletLib } = {
  [WalletTypes.LEDGER]: Ledger,
  [WalletTypes.TREZOR]: Trezor,
  [WalletTypes.SATOCHIP]: Satochip,
  [WalletTypes.KEEPKEY]: KeepKey
};

export function getWalletLib(type: WalletTypes): WalletLib {
  return wallets[type];
}
