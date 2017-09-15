// @flow
import PrivKeyWallet from './privkey';
import { decryptMnemonicToPrivKey } from 'libs/decrypt';

export default class MnemonicWallet extends PrivKeyWallet {
  constructor(phrase: string, pass: string, path: string, address: string) {
    super(decryptMnemonicToPrivKey(phrase, pass, path, address));
  }
}
