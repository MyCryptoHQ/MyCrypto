import { WalletName } from './wallet';

export interface FormData {
  network: string;
  account: string;
  accountType: WalletName;
  label: string;
  derivationPath: string;
}
