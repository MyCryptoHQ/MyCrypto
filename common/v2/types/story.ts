import { WalletId } from './walletId';

export interface IStory {
  name: WalletId;
  steps: any[];
  isDisabled?: boolean;
  hideFromWalletList?: boolean;
}
