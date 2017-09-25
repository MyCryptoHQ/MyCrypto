import { randomBytes } from 'crypto';
import {
  privateToPublic,
  publicToAddress,
  toChecksumAddress
} from 'ethereumjs-util';
import { pkeyToKeystore, UtcKeystore } from 'libs/keystore';
import { signMessageWithPrivKey, signRawTxWithPrivKey } from 'libs/signing';
import { RawTransaction } from 'libs/transaction';
import { isValidPrivKey } from 'libs/validators';
import { stripHexPrefixAndLower } from 'libs/values';
import { IWallet } from './IWallet';

export default class PrivKeyWallet implements IWallet {
  public static generate() {
    return new PrivKeyWallet(randomBytes(32));
  }

  private privKey: Buffer;
  private pubKey: Buffer;
  private address: Buffer;

  constructor(privkey: Buffer) {
    if (!isValidPrivKey(privkey)) {
      throw new Error('Invalid private key');
    }
    this.privKey = privkey;
    this.pubKey = privateToPublic(this.privKey);
    this.address = publicToAddress(this.pubKey);
  }

  public getAddress(): Promise<string> {
    return Promise.resolve(
      toChecksumAddress(`0x${this.address.toString('hex')}`)
    );
  }

  public getPrivateKey() {
    return this.privKey.toString('hex');
  }

  public getNakedAddress(): Promise<string> {
    return new Promise(resolve => {
      this.getAddress().then(address => {
        resolve(stripHexPrefixAndLower(address));
      });
    });
  }

  public toKeystore(password: string): Promise<UtcKeystore> {
    return new Promise(resolve => {
      this.getNakedAddress().then(address => {
        resolve(pkeyToKeystore(this.privKey, address, password));
      });
    });
  }

  public unlock(): Promise<any> {
    return Promise.resolve();
  }

  public signRawTransaction(rawTx: RawTransaction): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(signRawTxWithPrivKey(this.privKey, rawTx));
      } catch (err) {
        reject(err);
      }
    });
  }

  public signMessage(msg: string, address: string, date: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        resolve(signMessageWithPrivKey(this.privKey, msg, address, date));
      } catch (err) {
        reject(err);
      }
    });
  }
}
