// @flow
import PrivKeyWallet from './privkey';
import { decryptUtcKeystoreToPkey } from 'libs/keystore';

export default class UtcWallet extends PrivKeyWallet {
  constructor(keystore: string, password: string) {
    super(decryptUtcKeystoreToPkey(keystore, password));
  }
}
