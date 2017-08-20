// @flow
import PrivKeyWallet from './privkey';
import { decryptPrivKey } from 'libs/decrypt';

export default class EncryptedPrivKeyWallet extends PrivKeyWallet {
  constructor(encprivkey: string, password: string) {
    super(decryptPrivKey(encprivkey, password));
  }
}
