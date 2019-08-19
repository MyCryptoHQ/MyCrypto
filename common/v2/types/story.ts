import { WalletNameWithDefault } from './wallet';

export interface IStory {
  name: WalletNameWithDefault;
  steps: any[];
  hideFromWalletList?: string | boolean | undefined;
}
