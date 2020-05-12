import { SelectNetworkPanel } from './components';

export enum CreateWalletStages {
  DownloadApp,
  SelectNetwork,
  SelectMethod,
  GeneratePhrase,
  BackUpPhrase,
  ConfirmPhrase,
  GeneratePassword,
  DownloadKeystore,
  SavePrivateKey
}

export const createWalletStageToComponentHash = {
  [CreateWalletStages.DownloadApp]: undefined,
  [CreateWalletStages.SelectNetwork]: SelectNetworkPanel,
  [CreateWalletStages.SelectMethod]: undefined,
  [CreateWalletStages.GeneratePhrase]: undefined,
  [CreateWalletStages.BackUpPhrase]: undefined,
  [CreateWalletStages.ConfirmPhrase]: undefined,
  [CreateWalletStages.GeneratePassword]: undefined,
  [CreateWalletStages.DownloadKeystore]: undefined,
  [CreateWalletStages.SavePrivateKey]: undefined
};

export const createWalletMnemonicFlow = [
  CreateWalletStages.SelectNetwork,
  CreateWalletStages.SelectMethod,
  CreateWalletStages.GeneratePhrase,
  CreateWalletStages.BackUpPhrase,
  CreateWalletStages.ConfirmPhrase
];
