import { IFullWallet } from '../IWallet';

export interface PrivateKeyUnlockParams {
  key: string;
  password: string;
}

export type TUnlockPrivateKey = (
  payload: PrivateKeyUnlockParams
) => Promise<IFullWallet | undefined>;
