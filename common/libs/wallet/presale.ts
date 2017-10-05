import { decryptPresaleToPrivKey } from 'libs/keystore';
import PrivKeyWallet from './privkey';

export default class PresaleWallet extends PrivKeyWallet {
  constructor(keystore: string, password: string) {
    super(decryptPresaleToPrivKey(keystore, password));
  }
}
