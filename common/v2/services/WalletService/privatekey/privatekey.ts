import { translateRaw } from 'translations';
import { PrivateKeyUnlockParams } from './types';
import { getPrivKeyWallet } from '../non-deterministic';
import { IWallet, IFullWallet } from '../IWallet';

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
