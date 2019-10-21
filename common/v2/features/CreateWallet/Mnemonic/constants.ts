import { SelectNetworkPanel } from '../components';
import { GeneratePhrasePanel, BackUpPhrasePanel, ConfirmPhrasePanel } from './components';
import { ComponentType } from 'react';
import { PanelProps } from '../CreateWallet';

export enum MnemonicStages {
  SelectNetwork,
  GeneratePhrase,
  BackUpPhrase,
  ConfirmPhrase
}

export interface MnemonicStageProps extends PanelProps {
  totalSteps: number;
  words?: string[];
  generateWords?(): void;
}

export const mnemonicStageToComponentHash: Record<
  MnemonicStages,
  ComponentType<MnemonicStageProps>
> = {
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
