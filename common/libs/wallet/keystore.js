// @flow
import PrivKeyWallet from './privkey';
import { fromV3KeystoreToPkey } from 'libs/keystore';

export default class KeystoreWallet extends PrivKeyWallet {
  constructor(keystore: string | Object, password: string, nonStrict: boolean) {
    super(fromV3KeystoreToPkey(keystore, password, nonStrict));
  }
}
