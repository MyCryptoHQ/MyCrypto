import { decryptPrivKey } from 'libs/decrypt';
import PrivKeyWallet from './privkey';

export default class EncryptedPrivKeyWallet extends PrivKeyWallet {
  constructor(encprivkey: string, password: string) {
    super(decryptPrivKey(encprivkey, password));
  }
}
