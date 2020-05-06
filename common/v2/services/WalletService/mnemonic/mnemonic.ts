import { translateRaw } from 'v2/translations';
import { MnemonicWallet } from '../deterministic';
import { TUnlockMnemonic } from './types';

export const unlockMnemonic: TUnlockMnemonic = async (payload) => {
  let wallet;
  const { phrase, pass, path, address } = payload;

  try {
    wallet = MnemonicWallet(phrase, pass, path, address);
  } catch (err) {
    // TODO: use better error than 'ERROR_14' (wallet not found)
    // tslint:disable-next-line:no-console
    console.log('Error: ', translateRaw('ERROR_14'));
    return;
  }
  return wallet;
};
