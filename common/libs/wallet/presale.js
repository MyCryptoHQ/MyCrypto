// @flow
import PrivKeyWallet from './privkey';
import { decryptPresaleToPrivKey } from 'libs/keystore';

export default class PresaleWallet extends PrivKeyWallet {
  constructor(keystore: string, password: string) {
    super(decryptPresaleToPrivKey(keystore, password));
  }
}
