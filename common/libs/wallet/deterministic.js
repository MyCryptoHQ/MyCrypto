// @flow
import type { IWallet } from './IWallet';

export default class DeterministicWallet implements IWallet {
  address: string;
  dPath: string;
  index: number;

  constructor(address: string, dPath: string, index: number) {
    this.address = address;
    this.dPath = dPath;
    this.index = index;
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address);
  }

  getPath(): string {
    return `${this.dPath}/${this.index}`;
  }
}
