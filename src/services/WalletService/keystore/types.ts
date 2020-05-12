import { IFullWallet } from '../IWallet';

export interface KeystoreUnlockParams {
  file: string;
  password: string;
}

export type TUnlockKeystore = (payload: KeystoreUnlockParams) => Promise<IFullWallet | undefined>;
