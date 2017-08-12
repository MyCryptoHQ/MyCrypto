// @flow
import PrivKeyWallet from './privkey';
import { decryptMewV1ToPrivKey } from 'libs/keystore';

export default class MewV1Wallet extends PrivKeyWallet {
  constructor(keystore: string, password: string) {
    super(decryptMewV1ToPrivKey(keystore, password));
  }
}
