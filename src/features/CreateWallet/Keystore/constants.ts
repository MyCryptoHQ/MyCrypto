import { SelectNetworkPanel } from '../components';
import {
  GenerateKeystoreFilePanel,
  MakeBackupPanel,
  SaveKeystoreFilePanel,
  VerifyKeystorePanel
} from './components';

export enum KeystoreStages {
  SelectNetwork,
  GenerateKeystore,
  SaveKeystore,
  MakeBackup,
  VerifyKeystore
}

export const keystoreStageToComponentHash = {
  [KeystoreStages.SelectNetwork]: SelectNetworkPanel,
  [KeystoreStages.GenerateKeystore]: GenerateKeystoreFilePanel,
  [KeystoreStages.SaveKeystore]: SaveKeystoreFilePanel,
  [KeystoreStages.MakeBackup]: MakeBackupPanel,
  [KeystoreStages.VerifyKeystore]: VerifyKeystorePanel
};

export const keystoreFlow = [
  KeystoreStages.GenerateKeystore,
  KeystoreStages.SelectNetwork,
  KeystoreStages.SaveKeystore,
  KeystoreStages.MakeBackup,
  KeystoreStages.VerifyKeystore
];
