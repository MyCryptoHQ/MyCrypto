import { IFullWallet } from '../IWallet';

export default class ParitySignerWallet implements IFullWallet {
  public address: string;

  constructor(address: string) {
    this.address = address;
  }

  public signRawTransaction = () =>
    Promise.reject(new Error('Parity Signer cannot sign raw transactions.'));

  public signMessage = () => Promise.reject(new Error('Parity Signer cannot sign messages.'));

  public getAddressString() {
    return this.address;
  }
}
