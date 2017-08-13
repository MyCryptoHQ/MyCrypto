// @flow
import PrivKeyWallet from './privkey';
import { fromV3KeystoreToPkey } from 'libs/keystore';

export default class KeystoreWallet extends PrivKeyWallet {
  constructor(keystore: string, password: string) {
    super(fromV3KeystoreToPkey(keystore, password));
  }
}
