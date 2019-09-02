import { WalletName, NetworkId } from 'v2/types';

export interface FormData {
  network: NetworkId;
  account: string;
  accountType: WalletName;
  label: string;
  derivationPath: string;
}
