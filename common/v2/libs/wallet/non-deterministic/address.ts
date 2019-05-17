import { IReadOnlyWallet } from '../IWallet';

export default class AddressOnlyWallet implements IReadOnlyWallet {
  public address = '';
  public readonly isReadOnly = true;

  constructor(address: string) {
    this.address = address;
  }

  public getAddressString() {
    return this.address;
  }
}
