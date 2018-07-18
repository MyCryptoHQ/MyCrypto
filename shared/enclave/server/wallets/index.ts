import { WalletTypes, WalletLib } from 'shared/enclave/types';
import Ledger from './ledger';
import Trezor from './trezor';
import SafeT from './safe-t';
import KeepKey from './keepkey';

export const wallets: { [key in WalletTypes]: WalletLib } = {
  [WalletTypes.LEDGER]: Ledger,
  [WalletTypes.TREZOR]: Trezor,
  [WalletTypes.SAFE_T]: SafeT,
  [WalletTypes.KEEPKEY]: KeepKey
};

export function getWalletLib(type: WalletTypes): WalletLib {
  return wallets[type];
}
