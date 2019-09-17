import { WalletId } from './walletId';

export interface IStory {
  name: WalletId;
  steps: any[];
  hideFromWalletList?: string | boolean | undefined;
}
