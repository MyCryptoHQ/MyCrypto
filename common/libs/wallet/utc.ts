import { decryptUtcKeystoreToPkey } from 'libs/keystore';
import PrivKeyWallet from './privkey';

export default class UtcWallet extends PrivKeyWallet {
  constructor(keystore: string, password: string) {
    super(decryptUtcKeystoreToPkey(keystore, password));
  }
}
