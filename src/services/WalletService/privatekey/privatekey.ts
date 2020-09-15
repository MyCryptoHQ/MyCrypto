import { translateRaw } from '@translations';

import { IFullWallet, IWallet } from '../IWallet';
import { getPrivKeyWallet } from '../non-deterministic';
import { PrivateKeyUnlockParams } from './types';

export const unlockPrivateKey = async (
  payload: PrivateKeyUnlockParams
): Promise<IFullWallet | undefined> => {
  let wallet: IWallet | null = null;
  const { key, password } = payload;
  try {
    wallet = getPrivKeyWallet(key, password);
  } catch (e) {
    console.error('Error: ' + translateRaw('INVALID_PKEY'));
    return;
  }
  return wallet;
};
