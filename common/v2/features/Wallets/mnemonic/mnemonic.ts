import { MnemonicUnlockParams } from './types';
import { MnemonicWallet } from 'libs/wallet/deterministic/mnemonic';
import { translateRaw } from 'translations';
import { WrappedWallet } from 'libs/wallet';

export const unlockMnemonic = async (
  payload: MnemonicUnlockParams
): Promise<WrappedWallet | undefined> => {
  let wallet;
  const { phrase, pass, path, address } = payload;

  try {
    wallet = MnemonicWallet(phrase, pass, path, address);
  } catch (err) {
    // TODO: use better error than 'ERROR_14' (wallet not found)
    console.log('Error: ', translateRaw('ERROR_14'));
    return;
  }
  return wallet;
};
