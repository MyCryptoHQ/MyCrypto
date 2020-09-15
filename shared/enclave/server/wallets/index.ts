import { WalletLib, WalletTypes } from 'shared/enclave/types';

import KeepKey from './keepkey';
import Ledger from './ledger';
import Trezor from './trezor';

export const wallets: { [key in WalletTypes]: WalletLib } = {
  [WalletTypes.LEDGER]: Ledger,
  [WalletTypes.TREZOR]: Trezor,
  [WalletTypes.KEEPKEY]: KeepKey
};

export function getWalletLib(type: WalletTypes): WalletLib {
  return wallets[type];
}
