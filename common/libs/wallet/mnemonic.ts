import { decryptMnemonicToPrivKey } from 'libs/decrypt';
import PrivKeyWallet from './privkey';

export default class MnemonicWallet extends PrivKeyWallet {
  constructor(phrase: string, pass: string, path: string, address: string) {
    super(decryptMnemonicToPrivKey(phrase, pass, path, address));
  }
}
