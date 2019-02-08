import { SelectNetworkPanel } from '../components';
import { GeneratePhrasePanel, BackUpPhrasePanel, ConfirmPhrasePanel } from './components';

export enum MnemonicStages {
  SelectNetwork,
  GeneratePhrase,
  BackUpPhrase,
  ConfirmPhrase
}

export const mnemonicStageToComponentHash = {
  [MnemonicStages.SelectNetwork]: SelectNetworkPanel,
  [MnemonicStages.GeneratePhrase]: GeneratePhrasePanel,
  [MnemonicStages.BackUpPhrase]: BackUpPhrasePanel,
  [MnemonicStages.ConfirmPhrase]: ConfirmPhrasePanel
};

export const mnemonicFlow = [
  MnemonicStages.SelectNetwork,
  MnemonicStages.GeneratePhrase,
  MnemonicStages.BackUpPhrase,
  MnemonicStages.ConfirmPhrase
];
