// @flow
import { stripHex } from 'libs/values';

export default class BaseWallet {
  getAddress(): string {
    throw 'Implement me';
  }

  getNakedAddress(): string {
    return stripHex(this.getAddress());
  }
}
