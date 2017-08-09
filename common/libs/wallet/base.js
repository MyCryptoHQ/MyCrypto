// @flow
import { stripHex } from 'libs/values';

export default class BaseWallet {
  getAddress(): Promise<any> {
    return Promise.reject('Implement me');
  }

  getNakedAddress(): Promise<any> {
    return new Promise(resolve => {
      this.getAddress().then(address => {
        resolve(stripHex(address));
      });
    });
  }
}
