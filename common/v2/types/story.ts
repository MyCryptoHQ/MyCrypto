import { WalletName } from './wallet';

export interface IStory {
  name: WalletName;
  steps: any[];
  hideFromWalletList?: string | boolean | undefined;
}
