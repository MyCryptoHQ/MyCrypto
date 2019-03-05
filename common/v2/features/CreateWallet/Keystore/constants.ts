import { SelectNetworkPanel } from '../components';
import { GenerateKeystoreFilePanel, SaveKeystoreFilePanel } from './components';

export enum KeystoreStages {
  SelectNetwork,
  GenerateKeystore,
  SaveKeystore
}

export const keystoreStageToComponentHash = {
  [KeystoreStages.SelectNetwork]: SelectNetworkPanel,
  [KeystoreStages.GenerateKeystore]: GenerateKeystoreFilePanel,
  [KeystoreStages.SaveKeystore]: SaveKeystoreFilePanel
};

export const keystoreFlow = [
  KeystoreStages.SelectNetwork,
  KeystoreStages.GenerateKeystore,
  KeystoreStages.SaveKeystore
];
