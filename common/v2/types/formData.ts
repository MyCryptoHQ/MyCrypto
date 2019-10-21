import { WalletId } from './walletId';
import { NetworkId } from './networkId';

export interface FormData {
  network: NetworkId;
  account: string;
  accountType: WalletId | undefined;
  label: string;
  derivationPath: string;
}
