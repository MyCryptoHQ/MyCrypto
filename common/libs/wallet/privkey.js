// @flow
import BaseWallet from './base';
import {
  privateToPublic,
  publicToAddress,
  toChecksumAddress
} from 'ethereumjs-util';

export type PrivateKeyUnlockParams = {
  key: string,
  password: string
};

export default class PrivKeyWallet extends BaseWallet {
  privKey: Buffer;
  pubKey: Buffer;
  address: Buffer;
  constructor(params: PrivateKeyUnlockParams) {
    super();
    this.privKey = Buffer.from(params.key, 'hex');
    this.pubKey = privateToPublic(this.privKey);
    this.address = publicToAddress(this.pubKey);
  }

  getAddress() {
    return toChecksumAddress(`0x${this.address.toString('hex')}`);
  }
}
