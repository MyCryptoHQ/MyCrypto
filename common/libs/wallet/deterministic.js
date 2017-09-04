// @flow
import BaseWallet from './base';

export default class DeterministicWallet extends BaseWallet {
  address: string;
  dPath: string;

  constructor(address: string, dPath: string) {
    super();
    this.address = address;
    this.dPath = dPath;
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address);
  }

  getPath(): string {
    return this.dPath;
  }
}
