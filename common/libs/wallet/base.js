// @flow
import { stripHex } from 'libs/values';
import type { RawTransaction } from 'libs/transaction';

export default class BaseWallet {
  getAddress(): Promise<string> {
    return Promise.reject('Implement me');
  }

  getNakedAddress(): Promise<string> {
    return new Promise(resolve => {
      this.getAddress().then(address => {
        resolve(stripHex(address));
      });
    });
  }

  signRawTransaction(_tx: RawTransaction): Promise<string> {
    return Promise.reject('Implement me');
  }
}
