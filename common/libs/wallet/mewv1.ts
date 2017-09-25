import { decryptMewV1ToPrivKey } from 'libs/keystore';
import PrivKeyWallet from './privkey';

export default class MewV1Wallet extends PrivKeyWallet {
  constructor(keystore: string, password: string) {
    super(decryptMewV1ToPrivKey(keystore, password));
  }
}
