import { WrappedWallet } from '../helpers';

export interface MnemonicUnlockParams {
  phrase: string;
  pass: string | undefined;
  path: string;
  address: string;
}

export type TUnlockMnemonic = (payload: MnemonicUnlockParams) => Promise<WrappedWallet | undefined>;
