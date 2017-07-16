// @flow
import BaseWallet from './base';
import {
  privateToPublic,
  publicToAddress,
  toChecksumAddress
} from 'ethereumjs-util';
import { randomBytes } from 'crypto';
import { pkeyToKeystore } from 'libs/keystore';

export default class PrivKeyWallet extends BaseWallet {
  privKey: Buffer;
  pubKey: Buffer;
  address: Buffer;
  constructor(privkey: Buffer) {
    super();
    this.privKey = privkey;
    this.pubKey = privateToPublic(this.privKey);
    this.address = publicToAddress(this.pubKey);
  }

  getAddress() {
    return toChecksumAddress(`0x${this.address.toString('hex')}`);
  }

  getPrivateKey() {
    return this.privKey.toString('hex');
  }

  static generate() {
    return new PrivKeyWallet(randomBytes(32));
  }

  toKeystore(password: string): Object {
    return pkeyToKeystore(this.privKey, this.getNakedAddress(), password);
  }
}
