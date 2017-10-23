import { decryptMnemonicToPrivKey } from 'libs/decrypt';
import { fromPrivateKey } from 'ethereumjs-wallet';

export const MnemonicWallet = (
  phrase: string,
  pass: string,
  path: string,
  address: string
) => fromPrivateKey(decryptMnemonicToPrivKey(phrase, pass, path, address));
