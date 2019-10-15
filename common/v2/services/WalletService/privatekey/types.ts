import { IFullWallet } from 'libs/wallet';

export interface PrivateKeyUnlockParams {
  key: string;
  password: string;
}

export type TUnlockPrivateKey = (
  payload: PrivateKeyUnlockParams
) => Promise<IFullWallet | undefined>;
