import { IFullWallet } from "libs/wallet";

export interface KeystoreUnlockParams {
  file: string;
  password: string;
}

export type TUnlockKeystore = (payload: KeystoreUnlockParams) => Promise<IFullWallet | undefined>;