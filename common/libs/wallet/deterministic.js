// @flow
import type { IWallet } from './IWallet';

export default class DeterministicWallet implements IWallet {
  address: string;
  dPath: string;

  constructor(address: string, dPath: string) {
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
