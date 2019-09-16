import { TUnlockMnemonic } from './types';
import { translateRaw } from 'translations';
import { MnemonicWallet } from 'v2/services/EthService';

export const unlockMnemonic: TUnlockMnemonic = async payload => {
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
