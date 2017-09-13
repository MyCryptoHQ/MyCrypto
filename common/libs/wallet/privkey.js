// @flow
import type { IWallet } from './IWallet';
import {
  privateToPublic,
  publicToAddress,
  toChecksumAddress
} from 'ethereumjs-util';
import { randomBytes } from 'crypto';
import { pkeyToKeystore } from 'libs/keystore';
import { signRawTxWithPrivKey, signMessageWithPrivKey } from 'libs/signing';
import { isValidPrivKey } from 'libs/validators';
import type { RawTransaction } from 'libs/transaction';
import type { UtcKeystore } from 'libs/keystore';
import { stripHex } from 'libs/values';

export default class PrivKeyWallet implements IWallet {
  privKey: Buffer;
  pubKey: Buffer;
  address: Buffer;
  constructor(privkey: Buffer) {
    if (!isValidPrivKey(privkey)) {
      throw new Error('Invalid private key');
    }
    this.privKey = privkey;
    this.pubKey = privateToPublic(this.privKey);
    this.address = publicToAddress(this.pubKey);
  }

  getAddress(): Promise<string> {
    return Promise.resolve(
      toChecksumAddress(`0x${this.address.toString('hex')}`)
    );
  }

  getPrivateKey() {
    return this.privKey.toString('hex');
  }

  static generate() {
    return new PrivKeyWallet(randomBytes(32));
  }

  getNakedAddress(): Promise<string> {
    return new Promise(resolve => {
      this.getAddress().then(address => {
        resolve(stripHex(address));
      });
    });
  }

  toKeystore(password: string): Promise<UtcKeystore> {
    return new Promise(resolve => {
      this.getNakedAddress().then(address => {
        resolve(pkeyToKeystore(this.privKey, address, password));
      });
    });
  }

  unlock(): Promise<any> {
    return Promise.resolve();
  }

  signRawTransaction(rawTx: RawTransaction): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(signRawTxWithPrivKey(this.privKey, rawTx));
      } catch (err) {
        reject(err);
      }
    });
  }

  signMessage(msg: string, address: string, date: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        resolve(signMessageWithPrivKey(this.privKey, msg, address, date));
      } catch (err) {
        reject(err);
      }
    });
  }
}
