import { IReadOnlyWallet } from '../IWallet';

export default class AddressOnlyWallet implements IReadOnlyWallet {
  public address = '';
  public readonly isReadOnly = true;
  public readonly isOffline: boolean;

  constructor(address: string, isOffline: boolean = false) {
    this.address = address;
    this.isOffline = isOffline;
  }

  public getAddress() {
    return this.address;
  }
}
